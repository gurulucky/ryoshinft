import React from 'react';
import { Button, Stack, Typography } from '@material-ui/core';
import { BuyButton } from '../StyledComponent/StyledInput';

const ZkWalletDialog = (props) => {
    return (
        <Stack direction='column' spacing={1} justifyContent='center'>
            <Stack direction='row' spacing={1} justifyContent='space-between'>
                <Typography variant='h6' color='white' textAlign='center'> Please add funds(ETH) from Ethereum to use account in zksync. And connect to wallet again.</Typography>
                <BuyButton onClick={props.handleClose}>
                    Close
                </BuyButton>
            </Stack>
            <iframe src="https://rinkeby.zksync.io/account" title="W3Schools Free Online Web Tutorials" width="100%" height="600px"></iframe>
        </Stack>
    );
}

export default ZkWalletDialog;