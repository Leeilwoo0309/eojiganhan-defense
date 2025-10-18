requestAnimationFrame(animationLoop);

let atkWait = 0;
// update 메인
setInterval(() => {
    movePlayer();
    setVariables();
    synchronize();

    if (mouseDown[0] && atkWait <= 0) {
        atkWait += 100 / getPlayerById(ID).stat.attackSpeed;
        const angle = Math.atan2(
            getPlayerById(ID).position.y - mousePosition.y,
            getPlayerById(ID).position.x - mousePosition.x
        );

        projectiles.push(
            new ProjectileBuilder()
                .setInfo({
                    angle: angle,
                    reach: 700,
                    speed: 30,
                    tag: "aa",
                    id: ID,
                    damageType: "magic",
                })
                .setHitInfo({
                    critical: [0, 0],
                    damage: getPlayerById(ID).stat.ad,
                })
                .setStyle({
                    color: "blue",
                    opacity: 100,
                })
                .setPositionSize(getPlayerById(ID).position.x, getPlayerById(ID).position.y, 20, 20)
                .build("player")
        );
    }
}, 16);

setInterval(() => {
    if (atkWait > 0) atkWait -= 1;
}, 10);

/**
 * 모든 애니메이션들 총집합 | 모든 div들의 위치 재조정
 */
function animationLoop() {
    // 플레이어 위치 재조정
    player.forEach((e, i) => {
        e.entityAnimations();
    });

    // 몬스터 위치 재조정
    monster.forEach((e) => e.entityAnimations());

    // GameObject 클래스 위치 재조정
    objects.forEach((e, i) => {
        e.updatePosition();
    });

    centerDiv.forEach((e, i) => {
        e.style.left = `${winSize.x / 2 - parseInt(e.style.width) / 2}px`;
    });

    BODY.style.backgroundPositionX = `${-cameraPosition.x}px`;
    BODY.style.backgroundPositionY = `${cameraPosition.y}px`;

    requestAnimationFrame(animationLoop);
}

/**
 * 변하는 변수들 재설정
 */
function setVariables() {
    winSize.x = window.innerWidth;
    winSize.y = window.innerHeight;
}

/**
 * 동기화
 */
function synchronize() {
    let newProjectile: Projectile[] = [];

    projectiles.forEach((e) => {
        if (e.projectileINIT.isSent || !e.projectileINIT.isArrive) return;

        if (e.projectileINIT.id == ID) newProjectile.push(e);
        if (ID === 0 && e.projectileINIT.id >= 100) newProjectile.push(e);

        e.projectileINIT.isSent = true;
    });

    projectiles = [...newProjectile];

    let sendData: { projectile: Projectile[]; player: PlayerClass; monsters: Monster[] } = {
        projectile: projectiles,
        player: getPlayerById(ID),
        monsters: [],
    };

    if (ID === 0) {
        sendData.monsters = monster;
    }

    sendToPlayers("synchronize", sendData);
}
