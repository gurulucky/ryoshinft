import React from 'react';
import { Stack, Typography } from '@material-ui/core';
import { BuyButton } from '../StyledComponent/StyledInput';

const NETWORK = process.env.REACT_APP_NETWORK;

const ZkWalletDialog = (props) => {
    return (
        <Stack direction='column' spacing={1} justifyContent='center'>
            <Stack direction='row' spacing={1} justifyContent='space-between'>
                <Typography variant='h6' color='white' textAlign='center'> Please add funds(ETH) from Ethereum to use account in zksync. And connect to wallet again.</Typography>
                <BuyButton onClick={props.handleClose}>
                    Close
                </BuyButton>
            </Stack>
            <iframe src={NETWORK === 'rinkeby' ? `https://rinkeby.zksync.io/account` : `https://wallet.zksync.io/account`} title="Zksync wallet" width="100%" height="600px"></iframe>
        </Stack>
    );
}

export default ZkWalletDialog;