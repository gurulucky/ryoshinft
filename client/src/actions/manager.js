import api from '../utils/api';
import axios from 'axios';
import * as zksync from 'zksync';
import { ethers } from 'ethers';
import { mintWiCry, mintWiFia, withdrawNFT, getTokenBalance, unlockAccount, getCIDFromContenthash } from '../lib/minter';
// import { isBigger, shortAddress } from '../utils/utils';

import {
  SET_STATUS,
  SET_ALERT,
  OPEN_ZKWALLET_DLG,
  SET_ACCOUNT,
  SET_UNLOCK,
  SET_ZKSYNCWALLET,
  CREATE_SUCCESS,
  SET_TOTAL_COUNT_NFTS,
  GET_NFTS,
  ADD_NFTS,
  MINT_SUCCESS,
  SET_PAY,
  OPEN_PAY,
  APPROVE_SUCCESS,
  OPEN_INPUT_KEY,
  DELETE_SUCCESS,
  SET_BUY_NFT_AMOUNT,
  SET_MINTING_NOW,
  UPDATE_SUCCESS,
  WITHDRAW_NFT,
  LOADING_ASSETS,
  GET_ZK_NFTS,
  GET_WITHDRAW_NFTS,
} from './types';

console.log(process.env);
const NETWORK = process.env.REACT_APP_NETWORK;
const CREATORS = [process.env.REACT_APP_CREATOR, "0x490EEDCDe44ce5A78536A56fDf3984494a42253e"];
const RYOSHI_PER_NFT = Number(process.env.REACT_APP_RYOSHI_PER_NFT); //
const TOKEN_URI = 'https://ipfs.infura.io/ipfs/';
// const MORALIS_API_URL = 'https://deep-index.moralis.io/api/v2/';///////   owner_address/nft/token_address  for get NFTs by owner
const PARAMS_NET = `chain=${NETWORK}&format=decimal`;
const MORALIS_OPTION = {
  headers: {
    'accept': 'application/json',
    'X-API-Key': 'niA5R3R0oohLOT3tYoYpl18HeDSIg8vCLH8MPENlxKvUjbJ3j4o41zA9p1G1E2qx'
  }
};
const ZKSYNC_FACTORY_ADDRESS = NETWORK === 'rinkeby' ? process.env.REACT_APP_ZKSYNC_FACTORY_ADDRESS_LINK : process.env.REACT_APP_ZKSYNC_FACTORY_ADDRESS_MAIN;

export const setStatus = (status) => dispatch => {
  dispatch({
    type: SET_STATUS,
    payload: status
  })
}

export const setAlert = (open, text) => dispatch => {
  dispatch({
    type: SET_ALERT,
    payload: { alertOpen: open, alertText: text }
  })
}

export const openZkWalletDLG = (open) => dispatch => {
  dispatch({
    type: OPEN_ZKWALLET_DLG,
    payload: open
  })
}

export const openPay = (open) => dispatch => {
  dispatch({
    type: OPEN_PAY,
    payload: open
  })
}

// Load User
export const setAccount = (account) => async dispatch => {
  // console.log("action",account);
  // dispatch(setStatus(`${shortAddress(account)} connected`));
  // const tokenBalance = await getTokenBalance(account);
  // console.log("tokenBalance", tokenBalance);
  // tokenBalance = account?"1000":"";
  dispatch({
    type: SET_ACCOUNT,
    payload: { account }
  });
  dispatch({
    type: SET_ZKSYNCWALLET,
    payload: null
  })
  dispatch({
    type: SET_UNLOCK,
    payload: false
  })

  if (window.ethereum) {
    if (account) {
      try {

        const syncProvider = await zksync.getDefaultProvider(NETWORK);//'mainnet'
        let provider;
        let signer;
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        let syncWallet = await zksync.Wallet.fromEthSigner(signer, syncProvider);
        // console.log(`${account} zksync wallet created`);
        dispatch({
          type: SET_ZKSYNCWALLET,
          payload: syncWallet
        })
        // console.log(syncWallet);
        const res = await unlockAccount(syncWallet);
        // const res = true;
        if (res) {
          dispatch({
            type: SET_UNLOCK,
            payload: true
          })
          // dispatch(setAlert(true, `${shortAddress(account)} account is unlocked.`));
        } else {
          dispatch({
            type: SET_UNLOCK,
            payload: false
          })
          // dispatch(setAlert(true, [`${shortAddress(account)} account isn't unlocked. Please add funds of ETH to L2 for unlocking in `, <a href=' https://rinkeby.zksync.io/account' target='_blank'>here</a>, ` and connect again.`]));
          dispatch(openZkWalletDLG(true));
          dispatch(setAccount(""));
        }
      } catch (err) {
        console.log(err.message);
        dispatch(setAccount(""));
      }
    } else {
      dispatch({
        type: SET_ZKSYNCWALLET,
        payload: null
      })
      dispatch({
        type: SET_UNLOCK,
        payload: false
      })
    }
  }
};

export const createNFT = (tokenUri, amount, price, maxAmount, emailContents) => async (dispatch, getState) => {
  try {
    let account = getState().manager.account;
    if (account === "") {
      dispatch(setAlert(true, 'Connect to metamask'));
      return false;
      // } else if (!await isCreator(getState().manager.account)) {
    } else if (!CREATORS.find(item => item.toLowerCase() === account)) {
      dispatch(setAlert(true, 'You are not allowed for creating.'));
      return false;
    }
    let nft;
    // const tokenId = await getNextTokenId();
    // console.log("create", tokenId);
    const res = await api.post('/ryoshi/create', { tokenUri, amount, price, maxAmount, emailContents });
    nft = res.data;

    const content = await axios.get(nft.tokenUri);
    nft = { ...nft, ...content.data };
    dispatch(setAlert(true, `${amount} ${nft.name} NFTs are created`));
    dispatch({
      type: CREATE_SUCCESS,
      payload: nft
    });
    console.log("create nfts:", nft);
  } catch (err) {
    console.dir(err);
  }
}

export const updateNFT = (id, amount, price, maxAmount, emailContents) => async (dispatch, getState) => {
  try {
    console.log('updateid', id);
    let account = getState().manager.account;
    if (account === "") {
      dispatch(setAlert(true, 'Connect to metamask'));
      return false;
      // } else if (!await isCreator(getState().manager.account)) {
    } else if (!CREATORS.find(item => item.toLowerCase() === account)) {
      dispatch(setAlert(true, 'You are not allowed for creating.'));
      return false;
    }
    await api.post('/ryoshi/update', { id, amount, price, maxAmount, emailContents });
    // nft = res.data;

    // const content = await axios.get(nft.tokenUri);
    // nft = { ...nft, ...content.data };
    dispatch(setAlert(true, `NFT updated successfuly`));
    dispatch({
      type: UPDATE_SUCCESS,
      payload: { id, amount, price, maxAmount, emailContents }
    });
  } catch (err) {
    console.dir(err);
  }
}

// export const getNftContent = async (nft) => {
//   try {
//     await axios.get(nft.tokenUri).then((Response) => {

//     });
//   } catch (err) {
//     console.log("getContent: ", err);
//   }
//   return {};
// }
////    type = all:0, market:1, drop:2
export const getNfts = (type, offset, limit) => async dispatch => {
  try {
    // dispatch(setStatus('nfts loading ...'));
    const res = await api.post('/ryoshi/nfts', { type, offset, limit });
    let fullNfts = [];
    let nfts = res.data.nfts;
    let totalCountNft = res.data.totalCountNft;
    dispatch({
      type: SET_TOTAL_COUNT_NFTS,
      payload: Number(totalCountNft)
    });
    if (nfts.length === 0) {
      if (offset === 0) {
        dispatch({
          type: GET_NFTS,
          payload: []
        });
      }
      return;
    }
    for (let i = 0; i < nfts.length; i++) {
      let response = await axios.get(nfts[i].tokenUri);
      fullNfts.push({ ...nfts[i], ...response.data });
    }
    console.log("getNfts", fullNfts);
    if (offset === 0) {
      dispatch({
        type: GET_NFTS,
        payload: fullNfts
      })
    } else {
      dispatch({
        type: ADD_NFTS,
        payload: fullNfts
      })
    }
    dispatch(setStatus('nfts loading finished'));
  } catch (err) {
    console.log("getContent: ", err);
  }
}

export const getAssets = (email, account) => async dispatch => {
  try {
    console.log(email, account);
    dispatch({
      type: LOADING_ASSETS,
      payload: true
    })
    console.log(email, account);
    const res = await api.post('/ryoshi/assets', { email, account });
    let fullNfts = [];
    if (res.data.length === 0) {
      dispatch({
        type: GET_NFTS,
        payload: []
      });
      dispatch({
        type: LOADING_ASSETS,
        payload: false
      });
      return;
    }
    dispatch(setStatus('nfts loading ...'));
    for (let i = 0; i < res.data.length; i++) {
      let response = await axios.get(res.data[i].tokenUri);
      fullNfts.push({ ...res.data[i], ...response.data });
    }
    console.log("getAssets", fullNfts);
    dispatch({
      type: GET_NFTS,
      payload: fullNfts
    });
    dispatch({
      type: LOADING_ASSETS,
      payload: false
    });
    dispatch(setStatus('nfts loading finished'));
  } catch (err) {
    console.log("getContent: ", err);
  }
}

export const getZkNFTs = () => async (dispatch, getState) => {
  try {
    let zksyncWallet = getState().manager.zksyncWallet;
    let unlock = getState().manager.unlock;

    if (zksyncWallet && unlock) {
      console.log('getZkNFTs', unlock);
      let fullNfts = [];
      dispatch({
        type: LOADING_ASSETS,
        payload: true,
      });
      const state = await zksyncWallet.getAccountState(zksyncWallet.address);
      const comitNfts = state.committed.nfts;
      const comitNftIds = Object.keys(comitNfts);
      // console.log(comitNfts);
      const veriNftIds = Object.keys(state.verified.nfts);
      if (comitNftIds.length === 0) {
        dispatch({
          type: GET_ZK_NFTS,
          payload: []
        });
        dispatch({
          type: LOADING_ASSETS,
          payload: false,
        });
        return;
      }
      for (let i = 0; i < comitNftIds.length; i++) {
        let content;
        await axios.get(TOKEN_URI + getCIDFromContenthash(comitNfts[comitNftIds[i]].contentHash)).then((response) => {
          content = response.data;
        });
        const res = await api.post('/ryoshi/nftdata', { id: comitNfts[comitNftIds[i]].id });
        if (res.data.ryoshiId) {
          fullNfts.push({ zksyncId: comitNfts[comitNftIds[i]].id, status: 'pending', type: "mint", ...content, ...res.data.nftData, ryoshiId: res.data.ryoshiId });
        }
      }
      // console.log(veriNftIds);
      fullNfts = fullNfts.map(nft => {
        if (veriNftIds.indexOf(nft.zksyncId.toString()) >= 0) {
          return { ...nft, status: 'verified' };
        }
        return nft;
      });
      dispatch({
        type: GET_ZK_NFTS,
        payload: fullNfts
      });
      dispatch({
        type: LOADING_ASSETS,
        payload: false,
      });

      console.log("getZkNFTs", fullNfts);
    } else {
      dispatch({
        type: SET_UNLOCK,
        payload: false
      })
      dispatch({
        type: GET_ZK_NFTS,
        payload: []
      });
      // dispatch(setAlert(true, `Please unlock account.`));
    }

  } catch (err) {
    console.log(err);
  }
}

export const getWithdrawNFTs = () => async (dispatch, getState) => {
  try {
    let zksyncWallet = getState().manager.zksyncWallet;
    let unlock = getState().manager.unlock;
    if (zksyncWallet && unlock) {
      let fullNfts = [];
      dispatch({
        type: LOADING_ASSETS,
        payload: true,
      });
      const zk_res = await axios.get(`https://deep-index.moralis.io/api/v2/${zksyncWallet.address()}/nft/${ZKSYNC_FACTORY_ADDRESS}?${PARAMS_NET}`, MORALIS_OPTION);
      console.log(zk_res.data.result);
      const zkNfts = zk_res.data.result;
      if (zkNfts.length === 0) {
        dispatch({
          type: GET_WITHDRAW_NFTS,
          payload: []
        });
        dispatch({
          type: LOADING_ASSETS,
          payload: false,
        });
        return;
      }
      for (let i = 0; i < zkNfts.length; i++) {
        let content = [];
        let tokenUri = "";
        const res = await api.post('/ryoshi/nftdata', { id: zkNfts[i].token_id });
        if (res.data.ryoshiId) {
          if (res.data.nftData) {
            console.log(res.data);
            tokenUri = res.data.nftData.tokenUri;
          }
          if (tokenUri) {
            await axios.get(res.data.nftData.tokenUri).then((response) => {
              content = response.data;
            });
          }
          fullNfts.push({ zksyncId: zkNfts[i].token_id, type: "withdraw", ...content, ...res.data.nftData, ryoshiId: res.data.ryoshiId });
        }
      }
      dispatch({
        type: GET_WITHDRAW_NFTS,
        payload: fullNfts
      });
      dispatch({
        type: LOADING_ASSETS,
        payload: false,
      });
      console.log("getWithdrawNFTs", fullNfts);
    } else {
      dispatch({
        type: GET_WITHDRAW_NFTS,
        payload: []
      });
    }

  } catch (err) {
    console.log(err);
  }
}

///////   buy nft(mint directly(pay with crypto) or open payment dialog for paying with fiat)
export const buy = (account, nft, amount, type) => async (dispatch, getState) => {
  console.log("buy", account, amount, nft);
  let zksyncWallet = getState().manager.zksyncWallet;
  // let buyTokenIds = getBuyTokenIds(nft.tokenUri, amount, getState().manager.nfts);
  dispatch(setBuyNftAmount(nft, amount));

  if (account !== "" && type !== "usd") {
    try {
      //  check ownership
      const res = await checkMaxOwnership(account, "", nft._id, amount);
      if (!res.data.checked) {
        dispatch(setAlert(true, res.data.msg));
        return;
      }

      const balance = await getTokenBalance(account, zksyncWallet);
      // console.log("balance", balance, amount);
      if (balance >= RYOSHI_PER_NFT * amount) { //  having enough token, mint directly paying with ether
        // console.log("balance enough", balance);
        dispatch(setStatus(`${amount} NFTs(${nft.name}) is minting now...`));
        dispatch(setMintingNow(true));
        let receipt = await mintWiCry(zksyncWallet, amount, nft.tokenUri, nft.minPrice);
        if (receipt) {

          try {
            await api.post('ryoshi/mint', {
              id: nft._id,
              owner: account,
              amount,
              nftIds: receipt
            });
            dispatch({
              type: MINT_SUCCESS,
              payload: { nft, amount }
            });
            dispatch(setAlert(true, `${amount} NFTs(${nft.name}) is minted in L2 successfully.`));
          } catch (err) {
            console.log("mint err", err);
            dispatch(setAlert(true, `${amount} NFTs(${nft.name}) mint failed. Please try again.`));
          }
        } else {
          dispatch(setAlert(true, `${amount} NFTs(${nft.name}) mint failed. Please try again.`));
        }
      } else {
        dispatch(setStatus(""));
        dispatch(openPay(true));
        dispatch(setAlert(true, "Your ryoshi is not enough. Please pay with fiat and get ryoshi."));
      }

    } catch (err) {
      console.log("balance error", err);
    }
  } else {
    // dispatch(setAlert(true, "Don't you have metamask? Then you should buy with FIAT."));
    dispatch(openPay(true));
  }
  dispatch(setMintingNow(false));
}
//////    check max ownership
export const checkMaxOwnership = async (account, email, id, amount) => await api.post('/ryoshi/maxlimit', { account, email, id, amount });
//////    approve (pay with fiat) and get email with key from creator
export const approve = (email, postalCode) => async (dispatch, getState) => {
  // console.log(email);
  dispatch(openPay(false));
  dispatch(setAlert(true, 'Your payment succeeded. You has been approved for minting.'));
  dispatch(setStatus("It is approving now..."));
  dispatch(setMintingNow(true));
  let nft = getState().manager.nft;
  let amount = getState().manager.amount;
  try {
    await api.post('/ryoshi/approve', { owner: email, id: nft._id, amount });
    // if (res.data.tokenId === nft.tokenId) {
    dispatch({
      type: APPROVE_SUCCESS,
      payload: { nft, amount }
    });
    dispatch(setAlert(true, `${nft.name} Is grateful and thank you
    for buying one of their Concerts! Welcome to Ryoshi Vision Concerts.
    You will receive an email with further information on how to claim your NFT!`));
    dispatch(setStatus("Approving finished. Please check your email."))
    // }
  } catch (err) {
    console.log('approve err', err);
  }
  dispatch(setMintingNow(false));
}
/////   later mint
export const mint = (key) => async (dispatch, getState) => {
  dispatch(openInputKey(false));
  let nft = getState().manager.nft;
  let amount = getState().manager.amount;
  let account = getState().manager.account;
  let zksyncWallet = getState().manager.zksyncWallet;
  console.log(`minting ${amount} ${nft.name} by ${account}`);

  if (account === "") {
    dispatch(setAlert(true, 'Please connect metamask.'));
    return;
  }

  const res = await checkMaxOwnership(account, "", nft._id, amount);
  if (!res.data.checked) {
    dispatch(setAlert(true, res.data.msg));
    return;
  }

  const email = await checkKey(key, nft);
  console.log("mint by", email);
  if (email) {
    dispatch(setAlert(true, "You have chosen to enter the Vision!"));
    try {
      dispatch(setStatus(`${amount} NFTs(${nft.name}) is minting by ${email} now...`));
      dispatch(setMintingNow(true));
      // const receipt = await mintWiFia(account, amount, nft.tokenUri);
      let receipt = await mintWiFia(zksyncWallet, amount, nft.tokenUri);
      if (receipt) {
        const transferRes = await api.post('ryoshi/transferRyoshi', { amount, to: zksyncWallet.address() });

        try {
          await api.post('ryoshi/mint', {
            id: nft._id,
            owner: account,
            amount,
            email,
            nftIds: receipt
          });
          dispatch({
            type: MINT_SUCCESS,
            payload: { nft, amount, email }
          });
          // dispatch(getAssets(email, account));
          // console.log('minted',nft);
          if (!transferRes.data.success) {
            dispatch(setAlert(true, `${amount} NFTs(${nft.name}) mint success. But you don't get ryoshi. Please contact with Ryoshi NFT team.`));
          } else {
            dispatch(setAlert(true, `${amount} NFTs(${nft.name}) is minted successfully.`));
          }
        } catch (err) {
          console.log("mint err", err);
          dispatch(setAlert(true, `${amount} NFTs(${nft.name}) mint failed. Please try again.`));
        }
      } else {
        console.log("receipt", receipt);
      }
    } catch (err) {
      dispatch(setAlert(true, `${nft.name}(#${nft.tokenId}) mint failed. Please try again.`));
      console.log('mint err', err);
    }
  } else {
    dispatch(setAlert(true, `Key ${key} is invalid. Please try again.`));
  }
  dispatch(setMintingNow(false));
}
/////   withdraw NFT
export const withdrawNFTtoL1 = (nftId) => async (dispatch, getState) => {
  let zksyncWallet = getState().manager.zksyncWallet;
  const res = await withdrawNFT(zksyncWallet, nftId);
  if (res) {
    dispatch({
      type: WITHDRAW_NFT,
      payload: nftId
    });
    dispatch(setAlert(true, `NFT-${nftId} is withdrawn to L1. It takes some minutes.`));
  } else {
    dispatch(setAlert(true, `withdrawing NFT-${nftId} failed.`));
  }
}

export const setPay = () => (dispatch, getState) => {
  dispatch({
    type: SET_PAY,
    payload: true
  });
}

export const setBuyNftAmount = (nft, amount) => dispatch => {
  dispatch({
    type: SET_BUY_NFT_AMOUNT,
    payload: { nft, amount }
  });
}

export const checkKey = async (key, nft) => {
  try {
    const res = await api.post('/ryoshi/check', { key, id: nft._id });
    console.log('checked for', res.data.email, key);
    return res.data.email
  } catch (err) {
    console.log("check key", err);
    return null;
  }
}

export const openInputKey = (open, nft, amount) => (dispatch, getState) => {
  if (nft && amount) {
    dispatch(setBuyNftAmount(nft, amount));
  }

  dispatch({
    type: OPEN_INPUT_KEY,
    payload: open
  });
};

export const deleteNft = (nft) => async (dispatch, getState) => {
  try {
    let account = getState().manager.account;
    if (account === "") {
      dispatch(setAlert(true, 'Connect to metamask'));
      return false;
      // } else if (!await isCreator(getState().manager.account)) {
    } else if (!CREATORS.find(item => item.toLowerCase() === account)) {
      dispatch(setAlert(true, 'You are not allowed for deleting.'));
      return false;
    }
    const res = await api.delete(`/ryoshi/delete/${nft._id}`);
    if (res.data.deleted === 0) {
      dispatch(setAlert(true, `NFT(${nft.name}) not deleted.`));
      return;
    }
    dispatch(setAlert(true, `${res.data.deleted} NFTs(${nft.name}) have been deleted.`));
    dispatch({
      type: DELETE_SUCCESS,
      payload: nft
    });
  } catch (err) {
    console.log("delete nft", err);
  }
}

export const isManager = (account) => dispatch => {
  if (CREATORS.find(item => item.toLowerCase() === account)) {
    return true;
  }
  return false;
}

export const setMintingNow = (minting) => dispatch => {
  dispatch({
    type: SET_MINTING_NOW,
    payload: minting
  })
}

export const setShowNft = (nft, show) => async dispatch => {
  try {
    await api.post('/ryoshi/show', { id: nft._id, show });
  } catch (err) {

  }
}