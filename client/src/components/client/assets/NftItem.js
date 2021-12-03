import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, Box, Stack, CardActionArea, CardActions, CardContent, Typography, Container } from '@material-ui/core';
import { AmountField, BuyButton, StyledCard } from '../../StyledComponent/StyledInput';
import { setAlert, openInputKey, withdrawNFTtoL1 } from '../../../actions/manager';
import { isInt } from '../../../utils/utils';

const NETWORK = process.env.REACT_APP_NETWORK;
const ZKSYNC_FACTORY_ADDRESS_LINK = process.env.REACT_APP_ZKSYNC_FACTORY_ADDRESS_LINK;
const ZKSYNC_FACTORY_ADDRESS_MAIN = process.env.REACT_APP_ZKSYNC_FACTORY_ADDRESS_MAIN;
const ETHERSCAN_URL = NETWORK === 'rinkeby' ? `https://rinkeby.etherscan.io/token/${ZKSYNC_FACTORY_ADDRESS_LINK}` : `https://etherscan.io/token/${ZKSYNC_FACTORY_ADDRESS_MAIN}`

const NftItem = ({ nft, account, mintingNow, setAlert, openInputKey, withdrawNFTtoL1 }) => {
    const [amount, setAmount] = useState(1);
    const [showGoodies, setShowGoodies] = useState(false);
    const [goodies, setGoodies] = useState("");

    useEffect(() => {
        if ((nft.type === 'mint' || nft.type === 'withdraw') && nft.emailContents) {
            let str = "";
            nft.emailContents.map(content => str += `${content.name}: ${content.content}\n`);
            // console.log(str);
            setGoodies(str);
        }
        console.log(nft);
    }, [nft])

    const onMint = (e) => {
        if (!isInt(amount) || amount < 1 || amount > nft.left) {
            setAlert(true, "Please input correct amount.");
            return;
        }
        if (Number(amount) > 250) {
            setAlert(true, "Please input less than 250.");
            return;
        }
        openInputKey(true, nft, amount)
    }

    const onShow = () => {
        if (nft.type === 'mint' || nft.type === 'withdraw') {
            console.log(nft.emailContents);
            setShowGoodies(!showGoodies);
        }

    }

    return (
        <Grid item xs={12} sm={6} md={4} sx={{ my: "10px" }}>
            <Container sx={{ maxWidth: "360px", minWidth: "300px" }}>
                <StyledCard>
                    <CardActionArea onClick={onShow}>
                        {
                            !showGoodies ?
                                <Stack justifyContent="center" alignItems="center" sx={{ height: "360px", backgroundColor: "rgb(43 43 43)" }}>
                                    <img src={nft.image || '/empty.png'} title="Ryoshi Vision" alt="nft" style={{ display: "block", maxWidth: "360px", maxHeight: "360px", width: "auto", height: "auto" }} />
                                </Stack>
                                :
                                <Stack direction='column' sx={{ height: '360px', p: "10px" }}>
                                    <Typography variant='h5' color='red' textAlign='center'>Goodies</Typography>
                                    <AmountField
                                        name="description"
                                        label=""
                                        multiline
                                        rows={12}
                                        value={goodies}
                                        inputProps={
                                            { readOnly: true }
                                        }
                                    />
                                </Stack>
                        }

                        <CardContent sx={{ py: "4px" }}>
                            {/* <Typography variant="body1" color="textSecondary" component="p">
                            {nft.description}
                        </Typography> */}
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography gutterBottom variant="body1" color="rgb(221, 221, 221)">
                                    {`${nft.name}`}
                                </Typography>
                                {
                                    nft.type === 'approve' ?
                                        <Typography variant="body2" color="rgb(221, 221, 221)">
                                            {`Left: ${nft.left}`}
                                        </Typography>
                                        :
                                        <>
                                            <Typography gutterBottom variant="body1" color="rgb(221, 221, 221)">
                                                Ryoshi-{nft.ryoshiId || 'none'}
                                            </Typography>
                                            <Typography gutterBottom variant="body2" color="rgb(221, 221, 221)">
                                                Zk-{nft.zksyncId || 'none'}
                                            </Typography>
                                        </>
                                }
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography gutterBottom variant="body2" color="rgb(221, 221, 221)" sx={{ m: "0px" }}>
                                        {`${nft.minPrice}`}
                                    </Typography>
                                    <img src='/img/eth.svg' height="24px" alt="eth" />
                                </Stack>
                            </Stack>
                            {/* <Typography variant="body1" color="rgb(221, 221, 221)">
                            {nft.description}
                        </Typography> */}
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        {
                            nft.left && nft.type === "approve" ?
                                <>
                                    {/* <Stack direction="row" justifyContent="center" spacing={2}> */}
                                    <AmountField name="amount" label="amount" type="number" size='small' InputProps={{ inputProps: { min: 1, max: nft.left } }} value={amount} onChange={(e) => setAmount(parseInt(e.target.value))}
                                        sx={{
                                            mr: "8px",
                                            width: "130px"
                                        }}
                                    />
                                    <Box sx={{ flexGrow: 1 }} />
                                    <BuyButton variant="contained" color="primary" disabled={mintingNow || !account} onClick={onMint} sx={{ textTransform: "inherit", width: "30%", height: "38px" }}>
                                        <Typography>Mint</Typography>
                                    </BuyButton>
                                    {/* </Stack> */}
                                </>
                                :
                                nft.type === "mint" ?
                                    <>
                                        <Typography variant="body2" color="rgb(221, 221, 221)">
                                            {nft.status}
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <BuyButton variant="contained" color="primary" onClick={() => withdrawNFTtoL1(nft.zksyncId)} sx={{ textTransform: "inherit", width: "50%", height: "38px" }}>
                                            <Typography>Withdraw to L1</Typography>
                                        </BuyButton>
                                    </>
                                    : nft.type==="withdraw" &&
                                    <>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <a href={`${ETHERSCAN_URL}?a=${nft.zksyncId}#inventory`} target='_blank' rel='noreferrer' style={{ color: "white" }}>View on etherscan</a>
                                    </>
                        }
                    </CardActions>
                </StyledCard>
            </Container>
        </Grid>
    )
};

const mapStateToProps = (state) => ({
    account: state.manager.account,
    mintingNow: state.manager.mintingNow
})

export default connect(mapStateToProps, { setAlert, openInputKey, withdrawNFTtoL1 })(NftItem);