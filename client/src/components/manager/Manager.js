import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { create } from 'ipfs-http-client'
import { Stack, MenuItem, Container } from '@material-ui/core';
// import {writeJsonFile} from 'write-json-file';
import NftViewer from './nfts/NftViewer';
import { isInt } from '../../utils/utils';
import { AmountField, BuyButton } from '../StyledComponent/StyledInput';

import { createNFT,  setAlert, isManager, updateNFT } from '../../actions/manager';
// import { pinJSONToIPFS } from './pinata';

const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;

const axios = require('axios');

const client = create('https://ipfs.infura.io:5001/api/v0');

const UPLOAD_TYPE = {
    IMAGE: "image",
    METADATA: "metadata"
}

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

const Manager = ({ account, status, alertOpen, alertText, createNFT,  setAlert, isManager, updateNFT }) => {
    const history = useHistory();
    const [imageUrl, setImageUrl] = useState('https://ipfs.infura.io/ipfs/QmTXA1brmnYViGB9uw7bNV12steixP56BBMmDQxxmfyByX');
    const [metadataUrl, setMetadataUrl] = useState('https://gateway.pinata.cloud/ipfs/QmY9y2RjBADkChVzY5VLE3PbiAwtBA69cSRjoiPpCP3T5G');//0x122091d830aff41295483756078d01f8d8641f79974bc70a5dc1e6a2e467d28471ef
    const [metaData, setMetaData] = useState({ name: '', description: '' });
    const [disable, setDisable] = useState(false);
    const [amount, setAmount] = useState(1);
    const [price, setPrice] = useState(0.001);
    const [contentAmount, setContentAmount] = useState(1);
    const [maxAmount, setMaxAmount] = useState(1);
    const [emailContents, setEmailContents] = useState([{ name: "", content: "" }]);
    const [updateNftId, setUpdateNftId] = useState("");

    const uploadImgRef = useRef(null);
    const uploadMetadataRef = useRef(null);

    async function onUpload(e, type) {
        setDisable(true);
        const file = e.target.files[0];
        // pinFileToIPFS(file);
        try {
            console.log('uploading file...');
            const added = await client.add(file)
            // console.log(added);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            if (type === UPLOAD_TYPE.IMAGE) {
                setImageUrl(url);
            } else if (type === UPLOAD_TYPE.METADATA) {
                setMetadataUrl(url);
            }
            console.log(type + ' is uploaded at:' + url);
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
        setDisable(false);
    }

    const onMetaDataChange = (e) => {
        setMetaData({ ...metaData, [e.target.name]: e.target.value });
    }

    const onClickUpload = (type) => {
        if (type === UPLOAD_TYPE.IMAGE) {
            uploadImgRef.current.click();
        } else if (type === UPLOAD_TYPE.METADATA) {
            uploadMetadataRef.current.click();
        }
    }

    const uploadMetadata = async () => {
        // console.log(metaData);
        setDisable(true);
        // setImageUrl("https://ipfs.infura.io/ipfs/QmPjPuf1W4SpYZ4rqARAsNqGBrdfXMVW5euh9AgL6uideS");
        if (metaData.name === "" || metaData.description === "" || imageUrl === "") {
            setAlert(true, "Please check whether input data is empty or image file is uploaded.");
            setDisable(false);
            return;
        }

        //make metadata
        console.log("metadata uploading now");
        const metadata = {};
        metadata.name = metaData.name;
        metadata.image = imageUrl;
        metadata.description = metaData.description;

        //make pinata call
        await pinJSONToIPFS(metadata);
    }

    const pinJSONToIPFS = async (JSONBody) => {
        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        // console.log("pina_api_key",key);
        //making axios POST request to Pinata ⬇️
        axios.post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
            .then(function (response) {
                setMetadataUrl("https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);
                console.log("metadata uploaded at https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);
                setDisable(false);
            })
            .catch(function (error) {
                console.log("metadata upload fail", error.message);
                setDisable(false);
            });
    };

    const onCreate = (e) => {
        if (!isInt(amount) || amount < 1) {
            setAlert(true, "Please input correct amount.");
            return;
        }
        if (price <= 0) {
            setAlert(true, "Please input correct price.");
            return;
        }
        if (!isInt(maxAmount) || maxAmount < 1) {
            setAlert(true, "Please input correct max buy amount.");
            return;
        }
        for (let i = 0; i < emailContents.length; i++) {
            if (emailContents[i].name.trim() === "" || emailContents[i].content.trim() === "") {
                setAlert(true, `Please fill in ${i + 1}th email content`);
                return;
            }
        }
        createNFT(metadataUrl, amount, price, maxAmount, emailContents);
    }

    const onUpdate = (e) => {
        if (!isInt(amount) || amount < 1) {
            setAlert(true, "Please input correct amount.");
            return;
        }
        if (price <= 0) {
            setAlert(true, "Please input correct price.");
            return;
        }
        if (!isInt(maxAmount) || maxAmount < 1) {
            setAlert(true, "Please input correct max buy amount.");
            return;
        }
        for (let i = 0; i < emailContents.length; i++) {
            if (emailContents[i].name.trim() === "" || emailContents[i].content.trim() === "") {
                setAlert(true, `Please fill in ${i + 1}th email content`);
                return;
            }
        }
        // console.log('udpate', updateNftId);
        updateNFT(updateNftId, amount, price, maxAmount, emailContents);
    }

    const changeContentAmount = (event) => {
        let amount = event.target.value;
        setContentAmount(amount);
        let contents = emailContents;
        let contentsLength = contents.length;
        // console.log(amount, contents.length);
        if (amount > contents.length) {
            for (let i = 0; i < amount - contentsLength; i++) {
                contents = [...contents, { name: "", content: "" }];
            }
            setEmailContents(contents);
        } else if (amount < contentsLength) {
            contents = contents.slice(0, amount);
            setEmailContents(contents);
        }
    };

    const showNftData = (nft) => {
        console.log("show",nft.image);
        setUpdateNftId(nft._id);
        setImageUrl(nft.image);
        setMetaData({ name: nft.name, description: nft.description });
        setAmount(nft.amount);
        setPrice(nft.minPrice);
        setMaxAmount(nft.maxAmount || 0);
        setContentAmount(nft.emailContents.length);
        // console.log('emailcontents', nft.emailContents);
        setEmailContents(nft.emailContents.map(content => ({ name: content.name, content: content.content })));
    }

    return <>
        {!isManager(account) && history.goBack()}
        <Container sx={{ minHeight: window.innerHeight+'px' }}>
            {/* <Box component="div" sx={{ my: '5px' }}>
                <Typography variant="body1" color="primary" sx={{ backgroundColor: "white", textAlign: 'center' }}>
                    {status}
                </Typography>
            </Box> */}
            <Stack direction={{ xs: "column", sm: "column", md: "row" }} spacing={2} justifyContent="center" alignItems={{ md: "flex-start", xs: "center" }} >
                <Stack direction='column'>
                    <Stack justifyContent="center" alignItems="center" sx={{ width: "320px", height: "320px", backgroundColor: "rgb(41, 41, 41)", border: "1px solid rgb(226 29 29)" }}>
                        <img src={imageUrl || '/empty.png'} alt={imageUrl} style={{ display: "block", maxWidth: "320px", maxHeight: "320px", width: "auto", height: "auto" }} />
                    </Stack>
                    <BuyButton variant="contained" color="primary" disabled={disable} onClick={() => onClickUpload(UPLOAD_TYPE.IMAGE)} sx={{ textTransform: "inherit" }}>
                        Upload Image
                    </BuyButton>
                </Stack>

                <Stack direction="column" justifyContent="center" alignItems="center" spacing={1}>
                    <AmountField name="name" label="name" value={metaData.name} onChange={onMetaDataChange} sx={{ width: "100%" }} />
                    <AmountField
                        name="description"
                        label="description"
                        multiline
                        rows={2}
                        value={metaData.description}
                        onChange={onMetaDataChange}
                        sx={{ width: "100%" }}
                    />
                    <Stack direction="row" spacing={2}>
                        <AmountField name="amount" label="amount" type="number" InputProps={{ inputProps: { min: 1 } }} value={amount} onChange={(e) => setAmount(e.target.value)} sx={{ width: "50%" }} />
                        <AmountField name="price" label="price(ETH)" type="number" InputProps={{ inputProps: { min: 0.000000000000000001 } }} value={price} onChange={(e) => setPrice(e.target.value)} sx={{ width: "50%" }} />
                    </Stack>
                    <input type="file" ref={uploadImgRef} onChange={(e) => onUpload(e, "image")} hidden />
                    <input type="file" ref={uploadMetadataRef} onChange={(e) => onUpload(e, "metadata")} hidden />
                    <Stack direction="row" spacing={2} sx={{width:"100%"}}>
                        <AmountField name="amount" label="buy limit" type="number" InputProps={{ inputProps: { min: 1 } }} value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} sx={{ width: "50%" }} />
                        <AmountField
                            value={contentAmount}
                            label="amount of contents"
                            onChange={changeContentAmount}
                            select
                            sx={{ width: "50%" }}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                            <MenuItem value={7}>7</MenuItem>
                            <MenuItem value={8}>8</MenuItem>
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                        </AmountField>
                    </Stack>

                    <Stack direction="row" spacing={2} sx={{width:'100%'}}>

                        <BuyButton variant="contained" color="primary" disabled={disable} onClick={uploadMetadata} sx={{ textTransform: "inherit", width:"40%" }}>
                            Upload metadata
                        </BuyButton>
                        <BuyButton variant="contained" disabled={disable} onClick={onCreate} sx={{ textTransform: "inherit", backgroundColor: "rgb(179, 0, 0)", width:"30%" }}>
                            Create
                        </BuyButton>
                        <BuyButton variant="contained" disabled={disable} onClick={onUpdate} sx={{ textTransform: "inherit", backgroundColor: "rgb(179, 0, 0)", width:"30%" }}>
                            Update
                        </BuyButton>
                    </Stack>
                </Stack>
                <Stack direction="column" spacing={1}>
                    {
                        emailContents.map((content, index) =>
                            <Stack direction="row" spacing={1}>
                                <AmountField
                                    id={`name_${index}`}
                                    label="content name"
                                    value={content.name}
                                    onChange={(e) => {
                                        let value = e.target.value.trim();
                                        let id = Number(e.target.id.split('_')[1]);
                                        setEmailContents(emailContents.map((content, index) => {
                                            if (index === id) {
                                                return { ...content, name: value };
                                            }
                                            return content;
                                        }));
                                    }
                                    }
                                    sx={{ width: "30%" }}
                                />
                                <AmountField
                                    id={`content_${index}`}
                                    label="content"
                                    value={content.content}
                                    onChange={
                                        (e) => {
                                            let value = e.target.value.trim();
                                            let id = Number(e.target.id.split('_')[1]);
                                            setEmailContents(emailContents.map((content, index) => {
                                                if (index === id) {
                                                    return { ...content, content: value };
                                                }
                                                return content;
                                            }));
                                        }
                                    }
                                    sx={{ width: "70%"}}
                                />
                            </Stack>
                        )
                    }
                </Stack>

            </Stack>
            <NftViewer showNftData={showNftData} />
            {/* <Alert open={alertOpen} handleClose={() => setAlert(false)} text={alertText} /> */}
        </Container>
    </>
        ;
}

const mapStateToProps = (state) => ({
    status: state.manager.status,
    alertOpen: state.manager.alertOpen,
    alertText: state.manager.alertText,
    account: state.manager.account
})

export default connect(mapStateToProps, { createNFT, setAlert, isManager, updateNFT })(Manager);
