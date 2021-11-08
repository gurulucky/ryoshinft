import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Grid, Stack, CardActionArea, CardActions, CardContent, Typography, Tooltip, Box, Container } from '@material-ui/core';
import { AmountField, BuyButton, StyledCard } from '../../StyledComponent/StyledInput';
import { buy, setAlert } from '../../../actions/manager';
import { isInt, isBigger } from '../../../utils/utils';


const NftItem = ({ nft, tokenBalance, mintingNow, account, buy, setAlert }) => {
    const [amount, setAmount] = useState(1);

    const onBuy = (e, type) => {
        if (!isInt(amount) || amount < 1 || amount > nft.left) {
            setAlert(true, "Please input correct amount.");
            return;
        }
        if (Number(amount) > 250) {
            setAlert(true, "Please input less than 250.");
            return;
        }
        buy(account, nft, amount, type);
    }

    return (
        <Grid item xs={12} sm={6} md={4}  sx={{ my: "10px" }}>
            <Container sx={{ maxWidth: "360px", minWidth: "300px" }}>
                <StyledCard>
                    <CardActionArea>
                        <Stack justifyContent="center" alignItems="center" sx={{ height: "360px", backgroundColor: "rgb(43 43 43)" }}>
                            <img src={nft.image || '/empty.png'} title="Ryoshi Vision" alt="nft" style={{ display: "block", maxWidth: "360px", maxHeight: "360px", width: "auto", height: "auto" }} />
                        </Stack>
                        <CardContent sx={{ py: "4px" }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography gutterBottom variant="body1" color="rgb(221, 221, 221)">
                                    {`${nft.name}`}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography gutterBottom variant="body2" color="rgb(221, 221, 221)" sx={{ m: "0px" }}>
                                        {`${nft.minPrice}`}
                                    </Typography>
                                    <img src='/img/eth.svg' height="24px" alt="eth" />
                                </Stack>
                            </Stack>
                            <Typography variant="body1" color="rgb(221, 221, 221)">
                                {nft.description}
                            </Typography>
                            <Stack direction="row" justifyContent="space-between" >
                                <Typography variant="body2" color="rgb(221, 221, 221)">
                                    MAX OWN: {nft.maxAmount ? `${nft.maxAmount}` : `no limit`}
                                </Typography>
                                <Typography variant="body2" color="rgb(221, 221, 221)">
                                    {`SUPPLY: ${nft.amount}`}
                                </Typography>
                            </Stack>

                        </CardContent>
                    </CardActionArea>

                </StyledCard>
            </Container>
        </Grid>
    )
};

const mapStateToProps = (state) => ({
    account: state.manager.account,
    tokenBalance: state.manager.tokenBalance,
    mintingNow: state.manager.mintingNow
})

export default connect(mapStateToProps, { buy, setAlert })(NftItem);