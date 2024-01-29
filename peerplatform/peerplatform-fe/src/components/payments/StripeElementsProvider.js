import React, { useState } from "react";
//import { Elements } from '@stripe/react-stripe-js';
import {
  CardElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";
import ApiService from "../../api";
import CheckoutForm from "./CheckoutForm";

const StripeElementsProvider = ({ setVisible, countDown }) => {
  const stripePromise = loadStripe(
    "pk_test_51LDT6uDMftTw233MKgmBwD3btGNBmCyhvqPJ6qJh1bvudRNl4xATE4gDL1kaPZYxcPD0uan3sx2ttXawUkjQelaO00qJ51XHLo",
  );
  const options = {
    clientSecret:
      "sk_test_51LDT6uDMftTw233M9XAwYdnCvLBDNBUIqWNU4gwGVu2BzwcY6cimqpRH78ZLogDoWnJ4zD4M8JJDJj54NagRrVQl00onyo8Lqu",
  };

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        options={options}
        setVisible={setVisible}
        countDown={countDown}
      />
    </Elements>
  );
};

export default StripeElementsProvider;
