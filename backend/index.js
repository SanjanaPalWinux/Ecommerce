// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv").config();
const app = express();
const PORT = 8080;

app.use(cors());

app.use(bodyParser.json());

app.use(express.json({ limit: "10mb" }));

//mongoDb connection

console.log(process.env.MONGO_DB_URL);

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

//schema

const userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  password: String,
  confirmpassword: String,
  profile: String,
});

const productSchema = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String,
});

//model
const userModel = mongoose.model("user", userSchema);
const productModel = mongoose.model("product", productSchema);

app.get("/", (req, res) => {
  res.send("Running");
});

//signup

app.post("/signup", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await userModel.findOne({ email: email });
    if (result) {
      res.send({ message: "Eamil id already present", alert: false });
    } else {
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "User added successfully", alert: true });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

//login

app.post("/login", async (req, res) => {
  const { email } = req.body;
  try {
    const result = await userModel.findOne({ email: email });
    if (result) {
      const dataToSend = {
        _id: result._id,
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        password: result.password,
        confirmpassword: result.confirmpassword,
        profile: result.profile,
      };
      res.send({
        message: "Logged  in successfull",
        alert: true,
        data: dataToSend,
      });
    } else {
      res.send({ message: "Email not available", alert: false });
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

// newproduct

app.post("/upload-product", async (req, res) => {
  const result = await productModel(req.body);
  result.save();

  res.send({ message: "New product added successfully", data: req.body });
});

//product

app.get("/product", async (Req, res) => {
  const data = await productModel.find({});
  res.send(JSON.stringify(data));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
