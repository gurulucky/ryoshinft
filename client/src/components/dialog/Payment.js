import React from 'react';
import { Dialog, DialogContent, DialogContentText, DialogTitle, Stack } from '@material-ui/core';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import "./stripe.css";
const promise = loadStripe(process.env.STRIPE_PUBKEY_TEST);

const Payment = (props) => {        
    return (
        <Dialog
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="400px"
        >
            <DialogTitle id="alert-dialog-title">{"Stripe payment"}</DialogTitle>
            <DialogContent>
                <Stack direction="column" justifyContent="center">
                    <DialogContentText id="alert-dialog-description" sx={{ mb: 3 }}>
                        You don't have metamask or enough ryoshi. So you should buy nft with FIAT.
                    </DialogContentText>
                    <Elements stripe={promise}>
                        <CheckoutForm onSucceed={props.handleOk} amount={props.amount} />
                    </Elements>
                </Stack>

            </DialogContent>
        </Dialog>
    );
}

export default Payment;