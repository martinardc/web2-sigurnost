const form = document.getElementById("sqli-form");
const username = document.getElementById("sqli-user");
const password = document.getElementById("sqli-pass");
const vulnerable = document.getElementById("sqli-toggle")
const out = document.getElementById("sqli-out");

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