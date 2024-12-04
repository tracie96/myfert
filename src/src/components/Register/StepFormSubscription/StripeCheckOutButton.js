import React from "react";
import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe("@Stripe.Value.PublishableKey");

const StripeCheckOutButton = (props) => {
  const stripePromise = loadStripe(props.stripePublishableKey);
  // Handle checkout button click
  const handleCheckout = async () => {
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: props.stripeSessionId, //"sessionId_from_payload"
    });
    if (error) {
      // Handle error
    }
  };

  return (
    <>
      {/* Render checkout button */}
      <button
        type="button"
        onClick={handleCheckout}
        className="btn btn-user btn-block text-white font-weight-bold"
        style={{ backgroundColor: "green" }}
      >
        Confirm Checkout
      </button>
    </>
  );
};

export default StripeCheckOutButton;
