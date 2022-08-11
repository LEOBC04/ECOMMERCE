require("dotenv").config()
const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_KEY)
const endpointSecret = process.env.ENDPOINTSECRET;
const Order = require('../models/Order.js')

const createOrder = async (customer, data) => {

  try {
    await Order.create({
      user_id_stripe: customer.id,
      user_name: data.customer_details.name,
      user_email: customer.email,
      user_phone: customer.phone,
      address: {
        city: data.customer_details.address.city,
        country: data.customer_details.address.country,
        address_line_1: data.customer_details.address.line1,
        postal_code: data.customer_details.address.postal_code
      },
      products: data.data.map(item => {
        return ({
          title: item.description,
          cartQuantity: item.quantity,
          subtotal_price: item.amount_total
        })
      }),
      payment_status: data.payment_status,
      total_price: data.amount
    })
  } catch (error) {
    console.log(error)
  }
}

const payment = async (req, res) => {
  // const { } = cartItems
  const customer = await stripe.customers.create({
    metadata: {
      userId: req.body.userId,
      // cart: JSON.stringify(req.body.cartItems)
    },
  });
  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
          // description: item.desc,
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

  res.status(200).send({ url: session.url });
}

const handleWebHook = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
  let data;
  let eventType;

  if (endpointSecret) {
    try {
      event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
      console.log("Webhook verified")
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`)
      response.status(400).send(`hello: ${err.message}`);
      return;
    }
    data = event.data.object
    eventType = event.type
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }
  // console.log('DATA: ', data)
  // console.log('TYPE: ', eventType)

  // Handle the event
  try {
    if (eventType === "checkout.session.completed") {

      const customer = await stripe.customers.retrieve(data.customer)
      const line_items = await stripe.checkout.sessions.listLineItems(data.id)
      const { amount } = await stripe.paymentIntents.retrieve(data.payment_intent)
      data = { ...data, ...line_items, amount }
      createOrder(customer, data)
    }
  } catch (err) {
    console.log(err.message)
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).send().end();
}



module.exports = { handleWebHook, payment };
