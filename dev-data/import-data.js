const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");

const Tour = require("./../models/tourModel");
const Review = require("./../models/reviewModel");
const User = require("./../models/userModel");

dotenv.config({ path: "./config.env" });
const connectionString = process.env.DATABASE;
console.log(connectionString);
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
  })
  .then(() => console.log("connected !"))
  .catch(err => console.log("not connected!", err.message));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });

    console.log("data imported successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();

    console.log("data deleted successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit(1);
};
if (process.argv[2] === "--i") {
  importData();
} else if (process.argv[2] === "--d") {
  deleteData();
}
