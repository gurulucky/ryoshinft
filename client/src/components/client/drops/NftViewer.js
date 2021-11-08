import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Grid, Typography } from '@material-ui/core';
import NftItem from './NftItem';
import { getNfts } from '../../../actions/manager'

const COUNT_PER_PAGE = 9;

const NftViewer = ({ nfts, totalCountNft, getNfts }) => {
    const [hasMore, setHasMore] = useState(true);
    useEffect(() => {
        getNfts(2, 0, COUNT_PER_PAGE);
    }, [getNfts]);

    const getMoreData = () => {
        if (nfts.length >= totalCountNft) {
            setHasMore(false);
            return;
        }
        getNfts(1, nfts.length, COUNT_PER_PAGE);
    }

    return (
        <InfiniteScroll
            dataLength={nfts.length}
            next={getMoreData}
            hasMore={hasMore}
            loader={<Typography varient='h6' color='white' textAlign='center'>Loading...</Typography>}
        >
            <Grid container justifyContent='center' >
                {/* {console.log("nftviewer",nfts)} */}
                {nfts.map(nft => <NftItem key={nft._id} nft={nft} />)}
            </Grid>
        </InfiniteScroll>
    )
}

const mapStateToProps = (state) => ({
    nfts: state.manager.nfts,
    totalCountNft: state.manager.totalCountNft
});

export default connect(mapStateToProps, { getNfts })(NftViewer);