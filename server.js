require("dotenv").config();
const express = require("express");
const app = express();
const { pool, initDb } = require("./db");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

initDb().then(() => {
  app.listen(PORT, () => {
    console.log("Slušam na portu " + PORT);
  });
});

app.get("/db-test", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM users");
  res.json(rows);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Slušam na portu " + PORT);
});

