const socket = new WebSocket("ws://kimchi-game.kro.kr:8003");

function sendToPlayers(type: string, data: any = undefined) {
    socket.send(
        JSON.stringify({
            header: { id: ID, nickname: getPlayerById(ID)?.nickname },
            body: {
                type: type.toUpperCase(),
                data: data,
            },
        })
    );
}

socket.onopen = () => {
    sendToPlayers("CONNECTED");

    socket.onmessage = (event) => {
        const blob = event.data;
        const reader = new FileReader();

        reader.onload = () => {
            //@ts-ignore
            const receivedJson: Protocol = JSON.parse(reader.result);
            const message = receivedJson.body.type;

            if (message === "CONNECTED") {
                player = player.filter((e) => e.id !== receivedJson.header.id);
                player.push(new PlayerClass(receivedJson.header.id, receivedJson.header.nickname));
                player.sort((x, y) => x.id - y.id);

                sendToPlayers("PLAYER", getPlayerById(ID));
            } else if (message == "PLAYER") {
                player = player.filter((e) => e.id !== receivedJson.header.id);
                //@ts-ignore

                player.push(new PlayerClass(receivedJson.header.id, receivedJson.header.nickname));
                player.sort((x, y) => x.id - y.id);
            } else if (message == "SYNCHRONIZE") {
                //@ts-ignore
                const kimchi: { projectile: Projectile[]; player: PlayerClass } =
                    receivedJson.body.data;

                kimchi.projectile.forEach((e) => {
                    e.projectileINIT.isSent = true;

                    projectiles.push(new Projectile().modify(e));
                });

                getPlayerById(kimchi.player.id).modify(kimchi.player);
            }
        };

        reader.readAsText(blob);
    };
};

type Protocol = {
    header: { id: number; nickname: string };
    body: {
        type: string;
        data: Object;
    };
};
