import axios from "axios";
import { showAlert } from "./alerts";

const redirectTo = url => {
  window.setTimeout(() => {
    location.assign(url);
  }, 1500);
};

const BASE_URL = "http://localhost:3000/api/v1";

export const resetPassword = async (password, passwordConfirm) => {
  try {
    const token = window.location.pathname.split("/")[2];
    const result = await axios({
      method: "PUT",
      url: `${BASE_URL}/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm
      }
    });
    if (result.data.status == "success") {
      showAlert("success", "Password Updated Successfully!");
      redirectTo("/login");
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

export const forgotPassword = async email => {
  try {
    const result = await axios({
      method: "POST",
      url: `${BASE_URL}/users/forgotPassword`,
      data: {
        email
      }
    });

    if (result.data.status == "success") {
      showAlert("success", "A rest token was sent to the email.");
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

export const login = async (email, password) => {
  try {
    const result = await axios({
      method: "POST",
      url: `${BASE_URL}/users/login`,
      data: {
        email,
        password
      }
    });
    if (result.data.status == "success") {
      showAlert("success", "Logged in successfully");
      redirectTo("/");
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const result = await axios({
      method: "GET",
      url: `${BASE_URL}/users/logout`
    });
    if (result.data.status == "success") {
      redirectTo("/");
    }
  } catch (error) {
    console.log(error.response);

    showAlert("error", "Some error occured try again!!");
  }
};

export const signup = async user => {
  try {
    const result = await axios({
      method: "POST",
      url: `${BASE_URL}/users/signup`,
      data: user
    });
    if (result.data.status == "success") {
      showAlert("success", "User Registered Successfully");
      redirectTo("/me");
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
