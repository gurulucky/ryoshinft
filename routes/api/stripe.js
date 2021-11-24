const express = require('express');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_PK_TEST);
const router = express.Router();

const calculateOrderAmount = items => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 3;
};

router.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(process.env.STRIPE_USD),//cent or pense
            currency: process.env.STRIPE_CURRENCY
        });
    
        res.json({
            clientSecret: paymentIntent.client_secret
        });
    }catch(err){
        console.log(err);
    }
    
});

module.exports = router;