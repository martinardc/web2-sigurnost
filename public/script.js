const form = document.getElementById("sqli-form");
const username = document.getElementById("sqli-user");
const password = document.getElementById("sqli-pass");
const vulnerable = document.getElementById("sqli-toggle")
const out = document.getElementById("sqli-out");

const form_a = document.getElementById("auth-form");
const username_a = document.getElementById("auth-user");
const vulnerable_a = document.getElementById("auth-toggle")
const out_a = document.getElementById("auth-out");


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const res = await fetch("/api/sqli/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value,
            vulnerable: vulnerable.checked
        }),
    });

    const data = await res.json();
    out.textContent = JSON.stringify(data, null, 2);
});

form_a.addEventListener("submit", async (event) => {
    event.preventDefault();
    const passwords = ["abc123", "abcd1234", "000000", "abcdef","password123", "123456", "qwerty",   "password", "lozinka"]
    out_a.textContent = "";
    let ctr = 1;
    let found = false;
    for (const p of passwords) {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username_a.value,
                password: p,
                vulnerable: vulnerable_a.checked
            }),
        });

        const data = await res.json();
        out_a.textContent += "Pokušaj " + ctr + ": " + p + " -> " + data.message + "\n";
        if (data.success) {
            out_a.textContent += "Pogođeno nakon " + (ctr) + " pokušaja\n";
            found = true;
            break;
        }
        if (data.blocked) {
            out_a.textContent += "Blokirano nakon " + (ctr) + " pokušaja\n";
            found = true;
            break;
        }
        ctr += 1;
    }
    if (!found) {
        out_a.textContent += "Zaporka nije pronađena u listi\n";
    }
});