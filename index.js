const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app"); // Express App

dotenv.config({ path: "./config.env" });

const connectionString = process.env.DATABASE;

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("connected !"));

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log("listening on port 3000");
});

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("Error !! Shuttting the server");
  server.close(() => {
    process.exit(1);
  });
});
