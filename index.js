const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");


const corsOptions = function (req, callback) {
  return callback(null, { origin: true });
};

app.use(cors(corsOptions));

app.use(express.json());

require("./connectDB");

const authRouter = require("./routes/auth.router");

app.use("/api/v1/auth", authRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log("Server running on port " + PORT));
