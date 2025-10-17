class PlayerClass extends Entity {
    public nickname: string = "감자전";
    public gold: number = 0;
    public exp: number = 0;
    public level: number = 1;

    constructor(id: number, nickname: string) {
        super(id, "player");
        this.nickname = nickname;

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
}

/**
 * 플레이어의 움직임 총괄.
 */
function movePlayer() {
    let velocityVector = { x: 0, y: 0 };

    if (keyDown.w) velocityVector.y += player[ID].stat.moveSpeed;
    if (keyDown.a) velocityVector.x -= player[ID].stat.moveSpeed;
    if (keyDown.s) velocityVector.y -= player[ID].stat.moveSpeed;
    if (keyDown.d) velocityVector.x += player[ID].stat.moveSpeed;

    // 대각선 이동 시 이동속도 감소
    if (velocityVector.x * velocityVector.x == velocityVector.y * velocityVector.y) {
        velocityVector.x /= Math.SQRT2;
        velocityVector.y /= Math.SQRT2;
    }

    if (Math.abs(player[ID].position.x + velocityVector.x) < 1132) {
        player[ID].position.x += velocityVector.x;
        mousePosition.x += velocityVector.x;
    }
    if (Math.abs(player[ID].position.y + velocityVector.y) < 1132) {
        player[ID].position.y += velocityVector.y;
        mousePosition.y += velocityVector.y;
    }

    cameraPosition.x = player[ID].position.x - window.innerWidth * 0.5;
    cameraPosition.y = player[ID].position.y + window.innerHeight * 0.5;
}
