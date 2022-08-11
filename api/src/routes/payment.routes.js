const express = require("express");
const router = express.Router();
const Order = require('../models/Order.js');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);
const { handleWebHook } = require('../controllers/payment.controller.js')
const { payment } = require("../controllers/payment.controller.js");
const {
  paymentGiftCard,
} = require("../controllers/paymentGiftCard.controller");

router.post("/create-checkout-session", payment);
router.post("/create-checkout-giftCardsession", paymentGiftCard);



// const createOrder = async (customer, data) => {
//   const Items = JSON.parse(customer.metadata.cart);

//   try {
//     const newOrder = await Order.create({
//       userId: customer.metadata.userId,
//       customerId: data.customer,
//       paymentIntentId: data.payment_intent,
//       products: Items,
//       total_price: data.amount_total,
//       payment_status: data.payment_status
//     })

//     // email
//   } catch (error) {
//     console.log(error)
//   }
// }


// //STRIPE WEBHOOK

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret =
  "whsec_589c8a4742cefef3fe36e18f0a2d9f7fabb41d23c3b86f32832e6842360d7eea";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("Webhook verified");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event

    // Return a 200 response to acknowledge receipt of the event
    response.send().end();
  }
);



// // This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_589c8a4742cefef3fe36e18f0a2d9f7fabb41d23c3b86f32832e6842360d7eea";

// router.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let data;
//   let eventType;

//   if (endpointSecret) {
//     let event
//     try {
//       event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//       console.log("Webhook verified")
//     } catch (err) {
//       console.log(`Webhook Error: ${err.message}`)
//       response.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }
//   } else {
//     data = req.body.data.object;
//     eventType = req.body.type;
//   }

//   // Handle the event
//   if (eventType === "checkout.session.completed") {
//     stripe.customers
//       .retrieve(data.customer)
//       .then((customer) => {
//         createOrder(customer, data)
//       })
//       .catch((err) => console.log(err.message))
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   response.send().end();
// });




router.post('/create-checkout-session', payment);
router.post('/webhook', handleWebHook);


module.exports = router
