const express = require('express');
// const ipfsAPI = require('ipfs-api');
// const fs = require('fs');
const router = express.Router();
const hash = require('object-hash');
const Nft = require('../../models/Nft');
const NftId = require('../../models/NftId');
const axios = require('axios');
const zksync = require('zksync');
const { ethers } = require('ethers');
// const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })

//Reading file from computer
// let testFile = fs.readFileSync("D:/ryoshi_metadata.json");
//Creating buffer for ipfs function to add file to the system
// let testBuffer = new Buffer.from(testFile);

const nodemailer = require('nodemailer')

// The credentials for the email account you want to send mail from. 
const credentials = {
    service: 'GMail',
    auth: {
        // These environment variables will be pulled from the .env file
        // user: process.env.MAIL_USER,
        // pass: process.env.MAIL_PASS
        user: 'guruluckystacker@gmail.com',
        pass: 'wjsrlgkrdnjs2'
    }
}

const RYOSHI_PER_NFT = 0.01;
const DAI_ADDRESS_TEST = "0x2e055eee18284513b993db7568a592679ab13188";

router.post('/create',
    async (req, res) => {
        // console.log(req.body.metadata);
        try {
            let tokenUri = req.body.tokenUri;
            let price = req.body.price;
            let amount = req.body.amount;
            let maxAmount = req.body.maxAmount;
            let emailContents = req.body.emailContents;
            // let emailContent = emailContents.map(content => `${content.name}: ${content.content}`);     // convert object to string
            // let stringContent;
            // for (let i = 0; i < emailContent.length; i++) {
            //     stringContent += emailContent[i] + "\n";
            // }

            const newNft = new Nft({
                tokenUri: tokenUri,
                minPrice: price,
                approveOwners: [],
                mintOwners: [],
                amount: amount,
                maxAmount,
                left: amount,
                emailContents
            });
            const nft = await newNft.save();
            console.log(`created minPrice: ${price} amount: ${amount} tokenUri: ${tokenUri}`);
            res.json({
                _id: nft._id,
                tokenUri: nft.tokenUri,
                minPrice: nft.minPrice,
                amount: nft.amount,
                maxAmount: nft.maxAmount,
                left: nft.amount,
                emailContents: nft.emailContents
            }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

router.post('/update', async (req, res) => {
    try {
        let id = req.body.id;
        let amount = req.body.amount;
        let minPrice = req.body.price;
        let maxAmount = req.body.maxAmount;
        let emailContents = req.body.emailContents;
        const nft = await Nft.findById(id);
        const left = Number(nft.left) + (Number(amount) - Number(nft.amount));

        const result = await Nft.updateOne({ _id: id }, { $set: { amount, minPrice, maxAmount, left, emailContents } });
        if (result.n) {
            console.log(`updated ${id} Nft successfully.`);
            res.json(result);
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/nfts', async (req, res) => {
    try {
        let type = req.body.type;
        let offset = Number(req.body.offset);
        let limit = Number(req.body.limit);
        // console.log('all', all);
        let nfts;
        switch (type) {
            case 1: //market
                nfts = await Nft.find({ show: { $in: [0, 1] } }, { tokenUri: 1, minPrice: 1, amount: 1, maxAmount: 1, left: 1, emailContents: 1 }).skip(offset).limit(limit);
                break;
            case 2: //drop
                nfts = await Nft.find({ show: { $in: [0, 2] } }, { tokenUri: 1, minPrice: 1, amount: 1, maxAmount: 1, left: 1, emailContents: 1 }).skip(offset).limit(limit);
                break;
            case 0: //all
            default:
                nfts = await Nft.find({}, { tokenUri: 1, minPrice: 1, amount: 1, maxAmount: 1, left: 1, emailContents: 1, show: 1 }).skip(offset).limit(limit);
                break;
        };
        let totalCountNft = await Nft.countDocuments({});
        res.json({ nfts, totalCountNft });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/assets', async (req, res) => {
    try {
        // console.log("/assets", req.body);
        let email = req.body.email.split("+")[0] || "";
        let key = req.body.email.split("+")[1] || "";
        let account = req.body.account || "";
        let nfts = [], approves = [], mints = [];
        let approveNfts, mintNfts;
        if (email) {
            approveNfts = await Nft.find({ "approveOwners.address": email, "approveOwners.key": key });
            // console.log(approveNfts[0].approveOwners);
            approves = approveNfts.map(nft => {
                let amount = nft.approveOwners.find(owner => owner.address === email).amount;
                let ownerId = nft.approveOwners.find(owner => owner.address === email)._id;
                return {
                    _id: nft._id,
                    ownerId,
                    tokenUri: nft.tokenUri,
                    minPrice: nft.minPrice,
                    amount: amount,
                    type: "approve"
                };
            });
        }
        // else {
        //     approveNfts = await Nft.find({ "approveOwners.address": { "$ne": "" } });
        //     // console.log(approveNfts[0].approveOwners);
        //     approves = approveNfts.map(nft => {
        //         // console.log(nft.approveOwners);
        //         let id_amounts = nft.approveOwners.map(owner => ({id:owner._id, amount:owner.amount}));
        //         // console.log(amounts);
        //         return id_amounts.map(item => ({
        //             _id: nft._id,
        //             ownerId: item.id,
        //             tokenUri: nft.tokenUri,
        //             minPrice: nft.minPrice,
        //             amount: item.amount,
        //             owner: email,
        //             type: "approve"
        //         }));
        //     });
        // }

        // console.log('approves', approves);

        if (account) {
            mintNfts = await Nft.find({ "mintOwners.address": account });
            mints = mintNfts.map(nft => {
                let amount = nft.mintOwners.find(owner => owner.address === account).amount;
                let ownerId = nft.mintOwners.find(owner => owner.address === account)._id;
                return {
                    _id: nft._id,
                    ownerId,
                    tokenUri: nft.tokenUri,
                    minPrice: nft.minPrice,
                    amount: amount,
                    owner: account,
                    emailContents: nft.emailContents,
                    type: "mint"
                };
            });
        }
        // console.log('mints', mints);
        if (approves.length > 0) {
            for (let i = 0; i < approves.length; i++) {
                if (Array.isArray(approves[i])) {
                    nfts = [...nfts, ...approves[i]];
                } else {
                    nfts = [...nfts, approves[i]];
                }
            }
        }
        if (mints.length > 0) {
            nfts = [...nfts, ...mints];
        }

        // console.log("assets",nfts);
        res.json(nfts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/nftdata', async (req, res) => {
    let nftId = req.body.id;
    try {
        let nftData = await Nft.find({ nftIds: Number(nftId) }, { minPrice: 1, emailContents: 1, tokenUri: 1 });
        let nftIdData = await NftId.findOne({'zksyncId':Number(nftId)});
        // console.log(nftId, nftData[0]);
        res.json({ nftData: nftData[0], ryoshiId:nftIdData?.ryoshiId });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/mint', async (req, res) => {
    try {
        let id = req.body.id;
        let address = req.body.owner;
        let amount = req.body.amount;
        let email = req.body.email;
        let nftIds = req.body.nftIds;
        const nft = await Nft.findById(id);
        let updatedMintOwners = [], updatedApproveOwners = [];
        // console.log("mint",nft);
        if (email) {
            if (nft.approveOwners.find(owner => owner.address === email)) {
                if (nft.approveOwners.find(owner => owner.address === email).amount === amount) {
                    updatedApproveOwners = nft.approveOwners.filter(owner => owner.address !== email);
                } else {
                    updatedApproveOwners = nft.approveOwners.map(owner => {
                        if (owner.address === email) {
                            // console.log("exist", address);
                            owner.amount -= Number(amount);
                            if (owner.amount == 0)
                                return;
                            else
                                return owner;
                        }
                        return owner;
                    });
                }
                // console.log("updatedApproveOwners",updatedApproveOwners);
            }
        }
        if (nft.mintOwners.find(owner => owner.address === address)) {
            updatedMintOwners = nft.mintOwners.map(owner => {
                if (owner.address === address) {
                    owner.amount += Number(amount);
                    return owner;
                }
                return owner;
            });
        } else {
            updatedMintOwners = [...nft.mintOwners, { address, amount }];
        }

        let result;
        /////////////////////       add NFTs' ids minted in zksync
        await Nft.updateOne({ _id: id }, { $set: { nftIds: [...nft.nftIds, ...nftIds] } });
        ////////////////////        update approveOwners, mintOwners
        if (email) {
            result = await Nft.updateOne({ _id: id }, { $set: { approveOwners: updatedApproveOwners, mintOwners: updatedMintOwners } });
        } else {
            result = await Nft.updateOne({ _id: id }, { $set: { approveOwners: updatedApproveOwners, mintOwners: updatedMintOwners, left: nft.left - amount } });
        }
        //////////////////          add zksync NFTs' ryoshi ids into nftId collection
        const counts = await NftId.countDocuments({});
        let startId = 1;
        if (counts) {
            lastId = await NftId.findOne({}).sort({ryoshiId: -1});
            startId = Number(lastId.ryoshiId) + 1;
        }
        let newIds = [];
        for (let i = 0; i < nftIds.length; i++) {
            newIds.push({
                ryoshiId: startId + i,
                zksyncId: nftIds[i]
            });
        }
        await NftId.insertMany(newIds);

        const content = await axios.get(nft.tokenUri);

        if (result.n) {
            console.log(`mint ${amount} NFTs(${content.data.name}) by ${email || address}`);
            res.json({ amount });
        } else {
            res.json({ amount: 0 });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const transporter = nodemailer.createTransport(credentials);

router.post('/approve', async (req, res) => {
    try {
        // console.log(req);
        let id = req.body.id;
        let key = hash(req.body);
        let address = req.body.owner;
        let amount = req.body.amount;
        // let postalCode = req.body.postalCode;
        console.log("generate key", key);
        const nft = await Nft.findById(id);
        // console.log("approve", nft);
        let updatedOwners = [];
        if (nft.approveOwners.find(owner => owner.address === address)) {
            updatedOwners = nft.approveOwners.map(owner => {
                if (owner.address === address) {
                    // console.log("exist", address);
                    owner.amount += Number(amount);
                    owner.key = key
                    return owner;
                }
                return owner;
            });
            // console.log("updatedOwners",updatedOwners);
        } else {
            updatedOwners = [...nft.approveOwners, { address, amount, key }];
        }
        const result = await Nft.updateOne({ _id: id }, { $set: { approveOwners: updatedOwners, left: nft.left - amount } });
        const content = await axios.get(nft.tokenUri);
        ///send email
        if (result.n) {
            const email = {
                from: 'guruluckystacker@gmail.com',
                to: req.body.owner,
                subject: 'Ryoshi vision',
                text: `${nft.emailContents.toString()} \n This is a key for minting all NFTs(${content.data.name}) later. Please keep this key and use for minting later. ${key}`
            }

            try {
                await transporter.sendMail(email);
                console.log(email);
            } catch (err) {
                console.log('send mail', err);
            }
            console.log(`approve ${amount} NFTs(${content.data.name}) key:${key} by ${address}`);
            res.json({ amount });
        } else {
            res.json({ amount: 0 })
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/maxlimit', async (req, res) => {
    try {
        let id = req.body.id;
        let account = req.body.account;
        let email = req.body.email;
        let amount = req.body.amount;

        const nft = await Nft.findById(id);
        if (account) {
            const mintOwner = nft.mintOwners.find(owner => owner.address === account);
            let minted = 0;
            if (mintOwner) {
                minted = mintOwner.amount;
            }
            if (minted + Number(amount) <= nft.maxAmount || nft.maxAmount == undefined) {
                console.log(`${account} maxlimit passed`);
                res.json({ checked: true });
            } else {
                console.log(`${account} maxlimit failed`);
                res.json({ checked: false, msg: `You can't mint more than ${nft.maxAmount} Nfts. You have already minted ${minted} Nfts.` });
            }
        } else if (email) {
            const approveOwner = nft.approveOwners.find(owner => owner.address === email);
            let approved = 0;
            if (approveOwner) {
                approved = approveOwner.amount;
            }
            if (approved + Number(amount) <= nft.maxAmount || nft.maxAmount == undefined) {
                console.log(`${email} maxlimit passed`);
                res.json({ checked: true });
            } else {
                console.log(`${email} maxlimit failed`);
                res.json({ checked: false, msg: `You can't buy more than ${nft.maxAmount} Nfts. You have already bought ${approved} Nfts.` });
            }
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/check', async (req, res) => {
    try {
        let id = req.body.id;
        let key = req.body.key;
        const nft = await Nft.findOne({ "approveOwners.key": key, _id: id }).exec();
        // console.log("check",nft);
        if (nft) {
            const content = await axios.get(nft.tokenUri);
            const email = nft.approveOwners.find(owner => owner.key === key).address;
            console.log(`check key: ${key} for NFTs(${content.data.name}) by ${email}`);
            res.json({ email });
        } else {
            res.josn({ email: null });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const result = await Nft.remove({ _id: id });
        console.log(`deleted NFT(id:${id})`);
        res.json({ deleted: result.deletedCount });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/show', async (req, res) => {
    try {
        let id = req.body.id;
        let show = req.body.show;
        const result = await Nft.updateOne({ _id: id }, { $set: { show } });
        if (result.n) {
            res.json({ show: true });
            console.log(`${id} NFT showed ${show}`);
        } else {
            res.json({ show: false });
            console.log(`${id} NFT showed fail`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/transferRyoshi', async (req, res) => {
    let to = req.body.to;
    let amount = req.body.amount;
    const syncProvider = await zksync.getDefaultProvider('rinkeby');
    const ethersProvider = await ethers.getDefaultProvider(
        'rinkeby',
        {
            alchemy: "https://eth-rinkeby.alchemyapi.io/v2/0b9-h6iQGcN5mNxCTdJSzByB5WLkqR5I"
        }
    );

    // const ethWallet = ethers.Wallet.fromMnemonic('taxi erode orbit enforce apology present jump young diesel inform rhythm shrug');
    const ethWallet = new ethers.Wallet('28a59253ecb39a78eb951acd7392f3201f59483aea35ee9b4ce0b5623413e080').connect(ethersProvider);//creator
    const syncWallet = await zksync.Wallet.fromEthSigner(ethWallet, syncProvider);
    try {
        const transferTransaction = await syncWallet.syncTransfer({
            to,
            token: DAI_ADDRESS_TEST, // DAI address
            amount: ethers.utils.parseEther((RYOSHI_PER_NFT * amount).toString()),
            // fee: ethers.utils.parseEther("0.001")
        });

        // Wait till transaction is committed
        const transactionReceipt = await transferTransaction.awaitReceipt();
        console.log(`transfer ${to} ${RYOSHI_PER_NFT * amount} ryoshi`);
        res.json({ success: transactionReceipt.success });
    } catch (e) {
        console.log('transferEth err', e);
        res.status(500).send('Server Error');
    }
});

module.exports = router;