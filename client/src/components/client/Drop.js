import React from 'react';
import { connect } from 'react-redux';
import { Container, Box, Typography } from '@material-ui/core';
// import { pinJSONToIPFS } from './pinata';
import NftViewer from './drops/NftViewer';
import ZkWalletDialog from '../dialog/ZksyncWallet';
import Payment from '../dialog/Payment';
import "./styles.css";
import YoutubeEmbed from './YoutubeEmbed'
import { setStatus, openZkWalletDLG, openPay, approve } from '../../actions/manager';

require('dotenv').config();


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

const Drop = ({ zkwalletOpen, openZkWalletDLG, openPay, amount, approve, payOpen }) => {
    return (
        <Container sx={{ py: "20px", minHeight: window.innerHeight + 'px' }}>
            {
                !zkwalletOpen ?
                    <>
                        <YoutubeEmbed embedId="4s0oJRVZnjs" />
                        <Box component="div" sx={{ my: "50px" }}>
                            <Typography variant='h3' color='red' textAlign='center' sx={{ my: "20px" }}>WHAT IS RYOSHIS VISION?</Typography>
                            <Typography variant="h6" color="white">
                                Ryoshis Vision ($RYOSHI) is a community ran ERC20 token
                                on the Ethereum blockchain, created by our dev, Wifey, with
                                the intention of honoring the pure vision of the great Ryoshi.
                                The three main goals of Ryoshis Vision token are:
                            </Typography>
                            <ul style={{ color: "white" }}>
                                <li><Typography variant="h6" color="white">
                                    Enabling community-initiatives and projects into utilities
                                    aligned with our core values;
                                </Typography></li>
                                <li><Typography variant="h6" color="white">
                                    Rewarding holders through deflationary tokenomics and
                                    built-in burn mechanisms;
                                </Typography></li>
                                <li><Typography variant="h6" color="white">
                                    Encouraging the community to vote and participate in
                                    project decisions (DAO).
                                </Typography></li>
                            </ul>
                        </Box>
                        <Typography variant='h4' color='red' textAlign='center' sx={{ my: "20px" }}>Upcoming</Typography>
                        <NftViewer />
                        <Payment open={payOpen} amount={amount} handleClose={() => openPay(false)} handleOk={approve} />
                    </>
                    :
                    <ZkWalletDialog handleClose={() => openZkWalletDLG(false)} />
            }
        </Container>
    );
}


const mapStateToProps = (state) => ({
    status: state.manager.status,
    zkwalletOpen: state.manager.zkwalletOpen,
    payOpen: state.manager.payOpen,
    amount: state.manager.amount
});

export default connect(mapStateToProps, { setStatus, openZkWalletDLG, openPay, approve })(Drop);