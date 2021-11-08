import React from 'react';
import { Stack, Typography } from '@material-ui/core';

const Footer = () => {

    return (
        <Stack direction="row" justifyContent="center" alignItems="center" 
        sx={{ 
            backgroundColor: "rgba(19, 5, 5)", p: 1, minHeight: "100px"
         }}
        >
            <Typography variant="body2" color="white">
                Copyright © 2021 Ryoshi Vision Concerts
            </Typography>
        </Stack>
    );
}
export default Footer;