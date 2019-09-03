import "@babel/polyfill";
import { login, logout, forgotPassword, resetPassword, signup } from "./auth";
import { updateUser, updateUserSettings } from "./user";
import { bookTour } from "./stripe";
import { displayMap } from "./mapbox";
import bootbox from "bootbox";

const deleteRecord = document.getElementById("deleteRecord");
const editUserForm = document.querySelector(".form--user-update");
const mapBox = document.getElementById("map");
const bookTourBtn = document.getElementById("book-tour");
const resetPassForm = document.querySelector(".form--resetPassword");
const loginForm = document.querySelector(".form--login");
const singupForm = document.querySelector(".form--signup");
const forgotPassForm = document.querySelector(".form--forgotPassword");
const logoutButton = document.querySelector(".nav__el--logout");
const updateUserForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");

if (deleteRecord) {
  deleteRecord.addEventListener("click", e => {
    e.preventDefault();
    bootbox.confirm("Are you sure you want to delete Record?",function(result){

    })
  });
}

if (editUserForm) {
  editUserForm.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const id = document.getElementById("id").value;
    document.querySelector(".btn--user-update").innerHTML = "Updating...";
    updateUser({ name, email, role, id });
  });
}

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  console.log(locations);
  displayMap(locations);
}

if (bookTourBtn) {
  bookTourBtn.addEventListener("click", e => {
    e.target.textContent = "Processing...";
    const { tourid } = e.target.dataset;

    bookTour(tourid);
  });
}

if (resetPassForm) {
  resetPassForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn--resetPassword").innerHTML = "Resetting...";
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    await resetPassword(password, confirmPassword);
    document.querySelector(".btn--resetPassword").innerHTML = "Reset Password";
    document.getElementById("password").value = "";
    document.getElementById("confirmPassword").value = "";
  });
}

if (forgotPassForm) {
  forgotPassForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn--forgotPassword").innerHTML = "Sending...";
    const email = document.getElementById("email").value;
    console.log(email);
    await forgotPassword(email);
    document.getElementById("email").value = "";
    document.querySelector(".btn--forgotPassword").innerHTML =
      "Send Reset Link";
  });
}

if (singupForm) {
  singupForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn--signup").innerHTML = "Signing up...";
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    await signup({ name, email, password, passwordConfirm });
    document.querySelector(".btn--signup").innerHTML = "Signup";
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async e => {
    e.preventDefault();
    document.querySelector(".btn--update-password").innerHTML = "Updating....";
    const oldPassword = document.getElementById("password-current").value;
    const newPassword = document.getElementById("password").value;
    const newPasswordConfirm = document.getElementById("password-confirm")
      .value;
    await updateUserSettings(
      { oldPassword, newPassword, newPasswordConfirm },
      "password"
    );
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
    document.querySelector(".btn--update-password").innerHTML = "Save Password";
  });
}

if (updateUserForm) {
  updateUserForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = new FormData();

    form.append("email", document.getElementById("email").value);
    form.append("name", document.getElementById("name").value);
    form.append("photo", document.getElementById("photo").files[0]);

    console.log(
      form.getAll("name"),
      form.getAll("email"),
      form.getAll("photo")
    );
    updateUserSettings(form, "data");
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}

if (loginForm)
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
