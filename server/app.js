const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cors = require("cors");
const crypto = require("crypto");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cors());

const SECRET_KEY = process.env.JWT_TOKEN;
let data;
fs.readFile("server/data.json", "utf8", (err, jsonString) => {
  if (err) {
    console.log("File read failed:", err);
    return;
  }
  data = JSON.parse(jsonString);
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  next();
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;

  if (data.users.find((user) => user.email === email)) {
    res.status(400).json({ message: "User with email already exists" });
    return;
  }
  //create a hash of the password
  const hash = crypto.createHash("sha256");
  hash.update(password);
  const hashedPassword = hash.digest("hex");

  data.users.push({ email, password: hashedPassword });
  fs.writeFile("server/data.json", JSON.stringify(data), (err) => {
    if (err) {
      console.log("File write failed:", err);
      res.sendStatus(500);
      return;
    }
    const token = jwt.sign({ email }, SECRET_KEY);
    res.json({ token });
  });
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find((user) => user.email === email);
  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  //hash the input password to check if it's the same as the hashed one on the data file
  const hash = crypto.createHash("sha256");
  hash.update(password);
  const hashedPassword = hash.digest("hex");
  if (user.password !== hashedPassword) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }
  const token = jwt.sign({ email }, SECRET_KEY);
  res.json({ token });
});

function verifyJWT(req, res, next) {
  const token = req.headers["x-access-token"];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    req.email = decoded.email;
    next();
  });
}

app.get("/protected", verifyJWT, (req, res) => {
  res.json({ message: `Welcome, ${req.email}` });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
