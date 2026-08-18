require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 3000;
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const apiRoutes = require("./routes");

const app = express();


// console.log("Google API key exists:", !!process.env.GOOGLE_API_KEY);

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});