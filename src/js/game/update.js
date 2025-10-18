"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
requestAnimationFrame(animationLoop);
var atkWait = 0;
// update 메인
setInterval(function () {
    movePlayer();
    setVariables();
    synchronize();
    if (ID === 0) {
        monster.forEach(function (e) { return e.chaseTarget(); });
    }
    if (mouseDown[0] && atkWait <= 0) {
        atkWait += 100 / getPlayerById(ID).stat.attackSpeed;
        var angle = Math.atan2(getPlayerById(ID).position.y - mousePosition.y, getPlayerById(ID).position.x - mousePosition.x);
        projectiles.push(new ProjectileBuilder()
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
            .build("player"));
    }
}, 16);
setInterval(function () {
    if (atkWait > 0)
        atkWait -= 1;
}, 10);
/**
 * 모든 애니메이션들 총집합 | 모든 div들의 위치 재조정
 */
function animationLoop() {
    // 플레이어 위치 재조정
    player.forEach(function (e, i) {
        e.entityAnimations();
    });
    // 몬스터 위치 재조정
    monster.forEach(function (e) {
        e.entityAnimations();
    });
    monster = monster.filter(function (x) { return x.state.hp[0] > 0; });
    // GameObject 클래스 위치 재조정
    objects.forEach(function (e, i) {
        e.updatePosition();
    });
    centerDiv.forEach(function (e, i) {
        e.style.left = "".concat(winSize.x / 2 - parseInt(e.style.width) / 2, "px");
    });
    BODY.style.backgroundPositionX = "".concat(-cameraPosition.x, "px");
    BODY.style.backgroundPositionY = "".concat(cameraPosition.y, "px");
    if (goldP instanceof HTMLParagraphElement)
        goldP.innerHTML = "".concat(getPlayerById(ID).gold, "G");
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
    var newProjectile = [];
    projectiles.forEach(function (e) {
        if (e.projectileINIT.isSent || !e.projectileINIT.isArrive)
            return;
        if (e.projectileINIT.id == ID)
            newProjectile.push(e);
        if (ID === 0 && e.projectileINIT.id >= 100)
            newProjectile.push(e);
        e.projectileINIT.isSent = true;
    });
    projectiles = __spreadArray([], newProjectile, true);
    var sendData = {
        projectile: projectiles,
        player: getPlayerById(ID),
        monsters: [],
        monstersModify: [],
    };
    if (ID === 0) {
        monster.forEach(function (e) {
            if (e.isSent === false) {
                sendData.monsters.push(e);
                e.isSent = true;
            }
            else {
                sendData.monstersModify.push(e);
            }
        });
    }
    sendToPlayers("synchronize", sendData);
}
var monsterId = 101;
var generateMonster = setInterval(function () {
    monster.push(new Monster(monsterId)
        .setPosition({ x: rand(-1100, 1100), y: rand(-1100, 1100) })
        .setHpArmor([120, 120], 20));
    monsterId += 1;
}, 1000);
if (ID !== 0)
    clearInterval(generateMonster);
