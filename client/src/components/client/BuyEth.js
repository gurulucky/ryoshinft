import React from 'react';
import { connect } from 'react-redux';
import { Container } from '@material-ui/core';
import ZkWalletDialog from '../dialog/ZksyncWallet';
import { openZkWalletDLG } from '../../actions/manager';



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

const BuyEth = ({ zkwalletOpen, openZkWalletDLG }) => {
    return (
        <Container sx={{ minHeight: window.innerHeight + 'px', py:"20px" }}>
            {
                !zkwalletOpen &&
                <iframe
                    src="https://buy.moonpay.com/?defaultCurrencyCode=eth"
                    allow="accelerometer; autoplay; camera; gyroscope; payment"
                    title='uniswap'
                    height="660px"
                    width="100%"
                    style={{
                        border: '0',
                        margin: "0 auto",
                        display: "block",
                        borderRadius: "10px",
                        maxWidth: "600px",
                        minWidth: "300px"
                    }}
                />
            }
            { zkwalletOpen && <ZkWalletDialog handleClose={() => { openZkWalletDLG(false) }} />}
        </Container >
    );
}


const mapStateToProps = (state) => ({
    zkwalletOpen: state.manager.zkwalletOpen,
});

export default connect(mapStateToProps, { openZkWalletDLG })(BuyEth);