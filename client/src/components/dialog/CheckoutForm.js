import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { Button, Stack, Select, MenuItem } from '@material-ui/core';
import api from '../../utils/api';
import { checkEmail } from "../../utils/utils";
import { checkMaxOwnership, setAlert } from "../../actions/manager";

export default function CheckoutForm(props) {
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const [email, setEmail] = useState('');
    const [postalCode, setpostalCode] = useState('');
    const [currency, setCurrency] = useState(0);
    const stripe = useStripe();
    const elements = useElements();
    const nft = useSelector(state => state.manager.nft);
    const amount = useSelector(state => state.manager.amount);
    const dispatch = useDispatch();

    useEffect(() => {
        const getClientSecret = async () => {
            try {
                console.log("post create-payment");
                const res = await api.post('/stripe/create-payment-intent', { items: [{ id: "xl-tshirt" }] });
                setClientSecret(res.data.clientSecret);
                console.log('getclientsecret', res.data.clientSecret);
            } catch (err) {
                console.log('getclientsecret err', err);
            }
        }
        getClientSecret();
    }, []);

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    const handleChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
        setpostalCode(event.value.postalCode);
    };

    const handleSubmit = async ev => {
        ev.preventDefault();
        if (!checkEmail(email)) {
            setError("email invalid");
            return;
        }
        const res = await checkMaxOwnership("", email, nft._id, amount);
        if (!res.data.checked) {
            dispatch(setAlert(true, res.data.msg));
            return;
        }

        setProcessing(true);
        console.log('clientSecret', clientSecret);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            receipt_email: email,
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });
        // console.log('payload', payload);
        // console.log("card",elements.getElement(CardElement));

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
            props.onSucceed(email, postalCode);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <Stack direction="column" justifyContent="center" spacint={2}>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                        if (!checkEmail(e)) {
                            setError('email invalid');
                        } else {
                            setError('');
                        }
                        setEmail(e.target.value);
                    }}
                    placeholder="Enter email address"
                />
                <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mt: 2 }}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}

                    >
                        <MenuItem value={0}>USD</MenuItem>
                        <MenuItem value={1}>EUR</MenuItem>
                        <MenuItem value={2}>GBP</MenuItem>
                    </Select>
                    <Button type='submit' color='primary' variant="contained"
                        disabled={processing || disabled || succeeded}
                        id="submit" sx={{ width: "50%" }}
                    >
                        <span id="button-text">
                            {processing ? (
                                // <div className="spinner" id="spinner"></div>
                                `wait a moment...`
                            ) : (
                                `Pay now`
                            )}
                        </span>
                    </Button>
                </Stack>

                {/* Show any error that happens when processing the payment */}
                {error && (
                    <div className="card-error" role="alert">
                        {error}
                    </div>
                )}
                {/* Show a success message upon completion */}
                <p className={succeeded ? "result-message" : "result-message hidden"}>
                    Payment succeeded. You can mint NFT now.
                    {/* <a
                        href={`https://dashboard.stripe.com/test/payments`}
                    >
                        {" "}
                        Stripe dashboard.
                    </a> Refresh the page to pay again. */}
                </p>
            </Stack>
        </form>
    );
}

