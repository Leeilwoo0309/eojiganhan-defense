const PORT = { ws: 8003, api: 1975 };

const WebSocket = require("ws");
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const wss = new WebSocket.Server({ port: PORT.ws });
const app = express();

app.use(cors());
app.use(express.static("public"));
// const { open } = require('sqlite');
// const sqlite3 = require('sqlite3');

const clients = new Set();

console.clear();

wss.on("connection", (ws) => {
    clients.add(ws);

    ws.on("message", (message) => {
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // ws.on('close', () => {
    //     clients.delete(ws);
    //     clients.forEach((client) => {
    //         if (client !== ws && client.readyState === WebSocket.OPEN) {
    //             client.send(JSON.stringify({message: "disconnect"}));
    //         }
    //     });
    // });
});

console.log(`WSS server is running in: http://localhost:${PORT.ws}`);

app.get("/game", (req, res) => {
    const nickname = req.query.nickname;
    const id = req.query.id;

    res.sendFile(
        `C:/Users/leeil/OneDrive/Desktop/defense/public/game.html?nickname=${nickname}&id=${id}`
    );
});

app.get("/class/:class", (req, res) => {
    const className = req.params.class;
    const filePath = path.join(__dirname, "jsons", `${className}.json`);

    // 파일 존재 여부 확인
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Class not found" });
    }

    // 파일 읽어서 전송
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to read file" });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            res.status(500).json({ error: "Invalid JSON format" });
        }
    });
});

app.listen(PORT.api, () => {
    console.log(`API server is running in: http://localhost:${PORT.api}`);
});
