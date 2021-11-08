import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { Grid, Typography, Stack } from '@material-ui/core';
import { StyledCircleProgress } from '../../StyledComponent/StyledInput';
import NftItem from './NftItem';
import { getAssets, getZkNFTs, getWithdrawNFTs } from '../../../actions/manager';

const NftViewer = ({ email, account, nfts, zkNfts, withdrawNfts, unlock, loadingAssets, getAssets, getZkNFTs, getWithdrawNFTs, type }) => {
    useEffect(() => {
        if (type === "approve") {
            getAssets(email, "");
        } else if (type === "mint") {
            // console.log('NftViewer', unlock);
            getZkNFTs();
        } else if (type === "withdraw") {
            getWithdrawNFTs();
        }
        // console.log('assets', nfts);
    }, [email, account, unlock, getAssets, type]);

    return (<>
        {/* {(type === "approve" && !nfts.length) && < Typography variant="body1" color="white" textAlign='center'>If you don't see your assets, please connect to your wallet or input your email to load</Typography>}
        {((type === "mint" || type === 'withdraw') && !zkNfts.length && !loadingAssets) && <Typography variant="body1" color="white" textAlign='center'>If you don't see your assets, please connect to your wallet or input your email to load</Typography>} */}
        {account ?
            ((type === 'approve' && !nfts.length) || ((type === "mint" || type === 'withdraw') && (!zkNfts.length || !withdrawNfts.length) && !loadingAssets)) &&
            < Typography variant="body1" color="white" textAlign='center'>There is nothing.</Typography>
            :
            < Typography variant="body1" color="white" textAlign='center'>If you don't see your assets, please connect to your wallet or input your email to load</Typography>
        }
        {
            loadingAssets && <Stack direction='row' justifyContent='center' alignItems='center'>
                <StyledCircleProgress />
                <Typography variant="body1" color="white" sx={{ marginLeft: "15px" }}>Loading now, please wait... </Typography>
            </Stack>
        }
        <Grid container>
            {type === "approve" ?
                nfts.filter(nft => nft.type === type).map(nft => <NftItem key={nft._id} nft={nft} />)
                :
                (!loadingAssets && type === "mint") ?
                    zkNfts.map(nft => <NftItem key={nft.zksyncId} nft={nft} />)
                    :
                    (!loadingAssets && type === "withdraw") && withdrawNfts.map(nft => <NftItem key={nft.zksyncId} nft={nft} />)
            }
        </Grid>
    </>
    )
}

const mapStateToProps = (state) => ({
    nfts: state.manager.nfts,
    zkNfts: state.manager.zkNfts,
    withdrawNfts: state.manager.withdrawNfts,
    unlock: state.manager.unlock,
    loadingAssets: state.manager.loadingAssets,
    account: state.manager.account
});

export default connect(mapStateToProps, { getAssets, getZkNFTs, getWithdrawNFTs })(NftViewer);