const router = require("express").Router();
const { pool } = require("../db");

const attempts = new Map();
const MAX_ATTEMPTS = 5;
const BLOCK_MS = 60 * 1000;

router.post("/login", async (req, res) => {
    const { username, password, vulnerable } = req.body;

    const state = attempts.get(username) || { count: 0, blockedUntil: 0 };

    try {
        if (!vulnerable && Date.now() < state.blockedUntil) {
            const secondsLeft = Math.ceil((state.blockedUntil - Date.now()) / 1000);
            return res.status(429).json({
                success: false,
                blocked: true,
                message: "Račun je privremeno blokiran, pokušaj za " + secondsLeft + " s"
            });
        }

        const result = await pool.query(
            "SELECT * FROM users WHERE username = $1 AND password = $2",
            [username, password]
        );
        const success = result.rows.length > 0;

        if (success) {
            attempts.delete(username);
            return res.json({ success: true, message: "Prijava uspjela" });
        }

        
        if (!vulnerable) {
            state.count++;
            if (state.count >= MAX_ATTEMPTS) {
                state.blockedUntil = Date.now() + BLOCK_MS;
                state.count = 0;
                attempts.set(username, state);
                return res.status(429).json({
                    success: false,
                    blocked: true,
                    message: "Previše neuspjelih pokušaja, račun je blokiran na 60 s"
                });
            }
            attempts.set(username, state);
        }

        res.json({ success: false, message: "Pogrešno korisničko ime ili zaporka" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;