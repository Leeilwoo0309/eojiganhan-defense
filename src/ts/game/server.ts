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
    sendToPlayers("CONNECTED", { className: CLASS_NAME, runes: RUNES });

    socket.onmessage = (event) => {
        const blob = event.data;
        const reader = new FileReader();

        reader.onload = () => {
            //@ts-ignore
            const receivedJson: Protocol = JSON.parse(reader.result);
            const message = receivedJson.body.type;

            if (message === "CONNECTED") {
                player = player.filter((e) => e.id !== receivedJson.header.id);
                player.push(
                    new PlayerClass(
                        receivedJson.header.id,
                        receivedJson.header.nickname,
                        //@ts-ignore
                        receivedJson.body.data.className,
                        //@ts-ignore
                        receivedJson.body.data.runes
                    )
                );
                player.sort((x, y) => x.id - y.id);

                sendToPlayers("PLAYER", getPlayerById(ID));
            } else if (message == "PLAYER") {
                player = player.filter((e) => e.id !== receivedJson.header.id);

                //@ts-ignore
                player.push(
                    new PlayerClass(
                        receivedJson.header.id,
                        receivedJson.header.nickname,
                        //@ts-ignore
                        receivedJson.body.data.className,
                        //@ts-ignore
                        receivedJson.body.data.runes
                    )
                );
                player.sort((x, y) => x.id - y.id);
            } else if (message == "WAVE_TERM_TIME_DEC") {
                //@ts-ignore
                waveTermTime = receivedJson.body.data.time;
            } else if (message == "WAVE_FIN") {
                wave += 1;
                leftMobs = 0;
                (document.querySelector(".monsters-div") as HTMLDivElement).innerHTML = "";
            } else if (message == "DAMAGE") {
                //@ts-ignore
                const data: { target: number; damage: number; type: DamageType; attkerId: number } =
                    receivedJson.body.data;
                if (data.target === ID) {
                    getPlayerById(ID).getDamage(data.damage, data.type, data.attkerId, true);
                }
            } else if (message == "SYNCHRONIZE") {
                //@ts-ignore
                const kimchi: {
                    projectile: Projectile[];
                    player: PlayerClass;
                    monsters: Monster[];
                    monstersModify: Monster[];
                } = receivedJson.body.data;

                kimchi.projectile.forEach((e) => {
                    e.projectileINIT.isSent = true;

                    projectiles.push(new Projectile().modify(e));
                });

                kimchi.monsters.forEach((e) => {
                    monster.push(
                        new Monster(e.id)
                            .setHpArmor(e.state.hp, e.stat.armor)
                            .setPosition(e.position)
                    );
                });

                kimchi.monstersModify.forEach((e) => {
                    const mon = getMonsterById(e.id);

                    if (mon?.position) {
                        mon.position = e.position;
                        mon.state.hp = e.state.hp;
                        mon.stat.armor = e.stat.armor;
                    }
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

function getMonsterById(id: number): Monster {
    let ret: Monster;
    monster.forEach((e) => {
        if (e.id === id) ret = e;
    });

    //@ts-ignore
    return ret;
}
