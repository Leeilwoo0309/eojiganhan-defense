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
