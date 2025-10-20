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
        if (leftMobs === 0 && waveTermTime === 0) {
            waveFinish();
        }
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
    var _a;
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
    center2Div.forEach(function (e, i) {
        e.style.top = "".concat(winSize.y / 2 - parseInt(e.style.height) / 2, "px");
    });
    BODY.style.backgroundPositionX = "".concat(-cameraPosition.x, "px");
    BODY.style.backgroundPositionY = "".concat(cameraPosition.y, "px");
    if (goldP instanceof HTMLParagraphElement)
        goldP.innerHTML = "".concat(getPlayerById(ID).gold, "G");
    if (nicknameP instanceof HTMLParagraphElement)
        nicknameP.innerHTML = "".concat(getPlayerById(ID).nickname);
    if ((_a = player[ID]) === null || _a === void 0 ? void 0 : _a.state) {
        if (hpBarProgress instanceof HTMLDivElement)
            hpBarProgress.style.width = "".concat((player[ID].state.hp[0] / player[ID].state.hp[1]) * 100, "%");
        if (levelBarProgress instanceof HTMLDivElement)
            levelBarProgress.style.width = "".concat((player[ID].exp[1] / needExp[player[ID].exp[0]]) * 100, "%");
        document.querySelector(".hp-gui>span").innerHTML = "".concat(player[ID].state.hp[0], " / ").concat(player[ID].state.hp[1]);
        document.querySelector(".level-gui>span").innerHTML = "".concat(player[ID].exp[1], " / ").concat(needExp[player[ID].exp[0]]);
        document.querySelector("#bgui3").innerHTML = "\n            <p>\uACF5\uACA9\uB825: ".concat(player[ID].stat.ad, "</p>\n            <p>\uACF5\uACA9\uC18D\uB3C4: ").concat(player[ID].stat.attackSpeed, "</p>\n            <p>\uC774\uB3D9 \uC18D\uB3C4: ").concat(player[ID].stat.moveSpeed * 10, "</p>\n            <p>\uCE58\uBA85\uD0C0 \uD655\uB960: ").concat(player[ID].stat.criticalChance, "</p>\n            <p>\uCE58\uBA85\uD0C0 \uD53C\uD574: ").concat(player[ID].stat.criticalDamage * 100, "%</p>\n            <p>\uBC29\uC5B4\uB825: ").concat(player[ID].stat.armor, "</p>\n            <p>\uAC15\uC778\uD568: ").concat(player[ID].stat.ccTimeDown, "%</p>\n            <p>\uD53C\uD574 \uAC10\uC18C: ").concat(player[ID].stat.armorPercent, "%</p>\n            <p id=\"end\">\uCD08\uB2F9 \uCCB4\uB825 \uD68C\uBCF5: ").concat(player[ID].stat.hpRegeneration, "</p>\n        ");
    }
    if (waveText instanceof HTMLParagraphElement)
        waveText.innerHTML = "WAVE ".concat(wave);
    if (leftMobText instanceof HTMLParagraphElement) {
        if (waveTermTime > 0)
            leftMobText.innerHTML = "\uB0A8\uC740 \uC2DC\uAC04: ".concat(waveTermTime);
        else
            leftMobText.innerHTML = "\uB0A8\uC740 \uBAB9: ".concat(leftMobs);
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
