const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");

const userController = require("./v1/controllers/user.controller");

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/v1/users", userController);

app.get("*", (req, res) => {
  res.status(400).json([
    {
      errors: [
        {
          message: "Bad request",
        },
      ],
    },
  ]);
});

app.listen(PORT, () => {
  console.log("🚀 Application successfully started in port: " + PORT);
});
