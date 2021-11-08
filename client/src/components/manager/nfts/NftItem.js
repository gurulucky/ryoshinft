import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid, Stack, Box, CardActionArea, CardActions, CardContent, Typography, Container, MenuItem } from '@material-ui/core';
import { deleteNft, setShowNft } from '../../../actions/manager';
import { BuyButton, StyledCard, StyledCheckbox, SelectShow } from '../../StyledComponent/StyledInput';

const NftItem = ({ nft, deleteNft, showNftData, setShowNft }) => {
    // const [checked, setChecked] = useState(true);
    const [showType, setShowType] = useState(0);
    useEffect(() => {
        setShowType(nft.show);
    }, [nft.show]);
    // console.log(nft);
    const onChangeShow = (e) => {
        setShowType(e.target.value);
        setShowNft(nft, e.target.value);
    }

    return (
        <Grid item xs={12} sm={6} md={4} sx={{ my: "10px" }}>
            <Container sx={{ maxWidth: "360px", minWidth: "300px" }}>
                <StyledCard>
                    <CardActionArea onClick={() => showNftData(nft)}>
                        <Stack justifyContent="center" alignItems="center" sx={{ height: "360px", backgroundColor: "rgb(43 43 43)" }}>
                            <img src={nft.image || '/empty.png'} title="Ryoshi Vision" alt="nft" style={{ display: "block", maxWidth: "260px", maxHeight: "360px", width: "auto", height: "auto" }} />
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
                            {/* <Typography variant="body1" color="rgb(221, 221, 221)">
                            {nft.description}
                        </Typography> */}
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="rgb(221, 221, 221)">
                                    {nft.left ? `Left: ${nft.left}` : "Sold Out"}
                                </Typography>
                                <Typography variant="body2" color="rgb(221, 221, 221)">
                                    {`Total: ${nft.amount}`}
                                </Typography>
                            </Stack>
                            <Typography variant="body2" color="rgb(221, 221, 221)">
                                Max: {nft.maxAmount ? `${nft.maxAmount}` : `no limit`}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions sx={{ pt: "0px" }}>
                        {/* <StyledCheckbox checked={checked} onChange={onCheck} inputProps={{ 'aria-label': 'controlled' }} /> */}
                        <SelectShow
                            value={showType}
                            label=""
                            onChange={onChangeShow}
                            select
                            sx={{ width: "50%" }}
                        >
                            <MenuItem value={0}>Show All</MenuItem>
                            <MenuItem value={1}>Only Market</MenuItem>
                            <MenuItem value={2}>Only Drop</MenuItem>
                            <MenuItem value={3}>Hide All</MenuItem>
                        </SelectShow>
                        <Box sx={{ flexGrow: 1 }} />
                        <BuyButton variant="contained" onClick={() => deleteNft(nft)} sx={{ textTransform: "inherit", height: "36px" }}>Delete</BuyButton>
                    </CardActions>
                </StyledCard>
            </Container>
        </Grid>
    )
};

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps, { deleteNft, setShowNft })(NftItem);