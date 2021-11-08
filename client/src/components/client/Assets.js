import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Stack, Container } from '@material-ui/core';
// import { pinJSONToIPFS } from './pinata';
import NftViewer from './assets/NftViewer';
import ZkWalletDialog from '../dialog/ZksyncWallet';
import SwapDialog from '../dialog/Swap';
import InputKey from '../dialog/InputKey';
import { AmountField, StyledTab, StyledTabs } from '../StyledComponent/StyledInput';
import { setStatus, openZkWalletDLG, openPay, approve, openInputKey, mint, openSwapDLG } from '../../actions/manager';



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

const Assets = ({ zkwalletOpen, swapOpen, openZkWalletDLG, openSwapDLG, inputKeyOpen, openInputKey, mint }) => {
    const [email, setEmail] = useState("");
    const [key, setKey] = useState("");
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container sx={{ minHeight: window.innerHeight + 'px' }}>
            {
                (!zkwalletOpen && !swapOpen) &&
                <>
                    <Stack direction='row' justifyContent='center'>
                        <StyledTabs value={value} onChange={handleChange}>
                            <StyledTab label="Pending to mint" />
                            <StyledTab label="Already minted" />
                            <StyledTab label="Withdrawn" />
                        </StyledTabs>
                    </Stack>

                    {value === 0 ?
                        <>
                            <Stack direction="row" justifyContent='center' spacing={1} sx={{ mb: "30px" }}>
                                <AmountField name="email" label="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ width: "40%" }} />
                                <AmountField name="email" label="key" value={key} onChange={(e) => setKey(e.target.value)} sx={{ width: "60%" }} />
                            </Stack>
                            <NftViewer email={email + "+" + key} type="approve" />
                        </>
                        : value === 1 ?
                            <NftViewer type="mint" />
                            :
                            <NftViewer type="withdraw" />
                    }
                    <InputKey open={inputKeyOpen} handleClose={() => openInputKey(false)} handleOk={mint} />
                </>
            }
            {zkwalletOpen && <ZkWalletDialog handleClose={() => { openZkWalletDLG(false) }} />}
            {swapOpen && <SwapDialog handleClose={() => { openSwapDLG(false) }} />}
        </Container >
    );
}


const mapStateToProps = (state) => ({
    status: state.manager.status,
    zkwalletOpen: state.manager.zkwalletOpen,
    swapOpen: state.manager.swapOpen,
    // payOpen: state.manager.payOpen,
    inputKeyOpen: state.manager.inputKeyOpen,
    account: state.manager.account
});

export default connect(mapStateToProps, { setStatus, openZkWalletDLG, openSwapDLG, openPay, approve, openInputKey, mint })(Assets);