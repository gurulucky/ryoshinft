import * as types from '../actions/types';

const initialState = {
  status: "",
  alertText: "",
  alertOpen: false,
  zkwalletOpen: false,
  payOpen: false,
  paid: false,
  account: "",
  loadingAssets: false,
  // tokenBalance: "",
  zksyncWallet: null,
  unlock: false,
  nft: {},
  amount: 0,
  nfts: [],
  totalCountNft: 0,
  zkNfts: [],
  withdrawNfts: [],
  inputKeyOpen: false,
  mintingNow: false
};

function managerReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case types.SET_ACCOUNT:
      return {
        ...state,
        account: payload.account,
        // tokenBalance: payload.tokenBalance
      };
    case types.SET_UNLOCK:
      return {
        ...state,
        unlock: payload
      };
    case types.SET_ZKSYNCWALLET:
      return {
        ...state,
        zksyncWallet: payload
      };
    case types.CREATE_SUCCESS:
      return {
        ...state,
        nfts: [...state.nfts, payload]
      };
    case types.UPDATE_SUCCESS:
      return {
        ...state,
        nfts: state.nfts.map(nft => {
          if (nft._id === payload.id) {
            let left = Number(nft.left) + (Number(payload.amount) - Number(nft.amount));
            return { ...nft, amount: payload.amount, left, minPrice: payload.price, maxAmount: payload.maxAmount, emailContents: payload.emailContents };
          }
          return nft;
        })
      };
    case types.LOADING_ASSETS:
      return {
        ...state,
        loadingAssets: payload
      };
    case types.SET_TOTAL_COUNT_NFTS:
      return {
        ...state,
        totalCountNft: payload
      }
    case types.GET_NFTS:
      return {
        ...state,
        nfts: payload
      };
    case types.ADD_NFTS:
      return {
        ...state,
        nfts: state.nfts.concat(payload)
      };
    case types.GET_ZK_NFTS:
      return {
        ...state,
        zkNfts: payload
      };
    case types.GET_WITHDRAW_NFTS:
      return {
        ...state,
        withdrawNfts: payload
      };
    case types.SET_STATUS:
      return {
        ...state,
        status: payload
      };
    case types.SET_ALERT:
      return {
        ...state,
        ...payload
      };
    case types.OPEN_ZKWALLET_DLG:
      return {
        ...state,
        zkwalletOpen: payload
      };
    case types.SET_PAY:
      return {
        ...state,
        paid: payload
      };
    case types.SET_BUY_NFT_AMOUNT:
      return {
        ...state,
        ...payload
      };
    case types.OPEN_PAY:
      return {
        ...state,
        payOpen: payload
      };
    case types.APPROVE_SUCCESS:
      // let nfts = [...state.nfts];
      // let index = nfts.findIndex(item => item.tokenId === payload);
      // nfts[index].status = 1;  
      // console.log(nfts[index]);
      return {
        ...state,
        nfts: state.nfts.map(item => {
          if (item._id === payload.nft._id) {
            let left = item.left - payload.amount;
            return { ...item, left };
          }
          return item;
        })
      };
    case types.MINT_SUCCESS:
      // let nfts = [...state.nfts];
      // let index = nfts.findIndex(item => item.tokenId === payload);
      // nfts[index].status = 1;  
      // console.log(nfts[index]);
      return {
        ...state,
        nfts: state.nfts.map(item => {
          if (item._id === payload.nft._id) {
            let left = item.left - payload.amount;
            return { ...item, left };
          }
          return item;
        })
      };
    case types.OPEN_INPUT_KEY:
      return {
        ...state,
        inputKeyOpen: payload
      };
    case types.DELETE_SUCCESS:
      return {
        ...state,
        nfts: state.nfts.filter(nft => nft._id !== payload._id)
      };
    case types.SET_MINTING_NOW:
      return {
        ...state,
        mintingNow: payload
      };
    case types.WITHDRAW_NFT:
      return {
        ...state,
        nfts: state.nfts.filter(nft => nft.id !== payload)
      };
    default:
      return state;
  }
}

export default managerReducer;
