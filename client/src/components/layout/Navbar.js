/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
// import Particle from 'react-particles-js';
// import particlesConfig from './particleConfig.json';
import { setAccount, isManager, setAlert, openZkWalletDLG } from '../../actions/manager';
import { Stack, Typography, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@mui/icons-material/Menu';
import Web3 from 'web3'
import { shortAddress } from '../../utils/utils';
import { getTokenBalance } from '../../lib/minter';
import Alert from '../dialog/Alert';
import { ConnectButton, NavMenuItem } from '../StyledComponent/StyledInput';
import TemporaryDrawer from './NavDrawer';

const NETWORK = process.env.REACT_APP_NETWORK;
const RINKEBY_CHAINID = 4;
const MAINNET_CHAINID = 1;


const Navbar = ({ manager: { account, unlock, zksyncWallet, alertOpen, alertText }, setAlert, openSwapDLG, setAccount, isManager }) => {
  const [initWeb3, setInitWeb3] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [tokenBalance, setTokenBalance] = useState("0");

  useEffect(() => {
    if (window.ethereum && !initWeb3) {
      setInitWeb3(true);
      window.web3 = new Web3(window.ethereum);
      window.ethereum.on('accountsChanged', function (accounts) {
        // if (accounts[0] !== account) {
        console.log("change", accounts[0]);
        conMetamask();
        // }
      });
      window.ethereum.on('networkChanged', function (networkId) {
        if (Number(networkId) !== (NETWORK === 'rinkeby' ? RINKEBY_CHAINID : MAINNET_CHAINID)) {
          setAlert(true, `Connect to ${NETWORK} network on metamask.`);
          setAccount("");
          return;
        }
        conMetamask();
      });
      // conMetamask();
    }
    getRyoshiBalance(account, zksyncWallet);
  }, [initWeb3, setAlert, setAccount, account, zksyncWallet]);
  /// window.ethereum used to get addrss
  const conMetamask = async (e) => {
    // console.log(e);
    if (e && account) {
      setAccount("");
      return;
    }
    console.log('changed');
    if (window.ethereum) {
      try {
        // const addressArray = await window.ethereum.request({
        //   method: "eth_requestAccounts",
        // });
        // window.web3 = new Web3(window.ethereum);
        //   console.log("account",addressArray[0]);
        const chainId = await window.ethereum.request({
          method: "eth_chainId"
        });
        if (Number(chainId) !== (NETWORK === 'rinkeby' ? RINKEBY_CHAINID : MAINNET_CHAINID)) {
          setAlert(true, `Connect to ${NETWORK} network on metamask.`);
          setAccount("");
          return;
        }
        const accounts = await window.ethereum.enable();
        console.log(accounts);
        setAccount(accounts[0] !== undefined ? accounts[0] : "");
      } catch (err) {
      }
    } else {
      setAlert(true, "Install web3 wallet");
    }
  }

  const getRyoshiBalance = async () => {
    setTokenBalance((await getTokenBalance(account, zksyncWallet)) || "0");
  }

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ backgroundColor: "rgb(19, 5, 5)", p: 1 }}>
        {/* <Particle params={particlesConfig} className="nav_particle_container" /> */}
        <Stack direction="row" alignItems="center" sx={{ zIndex: '1' }} spacing={2}>
          <Hidden mdUp>
            <IconButton
              onClick={() => setOpenDrawer(true)}
              aria-label="Open Navigation"
            >
              <MenuIcon color="white" sx={{ textTransform: "inherit", fontSize: 40, color: "white" }} />
            </IconButton>
          </Hidden>
          <img src="/logo.png" width="128px" alt="logo"></img>
          <Hidden mdDown>
            <Typography variant="h4" color="white" sx={{ fontWeight: 'bold' }} textAlign='center'>
              Ryoshi Vision Concerts
            </Typography>
          </Hidden>
        </Stack>

        <Stack direction="row" alignItems="flex-end" spacing={1} sx={{ zIndex: '1' }}>
          <Hidden mdDown>
            <NavLink to='/drop' activeStyle={{ backgroundColor: "rgb(117 0 3)" }} style={{ textDecoration: 'none' }}>
              <NavMenuItem variant="h6">
                Drop
              </NavMenuItem>
            </NavLink>
            <NavLink to='/market' activeStyle={{ backgroundColor: "rgb(117 0 3)" }} style={{ textDecoration: 'none' }}>
              <NavMenuItem variant="h6">
                Mercatus
              </NavMenuItem>
            </NavLink>
            <NavLink to='/assets' activeStyle={{ backgroundColor: "rgb(117 0 3)" }} style={{ textDecoration: 'none' }}>
              <NavMenuItem variant="h6" color="white">
                Forge
              </NavMenuItem>
            </NavLink>
            <NavLink to='/buyeth' activeStyle={{ backgroundColor: "rgb(117 0 3)" }} style={{ textDecoration: 'none' }}>
              <NavMenuItem variant="h6" color="white">
                Buy ETH
              </NavMenuItem>
            </NavLink>
            <NavLink to='/buyryoshi' activeStyle={{ backgroundColor: "rgb(117 0 3)" }} style={{ textDecoration: 'none' }}>
              <NavMenuItem variant="h6" color="white">
                Buy Ryoshi
              </NavMenuItem>
            </NavLink>
            {
              isManager(account) ?
                <NavLink to='/manager' activeStyle={{ backgroundColor: "rgb(117 0 3)" }} style={{ textDecoration: 'none' }}>
                  <NavMenuItem variant="h6">
                    Manager
                  </NavMenuItem>
                </NavLink>
                : null
            }
          </Hidden>
          <Stack direction="column" >
            <Stack direction='row' spacing={1} sx={{ mb: "-10px" }}>
              {
                tokenBalance > 0 ?
                  <Typography className="neonText_green" varient="h6">You carry the Vision! </Typography>
                  :
                  <Typography className="neonText_red" varient="h6">No Ryoshi! Buy Ryoshi or pay Fiat</Typography>
              }
              {
                unlock ?
                  <Typography className="neonText_green" varient="h6">Unlocked </Typography>
                  :
                  <Typography className="neonText_red" varient="h6">Locked </Typography>
              }
            </Stack>
            <ConnectButton variant="contained" disabled={!initWeb3} onClick={conMetamask} sx={{ textTransform: "inherit" }}>
              {account ? `disconnect:${shortAddress(account)}` : `Connect`}
            </ConnectButton>
          </Stack>
        </Stack>
        <Alert open={alertOpen} handleClose={() => setAlert(false)} text={alertText} />
        <TemporaryDrawer open={openDrawer} manager={isManager(account)} closeDrawer={() => setOpenDrawer(false)} />
      </Stack>
    </>
  );
}

const mapStateToProps = (state) => ({
  manager: state.manager
});

export default connect(mapStateToProps, { setAccount, isManager, setAlert, openZkWalletDLG })(Navbar);