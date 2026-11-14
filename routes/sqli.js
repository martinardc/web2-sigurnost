const router = require("express").Router();
const { pool } = require("../db");

router.post("/login", async (req, res) => {
    const { username, password, vulnerable } = req.body
    try {
        let query, result;
        if (vulnerable) {
            query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "';";
            result = await pool.query(query)
        } else {
            query = "SELECT * FROM users WHERE username = $1 and password = $2";
            result = await pool.query(query, [username, password]);
        }
        res.json({ query, rows: result.rows, success: result.rows.length > 0});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

})

module.exports = router;