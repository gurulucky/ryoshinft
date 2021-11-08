import React from 'react';
import { Stack, Typography } from '@material-ui/core';
import { BuyButton } from '../StyledComponent/StyledInput';

const SwapDialog = (props) => {
    return (
        <Stack direction='column' spacing={1} justifyContent='center'>
            <Stack direction='row' spacing={1} justifyContent='space-between'>
                <Typography variant='h6' color='white' textAlign='center'> 
                    Please swap Ryoshi.
                </Typography>
                <BuyButton onClick={props.handleClose}>
                    Close
                </BuyButton>
            </Stack>
            <iframe src="https://app.uniswap.org/#/swap" title="W3Schools Free Online Web Tutorials" width="100%" height="600px"></iframe>
        </Stack>
    );
}

export default SwapDialog;