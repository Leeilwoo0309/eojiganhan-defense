class PlayerClass extends Entity {
    public nickname: string = "감자전";
    public className: PlayerClassNames = "adc";
    public gold: number = 0;
    /** [레벨, 경험치] */
    public exp: [number, number] = [0, 0];
    public level: number = 1;
    public runes: number[] = [];

    constructor(id: number, nickname: string, className: PlayerClassNames, runes: number[]) {
        super(id, "player");
        this.nickname = nickname;
        this.className = className;
        this.runes = runes;

        this.selector.innerHTML = `
            <div class="info">
                <span id="nickname">${this.nickname}</span>
            </div>

            <div class="hp player${this.id}">
                <div class="hp-progress later player${this.id}"></div>
                <div class="hp-progress barrier player${this.id}"></div>
                <div class="hp-progress player${this.id}"></div>
            </div>
            <div class="damage-print player${this.id}">
            </div>
        `;
    }

    public getDistance(position: Position): number {
        return Math.sqrt(
            Math.pow(position.x - this.position.x, 2) + Math.pow(position.y - this.position.y, 2)
        );
    }
}

/**
 * 플레이어의 움직임 총괄.
 */
function movePlayer() {
    let velocityVector = { x: 0, y: 0 };

    if (keyDown.w) velocityVector.y += getPlayerById(ID).stat.moveSpeed;
    if (keyDown.a) velocityVector.x -= getPlayerById(ID).stat.moveSpeed;
    if (keyDown.s) velocityVector.y -= getPlayerById(ID).stat.moveSpeed;
    if (keyDown.d) velocityVector.x += getPlayerById(ID).stat.moveSpeed;

    // 대각선 이동 시 이동속도 감소
    if (velocityVector.x * velocityVector.x == velocityVector.y * velocityVector.y) {
        velocityVector.x /= Math.SQRT2;
        velocityVector.y /= Math.SQRT2;
    }

    if (Math.abs(getPlayerById(ID).position.x + velocityVector.x) < 1132) {
        getPlayerById(ID).position.x += velocityVector.x;
        mousePosition.x += velocityVector.x;
    }
    if (Math.abs(getPlayerById(ID).position.y + velocityVector.y) < 1132) {
        getPlayerById(ID).position.y += velocityVector.y;
        mousePosition.y += velocityVector.y;
    }

    cameraPosition.x = getPlayerById(ID).position.x - window.innerWidth * 0.5;
    cameraPosition.y = getPlayerById(ID).position.y + window.innerHeight * 0.5;
}

function getPlayerById(id: number): PlayerClass {
    let ret: PlayerClass[] = [];

    player.forEach((e, i) => {
        if (e.id === id) ret[0] = e;
    });

    return ret[0];
}
