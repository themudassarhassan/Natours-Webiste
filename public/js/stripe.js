import axios from "axios";
import { hideAlert, showAlert } from "./alerts";
const stripe = Stripe("pk_test_yshOEdaWaqrKpfqGw00ciGdQ00HpY2cmHZ");

export const bookTour = async tourId => {
  try {
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (error) {
    showAlert("error", error.response.data.message);
    console.log(error.response.data.message);
  }
};
