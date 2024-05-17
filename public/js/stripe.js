/* eslint-disable */
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { showAlert } from './alert';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51PGOfGC8symgJf5WXjjt6KazVEBs5tAa34t7O8PfMs6yneQsvzrwu9TBLAxtGo1PtMRzWtKXbl62dhfgoWAhJ58w008As7gTIF',
    );

    // 1) Get checkout session from endpoint API
    const response = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    const session = response.data.session;
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  } catch (err) {
    // console.log(err);
    showAlert('error', err);
  }
};
