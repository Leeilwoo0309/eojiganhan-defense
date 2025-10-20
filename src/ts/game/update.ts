requestAnimationFrame(animationLoop);

let atkWait = 0;
// update 메인
setInterval(() => {
    movePlayer();
    setVariables();
    synchronize();

    if (ID === 0) {
        monster.forEach((e) => e.chaseTarget());

        if (leftMobs === 0 && waveTermTime === 0) {
            waveFinish();
        }
    }

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
                    damageType: "melee",
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
    monster.forEach((e) => {
        e.entityAnimations();
    });
    monster = monster.filter((x) => x.state.hp[0] > 0);

    // GameObject 클래스 위치 재조정
    objects.forEach((e, i) => {
        e.updatePosition();
    });

    centerDiv.forEach((e, i) => {
        e.style.left = `${winSize.x / 2 - parseInt(e.style.width) / 2}px`;
    });
    center2Div.forEach((e, i) => {
        e.style.top = `${winSize.y / 2 - parseInt(e.style.height) / 2}px`;
    });

    BODY.style.backgroundPositionX = `${-cameraPosition.x}px`;
    BODY.style.backgroundPositionY = `${cameraPosition.y}px`;

    if (goldP instanceof HTMLParagraphElement) goldP.innerHTML = `${getPlayerById(ID).gold}G`;
    if (nicknameP instanceof HTMLParagraphElement)
        nicknameP.innerHTML = `${getPlayerById(ID).nickname}`;

    if (player[ID]?.state) {
        if (hpBarProgress instanceof HTMLDivElement)
            hpBarProgress.style.width = `${
                (player[ID].state.hp[0] / player[ID].state.hp[1]) * 100
            }%`;
        if (levelBarProgress instanceof HTMLDivElement)
            levelBarProgress.style.width = `${
                (player[ID].exp[1] / needExp[player[ID].exp[0]]) * 100
            }%`;

        (
            document.querySelector(".hp-gui>span") as HTMLParagraphElement
        ).innerHTML = `${player[ID].state.hp[0]} / ${player[ID].state.hp[1]}`;

        (document.querySelector(".level-gui>span") as HTMLParagraphElement).innerHTML = `${
            player[ID].exp[1]
        } / ${needExp[player[ID].exp[0]]}`;

        (document.querySelector("#bgui3") as HTMLDivElement).innerHTML = `
            <p>공격력: ${player[ID].stat.ad}</p>
            <p>공격속도: ${player[ID].stat.attackSpeed}</p>
            <p>이동 속도: ${player[ID].stat.moveSpeed * 10}</p>
            <p>치명타 확률: ${player[ID].stat.criticalChance}</p>
            <p>치명타 피해: ${player[ID].stat.criticalDamage * 100}%</p>
            <p>방어력: ${player[ID].stat.armor}</p>
            <p>강인함: ${player[ID].stat.ccTimeDown}%</p>
            <p>피해 감소: ${player[ID].stat.armorPercent}%</p>
            <p id="end">초당 체력 회복: ${player[ID].stat.hpRegeneration}</p>
        `;
    }

    if (waveText instanceof HTMLParagraphElement) waveText.innerHTML = `WAVE ${wave}`;
    if (leftMobText instanceof HTMLParagraphElement) {
        if (waveTermTime > 0) leftMobText.innerHTML = `남은 시간: ${waveTermTime}`;
        else leftMobText.innerHTML = `남은 몹: ${leftMobs}`;
    }

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

    let sendData: {
        projectile: Projectile[];
        player: PlayerClass;
        monsters: Monster[];
        monstersModify: Monster[];
    } = {
        projectile: projectiles,
        player: getPlayerById(ID),
        monsters: [],
        monstersModify: [],
    };

    if (ID === 0) {
        monster.forEach((e) => {
            if (e.isSent === false) {
                sendData.monsters.push(e);
                e.isSent = true;
            } else {
                sendData.monstersModify.push(e);
            }
        });
    }

    sendToPlayers("synchronize", sendData);
}
