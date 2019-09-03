import axios from "axios";
import { showAlert } from "./alerts";

const redirectTo = url => {
  window.setTimeout(() => {
    location.assign(url);
  }, 1500);
};

const BASE_URL = "http://localhost:3000/api/v1";

export const deleteRecord = async (resource, id) => {
  try {
    const result = axios({
      method: "DELETE",
      url: `${BASE_URL}/${resource}/${id}`
    });
    if (result.data.status == "success") {
      showAlert("success", `Record Deleted Successfully!`);
      redirectTo(`/manage/${resource}`);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

// This function is for Admin to update user settings
export const updateUser = async user => {
  try {
    const result = await axios({
      method: "PUT",
      url: `${BASE_URL}/users/${user.id}`,
      data: {
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
    if (result.data.status == "success") {
      showAlert("success", "User Update Successfully!");
      redirectTo("/manage-users");
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

// This function is for User to update the email,name and password
// type will be either data or password
export const updateUserSettings = async (data, type) => {
  try {
    const url =
      type == "password"
        ? `${BASE_URL}/users/updatePassword`
        : `${BASE_URL}/users/updateMe`;
    const res = await axios({
      method: "PUT",
      url,
      data
    });
    console.log(res.data);
    if (res.data.status == "success") {
      showAlert("success", `${type} updated successfully`);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};
