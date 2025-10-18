const PORT = { ws: 8003, api: 1975 };
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: PORT.ws });

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
