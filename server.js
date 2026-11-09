const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please complete all fields."
        });
    }

    const filePath = path.join(__dirname, "data", "messages.json");

    fs.readFile(filePath, "utf8", (error, data) => {
        let messages = [];

        if (!error && data) {
            messages = JSON.parse(data);
        }

        messages.push({
            name: name,
            email: email,
            message: message,
            date: new Date().toISOString()
        });

        fs.writeFile(filePath, JSON.stringify(messages, null, 2), writeError => {
            if (writeError) {
                return res.status(500).json({
                    success: false,
                    message: "Unable to save message."
                });
            }

            res.json({
                success: true,
                message: "Message sent successfully."
            });
        });
    });
});

app.listen(PORT, () => {
    console.log("Portfolio running at http://localhost:" + PORT);
});