const PORT = { ws: 8003, api: 1975 };

const WebSocket = require("ws");
const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const os = require("os");

const wss = new WebSocket.Server({ port: PORT.ws });
const app = express();

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",

    // 색상
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    // 배경색
    bgGreen: "\x1b[42m",
    bgBlue: "\x1b[44m",
};

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

/*****************************/

app.get("/game", (req, res) => {
    const nickname = req.query.nickname;
    const id = req.query.id;

    res.sendFile(
        `C:/Users/leeil/OneDrive/Desktop/defense/public/game.html?nickname=${nickname}&id=${id}`
    );
});

const readClassFile = async (basePath, className, res) => {
    try {
        const filePath = path.join(__dirname, "jsons", basePath, `${className}.json`);
        const data = await fs.readFile(filePath, "utf8");
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (err) {
        if (err.code === "ENOENT") {
            return res.status(404).json({ error: "Class not found" });
        }
        console.error(err);
        res.status(500).json({ error: "Failed to read or parse file" });
    }
};

const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // IPv4이고 내부 주소가 아닌 경우
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "localhost";
};
const localIP = getLocalIP();

app.get("/class/:class", async (req, res) => {
    await readClassFile("", req.params.class, res);
});
app.get("/class/:class", (req, res) => {
    readClassFile("", req.params.class, res);
});

app.get("/class/:class/passives", (req, res) => {
    readClassFile("passives", req.params.class, res);
});

app.get("/class/:class/skills", (req, res) => {
    readClassFile("skills", req.params.class, res);
});

app.listen(PORT.api, () => {
    console.clear();

    console.log("\n" + colors.cyan + "=".repeat(50) + colors.reset);
    console.log(colors.bright + colors.green + "🚀 SERVER STARTED" + colors.reset);
    console.log(colors.cyan + "=".repeat(50) + colors.reset);
    console.log(
        colors.blue +
            "📡 WSS Server: " +
            colors.reset +
            colors.yellow +
            colors.bright +
            `http://${localIP}:${PORT.ws}` +
            colors.reset
    );
    console.log(
        colors.blue +
            "🌐 API Server: " +
            colors.reset +
            colors.yellow +
            colors.bright +
            `http://${localIP}:${PORT.api}` +
            colors.reset
    );
    console.log(colors.green + "✅ Status: " + colors.bright + "Running" + colors.reset);
    console.log(colors.dim + `⏰ Time: ${new Date().toLocaleString("ko-KR")}` + colors.reset);
    console.log(colors.cyan + "=".repeat(50) + colors.reset + "\n");
});
