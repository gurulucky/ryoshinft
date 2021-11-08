import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container } from '@material-ui/core';
// import { pinJSONToIPFS } from './pinata';
import NftViewer from './nfts/NftViewer';
import ZkWalletDialog from '../dialog/ZksyncWallet';
import Payment from '../dialog/Payment';
import { setStatus, openZkWalletDLG, openPay, approve } from '../../actions/manager';
import { getTokenBalance } from '../../lib/minter';

require('dotenv').config();


// var metadata_template = {
//     "name": "",
//     "description": "",
//     "image": "",
//     "attributes": [{
//         "trait_type": "popular",
//         "value": 100
//     }],
//     "animation_url": ""
// }

const Market = ({ account, zksyncWallet, zkwalletOpen, openZkWalletDLG, openPay, amount, approve, payOpen }) => {
    const [ryoshiBalance, setRyoshiBalance] = useState("0");
    useEffect(() => {
        getRyoshiBalance(account, zksyncWallet);
    }, [account, zksyncWallet]);

    const getRyoshiBalance = async (account) => {
        setRyoshiBalance(await getTokenBalance(account, zksyncWallet));
    }

    return (
        <Container sx={{ py: "20px", minHeight: window.innerHeight + 'px' }}>
            {
                !zkwalletOpen ?
                    <>
                        <NftViewer ryoshi={ryoshiBalance} />
                        <Payment open={payOpen} amount={amount} handleClose={() => openPay(false)} handleOk={approve} />
                    </>
                    :
                    <ZkWalletDialog handleClose={()=>openZkWalletDLG(false)}/>
            }
        </Container>
    );
}


const mapStateToProps = (state) => ({
    status: state.manager.status,
    account: state.manager.account,
    zksyncWallet: state.manager.zksyncWallet,
    zkwalletOpen: state.manager.zkwalletOpen,
    payOpen: state.manager.payOpen,
    amount: state.manager.amount
});

export default connect(mapStateToProps, { setStatus, openZkWalletDLG, openPay, approve })(Market);