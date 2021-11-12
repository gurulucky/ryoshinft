import { ryoshi_nft_abi, ryoshi_token_abi } from '../artifacts/abi';
import { ethers } from 'ethers';

const NETWORK = process.env.REACT_APP_NETWORK;
const NFT_ADDRESS_TEST = "0xbC014A7eDA1e152d0E512eE5F5f16B9618a06E41";
const RYOSHI_ADDRESS_TEST = process.env.REACT_APP_RYOSHI_ADDRESS_TEST;
const RYOSHI_ADDRESS_MAIN = process.env.REACT_APP_RYOSHI_ADDRESS_MAIN;
const DAI_ADDRESS_TEST = process.env.REACT_APP_DAI_ADDRESS_TEST;
const CREATORS = [process.env.REACT_APP_CREATOR, "0x490EEDCDe44ce5A78536A56fDf3984494a42253e"];
// const CREATOR = "0xCe9499b23a087d2494956C33a064E075EC23dafc";


// export const mintWiCry = async (account, amount, tokenUri, minPrice) => {
//     // console.log("tokenUri:", tokenUri);
//     let ryoshi = new window.web3.eth.Contract(ryoshi_nft_abi, NFT_ADDRESS_TEST);
//     return await ryoshi.methods.mintWiCry(amount, tokenUri).send({ from: account, value: window.web3.utils.toWei((minPrice * amount).toString(), "ether") });
//     // ryoshi.methods.createCollectible(tokenUri).send({ from: account, value: window.web3.utils.toWei("0.001", "ether") })
//     //     .on("receipt", (receipt) => {
//     //         // console.log("receipt:", receipt);
//     //     }).on("error", (error) => {

//     //     });
//     // ryoshi.events.Transfer({ filter: { to: account } })
//     //     .on("data", function (event) {
//     //         let data = event.returnValues;
//     //         // setStatus(`You have minted NFT(${data.tokenId}) successfully.`);
//     //         // setOpenseaUrl(`https://testnets.opensea.io/assets/${NFT_ADDRESS_TEST}/${data.tokenId}`);
//     //         // setDisable(false);
//     //     }).on("error", (error) => {
//     //     });
// }

// export const mintWiFia = async (account, amount, tokenUri) => {
//     // console.log("tokenUri:", tokenUri);
//     let ryoshi = new window.web3.eth.Contract(ryoshi_nft_abi, NFT_ADDRESS_TEST);
//     return await ryoshi.methods.mintWiFia(amount, tokenUri).send({ from: account });
// }
const transferEth = async (wallet, to, price) => {
    try {
        const transferTransaction = await wallet.syncTransfer({
            to,
            token: "0x0000000000000000000000000000000000000000", // ETH address
            amount: ethers.utils.parseEther(price.toString()),
            // fee: ethers.utils.parseEther("0.001")
        });

        // Wait till transaction is committed
        const transactionReceipt = await transferTransaction.awaitReceipt();
        return transactionReceipt.success;
    } catch (e) {
        console.log('transferEth err', e);
    }
}

export const mintWiCry = async (zksyncWallet, amount, tokenUri, minPrice) => {
    let mintedNFTs = null;
    const contentHash = "0x" + getContentHashFromUri(tokenUri);
    // console.log(zksyncWallet);
    try {
        const res = await transferEth(zksyncWallet, CREATORS[0], minPrice * amount);
        if (res) {
            for (let i = 0; i < amount; i++) {
                const nft = await zksyncWallet.mintNFT({
                    recipient: zksyncWallet.address(),
                    contentHash,
                    feeToken: "ETH"
                })
                const receipt = await nft.awaitReceipt();
                console.log('mint', receipt);
                if (!receipt.success)
                    return null;
            }
            const state = await zksyncWallet.getAccountState(zksyncWallet.address());
            const comitNftIds = Object.keys(state.committed.nfts);
            mintedNFTs = comitNftIds.slice(comitNftIds.length - amount);
            // const state = await zksyncWallet.getAccountState(zksyncWallet.address());
            console.log('mintedNFTs', mintedNFTs);
            return mintedNFTs;
        }
        return null;
    } catch (e) {
        console.log('mintWiCry error', e)
        return null;
    }
}

export const mintWiFia = async (zksyncWallet, amount, tokenUri) => {
    let mintedNFTs = null;
    const contentHash = "0x" + getContentHashFromUri(tokenUri);
    try {
        for (let i = 0; i < amount; i++) {
            const nft = await zksyncWallet.mintNFT({
                recipient: zksyncWallet.address(),
                contentHash,
                feeToken: "ETH"
            })
            const receipt = await nft.awaitReceipt();
            console.log('mint', receipt);
            if (!receipt.success)
                return null;
        }
        const state = await zksyncWallet.getAccountState(zksyncWallet.address());
        const comitNftIds = Object.keys(state.committed.nfts);
        const veriNftIds = Object.keys(state.verified.nfts);
        mintedNFTs = comitNftIds.filter(nftId => veriNftIds.indexOf(nftId) === -1);
        // const state = await zksyncWallet.getAccountState(zksyncWallet.address());
        console.log('mintedNFTs', mintedNFTs);
        return mintedNFTs;
    } catch (e) {
        console.log('mintWiFia error', e);
        return null;
    }
}

export const withdrawNFT = async (zksyncWallet, nftId) => {
    try {
        const withdraw = await zksyncWallet.withdrawNFT({
            to: zksyncWallet.address(),
            token: nftId,
            feeToken: "ETH"
        });
        const receipt = await withdraw.awaitReceipt();
        console.log('withdraw', receipt);
        if (receipt.success) {
            return true;
        }
    } catch (err) {
        console.log(err.message);
    }
    return false;
}

export const unlockAccount = async (syncWallet) => {
    if (!(await syncWallet.isSigningKeySet())) {
        if ((await syncWallet.getAccountId()) === undefined) {
            throw new Error("Unknown account");
            return false;
        }

        try {
            // As any other kind of transaction, `ChangePubKey` transaction requires fee.
            // User doesn't have (but can) to specify the fee amount. If omitted, library will query zkSync node for
            // the lowest possible amount.
            const changePubkey = await syncWallet.setSigningKey({
                feeToken: "ETH",
                ethAuthType: "ECDSA",
            });

            // Wait until the tx is committed
            const changeReceipt = await changePubkey.awaitReceipt();
            console.log('unlock', await syncWallet.getAccountId());
            return true;
        } catch (error) {
            console.log('change account error', error);
            return false;
        }
    } else {
        console.log('unlock', await syncWallet.getAccountId());
        return true;
    }
}

export const getTokenBalance = async (account, zksyncWallet) => {
    if (!account) {
        return "0";
    }
    let ryoshiContract = new window.web3.eth.Contract(ryoshi_token_abi, NETWORK === 'rinkeby' ? RYOSHI_ADDRESS_TEST : RYOSHI_ADDRESS_MAIN);
    let ryoshi_L1 = ethers.utils.formatEther(await ryoshiContract.methods.balanceOf(account).call());
    let ryoshi_L2 = 0;
    if (zksyncWallet)
        ryoshi_L2 = ethers.utils.formatEther(await zksyncWallet.getBalance(NETWORK === 'rinkeby' ? DAI_ADDRESS_TEST : RYOSHI_ADDRESS_MAIN, 'verified'));
    console.log('ryoshi balance', Number(ryoshi_L1) + Number(ryoshi_L2));
    return Number(ryoshi_L1) + Number(ryoshi_L2);
}

export const isCreator = async (account) => {
    let ryoshi = new window.web3.eth.Contract(ryoshi_nft_abi, NFT_ADDRESS_TEST);
    const creator = await ryoshi.methods.owner().call();
    // console.log("creator", creator);
    if (creator.toLowerCase() === account.toLowerCase()) {
        return true;
    }
    return false;
}

export const getNextTokenId = async () => {
    let ryoshi = new window.web3.eth.Contract(ryoshi_nft_abi, NFT_ADDRESS_TEST);
    let lastTokenId = await ryoshi.methods.lastTokenId().call();
    let tokenCounter = await ryoshi.methods.tokenCounter().call();
    // console.log(lastTokenId, tokenCounter);
    if (tokenCounter === "0" && lastTokenId === "0") {
        return 0;
    }
    // console.log(maxTokenId);
    return Number(lastTokenId) + 1;
}

var to_b58 = function (
    B,            //Uint8Array raw byte input
    A             //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
) {
    var d = [],   //the array for storing the stream of base58 digits
        s = "",   //the result string variable that will be returned
        i,        //the iterator variable for the byte input
        j,        //the iterator variable for the base58 digit array (d)
        c,        //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
        n;        //a temporary placeholder variable for the current base58 digit
    for (i in B) { //loop through each byte in the input stream
        j = 0;                           //reset the base58 digit iterator
        c = B[i];                        //set the initial carry amount equal to the current byte amount
        s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
        while (j in d || c) {             //start looping through the digits until there are no more digits and no carry amount
            n = d[j];                    //set the placeholder for the current base58 digit
            n = n ? n * 256 + c : c;     //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
            c = n / 58 | 0;              //find the new carry amount (floored integer of current digit divided by 58)
            d[j] = n % 58;               //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
            j++                          //iterate to the next base58 digit
        }
    }
    while (j--)        //since the base58 digits are backwards, loop through them in reverse order
        s += A[d[j]]; //lookup the character associated with each base58 digit
    return s          //return the final base58 string
}

const fromHexString = hexString =>
    new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

var from_b58 = function (
    S,            //Base58 encoded string input
    A             //Base58 characters (i.e. "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
) {
    var d = [],   //the array for storing the stream of decoded bytes
        b = [],   //the result byte array that will be returned
        i,        //the iterator variable for the base58 string
        j,        //the iterator variable for the byte array (d)
        c,        //the carry amount variable that is used to overflow from the current byte to the next byte
        n;        //a temporary placeholder variable for the current byte
    for (i in S) { //loop through each base58 character in the input string
        j = 0;                             //reset the byte iterator
        c = A.indexOf(S[i]);             //set the initial carry amount equal to the current base58 digit
        if (c < 0)                          //see if the base58 digit lookup is invalid (-1)
            return undefined;              //if invalid base58 digit, bail out and return undefined
        c || b.length ^ i || b.push(0); //prepend the result array with a zero if the base58 digit is zero and non-zero characters haven't been seen yet (to ensure correct decode length)
        while (j in d || c) {               //start looping through the bytes until there are no more bytes and no carry amount
            n = d[j];                      //set the placeholder for the current byte
            n = n ? n * 58 + c : c;        //shift the current byte 58 units and add the carry amount (or just add the carry amount if this is a new byte)
            c = n >> 8;                    //find the new carry amount (1-byte shift of current byte value)
            d[j] = n % 256;                //reset the current byte to the remainder (the carry amount will pass on the overflow)
            j++                            //iterate to the next byte
        }
    }
    while (j--)               //since the byte array is backwards, loop through it in reverse order
        b.push(d[j]);      //append each byte to the result
    return new Uint8Array(b) //return the final byte array in Uint8Array format
}

function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

export const getContentHashFromUri = (tokenUri) => {
    let cid = tokenUri.split('/')[tokenUri.split('/').length - 1];
    var MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    var decoded = toHexString(from_b58(cid, MAP));
    console.log(decoded.slice(4));
    return decoded.slice(4);
}
///    i.e hash: 1220254e6bd53d59e21b8da8a15c74a534ca5500f6c9da9afd5da86d9d0b2fa26cbf
export const getCIDFromContenthash = (hash) => {
    var MAP = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    hash = '1220' + hash.slice(2);
    return to_b58(fromHexString(hash), MAP);
}