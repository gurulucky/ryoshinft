const express = require('express');
const stripe = require("stripe")("sk_test_51JXxg2CDjQLWm9hRmboRlONQctPfntwi9shPzFFk1K84483Yv33l11x30v4aPE3o8CcUGa8du9fcRXUZ9XxL16bF00jW6TMFe9");
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
            amount: 300,//cent or pense
            currency: "usd"
        });
    
        res.json({
            clientSecret: paymentIntent.client_secret
        });
    }catch(err){
        console.log(err);
    }
    
});

module.exports = router;