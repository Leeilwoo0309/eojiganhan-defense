class Monster extends Entity {
    public isSent: boolean = false;
    private atkWait: number = 0;

    constructor(id: number) {
        super(id, "monster");

        this.selector.style.backgroundColor = "red";

        this.stat.moveSpeed = 3;
    }

    public setPosition(pos: Position) {
        this.position = pos;
        return this;
    }

    public setHpArmor(hp: [number, number], armor: number) {
        this.state.hp = hp;
        this.stat.armor = armor;

        return this;
    }

    public chaseTarget() {
        let min: number = 1000000;
        let target: number = 5;

        player.forEach((e) => {
            if (min > e.getDistance(this.position) && e.state.hp[0] > 0) {
                min = e.getDistance(this.position);
                target = e.id;
            }
        });

        if (target === 5) return;

        const targetPlayer = getPlayerById(target);
        const angle = Math.atan2(
            targetPlayer.position.y - this.position.y,
            targetPlayer.position.x - this.position.x
        );

        if (targetPlayer.halfSize * 2 < targetPlayer.getDistance(this.position)) {
            this.position.x += this.stat.moveSpeed * Math.cos(angle);
            this.position.y += this.stat.moveSpeed * Math.sin(angle);
        } else {
            if (this.atkWait === 0) {
                targetPlayer.getDamage(this.stat.ad, "melee", this.id);
                this.atkWait = 32;
            } else this.atkWait -= 1;
        }
    }
}

function waveStart() {
    const needToSpawnMobs = wave + 9;
    leftMobs = wave + 9;
    let i = 0;

    const generateMobs = setInterval(() => {
        monsterId += 1;

        monster.push(
            new Monster(monsterId)
                .setPosition({ x: rand(-1100, 1100), y: rand(-1100, 1100) })
                .setHpArmor([80 * 1.3 ** (wave - 1), 80 * 1.3 ** (wave - 1)], 3 * 1.2 ** (wave - 1))
        );

        if (i === needToSpawnMobs - 1) clearInterval(generateMobs);
        else i++;
    }, 500);
}

function waveFinish() {
    sendToPlayers("WAVE_FIN");
    wave += 1;
    waveTermTime = 15;

    const timeDecrease = setInterval(() => {
        waveTermTime -= 1;
        sendToPlayers("WAVE_TERM_TIME_DEC", { time: waveTermTime });

        if (waveTermTime === 0) clearInterval(timeDecrease);
    }, 1000);

    setTimeout(() => {
        waveStart();
    }, 15000);
}
