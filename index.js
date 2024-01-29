const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");

const allowlist = ["https://thyroidlab-do1sm25az-dhruv69408012s-projects.vercel.app"];

const corsOptions = function (req, callback) {
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    return callback(null, { origin: true });
  } else {
    return callback(new Error("Not allowed by CORS"));
  }
};

app.use(cors(corsOptions));

app.use(express.json());

require("./connectDB");

const authRouter = require("./routes/auth.router");

app.use("/api/v1/auth", authRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log("Server running on port " + PORT));
