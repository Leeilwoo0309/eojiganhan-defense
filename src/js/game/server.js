"use strict";
var socket = new WebSocket("ws://kimchi-game.kro.kr:8003");
function sendToPlayers(type, data) {
    var _a;
    if (data === void 0) { data = undefined; }
    socket.send(JSON.stringify({
        header: { id: ID, nickname: (_a = getPlayerById(ID)) === null || _a === void 0 ? void 0 : _a.nickname },
        body: {
            type: type.toUpperCase(),
            data: data,
        },
    }));
}
socket.onopen = function () {
    sendToPlayers("CONNECTED");
    socket.onmessage = function (event) {
        var blob = event.data;
        var reader = new FileReader();
        reader.onload = function () {
            //@ts-ignore
            var receivedJson = JSON.parse(reader.result);
            var message = receivedJson.body.type;
            if (message === "CONNECTED") {
                player = player.filter(function (e) { return e.id !== receivedJson.header.id; });
                player.push(new PlayerClass(receivedJson.header.id, receivedJson.header.nickname));
                player.sort(function (x, y) { return x.id - y.id; });
                sendToPlayers("PLAYER", getPlayerById(ID));
            }
            else if (message == "PLAYER") {
                player = player.filter(function (e) { return e.id !== receivedJson.header.id; });
                //@ts-ignore
                player.push(new PlayerClass(receivedJson.header.id, receivedJson.header.nickname));
                player.sort(function (x, y) { return x.id - y.id; });
            }
            else if (message == "SYNCHRONIZE") {
                //@ts-ignore
                var kimchi = receivedJson.body.data;
                kimchi.projectile.forEach(function (e) {
                    e.projectileINIT.isSent = true;
                    projectiles.push(new Projectile().modify(e));
                });
                getPlayerById(kimchi.player.id).modify(kimchi.player);
            }
        };
        reader.readAsText(blob);
    };
};
