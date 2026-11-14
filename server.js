require("dotenv").config();
const express = require("express");
const app = express();
const { initDb } = require("./db");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/sqli", require("./routes/sqli"));
app.use("/api/auth", require("./routes/auth"));

initDb().then(() => {
  app.listen(PORT, () => {
    console.log("Slušam na portu " + PORT);
  });
});