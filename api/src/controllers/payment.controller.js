const express = require("express")
const Stripe = require("stripe")
require("dotenv").config()
const stripe = Stripe(process.env.STRIPE_KEY)

const router = express.Router()



const payment = async (req, res) => {
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId
    },
  });

  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
          description: item.desc,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.cartQuantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "KE"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },

    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    customer: customer.id,
    success_url: `${process.env.CLIENT_URL}/checkout-success`,
    cancel_url: `${process.env.CLIENT_URL}/shopping`,
  });

  res.send({ url: session.url });
}

//create Order DB

const createOrder = async (customer, data) => {
  const Items = JSON.parse(customer.metadata.cart);

  try {
    const newOrder = await Order.create({
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      products: Items,
      total_price: data.amount_total,
      payment_status: data.payment_status
    })

    // email
  } catch (error) {
    console.log(error)
  }
}


//STRIPE WEBHOOK
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = 'whsec_fed398dada1d21ce954d415fdcb14ac8a7050cabcb03edaa11c335f6867c005e';

router.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let data;
  let eventType;

  if (endpointSecret) {
    let event
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log("Webhook verified")
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`)
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }

  // Handle the event
  if (eventType === "checkout.session.completed") {
    stripe.customers
      .retrieve(data.customer)
      .then((customer) => {
        createOrder(customer, data)
      })
      .catch((err) => console.log(err.message))
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send().end();
});



module.exports = { payment };
