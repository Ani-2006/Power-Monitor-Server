const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CONFIGURATION ---
const AUTH_USER = "Ani";       // Your login ID
const AUTH_PASS = "Ani123";  // Your password
let powerData = { v: 0, i: 0, w: 0 };

// 1. Login Logic
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === AUTH_USER && password === AUTH_PASS) {
        res.send(getDashboardHTML());
    } else {
        res.send("<h2>Login Failed. Check credentials.</h2><a href='/'>Try again</a>");
    }
});

// 2. The Login Page (Root)
app.get('/', (req, res) => {
    res.send(`
        <html><head><meta name="viewport" content="width=device-width, initial-scale=1">
        <style>body{font-family:sans-serif; text-align:center; background:#121212; color:white; padding-top:50px;}
        input{display:block; margin:10px auto; padding:10px; border-radius:5px; border:none;}</style></head>
        <body><h2>Secure Power Gateway</h2>
        <form action="/login" method="POST">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" style="padding:10px 20px; cursor:pointer;">Enter Dashboard</button>
        </form></body></html>
    `);
});

// 3. The Dashboard HTML
function getDashboardHTML() {
    return `
        <html><head><meta name="viewport" content="width=device-width, initial-scale=1">
        <style>body{font-family:sans-serif; text-align:center; background:#121212; color:white;}
        .card{border:2px solid #ff0055; padding:20px; margin:20px; border-radius:15px; background:#1e1e1e;}
        .val{font-size:2.5em; color:#ff0055; font-weight:bold;}</style>
        <script>
            setInterval(() => {
                fetch('/get-data').then(r => r.json()).then(data => {
                    document.getElementById('v').innerText = data.v.toFixed(2) + " V";
                    document.getElementById('i').innerText = data.i.toFixed(2) + " mA";
                    document.getElementById('w').innerText = data.w.toFixed(3) + " W";
                });
            }, 2000);
        </script></head>
        <body><h2>Railway Power Monitor</h2>
        <div class="card">VOLTAGE<br><span id="v" class="val">0 V</span></div>
        <div class="card">CURRENT<br><span id="i" class="val">0 mA</span></div>
        <div class="card">WATTAGE<br><span id="w" class="val">0 W</span></div>
        <br><a href="/" style="color:#888;">Logout</a>
        </body></html>
    `;
}

// 4. ESP32 Data Endpoint
app.post('/upload', (req, res) => {
    powerData = req.body;
    res.sendStatus(200);
});

// 5. API for refreshing data
app.get('/get-data', (req, res) => {
    res.json(powerData);
});

app.listen(process.env.PORT || 3000, () => console.log("Server running"));
