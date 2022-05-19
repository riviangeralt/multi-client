const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require("./db/index");

//routes import
const auth = require("./routes/auth");
const merchant = require("./routes/merchant");
const user = require("./routes/user");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

connectToMongo().then(() => {
  console.log("Connection to MongoDB Successful");
});

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
app.use("/api/v1", auth);
app.use("/api/v1", merchant);
app.use("/api/v1", user);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Express running on ${PORT}`);
});
