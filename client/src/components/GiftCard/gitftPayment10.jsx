import React from 'react';
import env from 'react-dotenv';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(env.PUBLIC_KEY);

const GitftPayment10 = () => {
  const handlePayment = async (e) => {
    const stripe = await stripePromise;

    const response = await fetch('/create-checkout-session', {
      method: "POST",
      body: JSON.stringify()
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {

    }
  }

  return (
    <div>
      Gift Card $10
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
}

export default GitftPayment10;
