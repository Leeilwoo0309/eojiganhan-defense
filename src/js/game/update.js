"use strict";
requestAnimationFrame(animationLoop);
var atkWait = 0;
// update 메인
setInterval(function () {
    movePlayer();
    setVariables();
    if (mouseDown[0] && atkWait <= 0) {
        console.log("object");
        atkWait += 100 / player[0].stat.attackSpeed;
        var angle = Math.atan2(player[0].position.y - mousePosition.y, player[0].position.x - mousePosition.x);
        projectiles.push(new ProjectileBuilder()
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
            damage: player[0].stat.ad,
        })
            .setStyle({
            color: "blue",
            opacity: 100,
        })
            .setPositionSize(player[0].position.x, player[0].position.y, 20, 20)
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
    monster.forEach(function (e) { return e.entityAnimations(); });
    // GameObject 클래스 위치 재조정
    objects.forEach(function (e, i) {
        e.updatePosition();
    });
    centerDiv.forEach(function (e, i) {
        e.style.left = "".concat(winSize.x / 2 - parseInt(e.style.width) / 2, "px");
    });
    BODY.style.backgroundPositionX = "".concat(-cameraPosition.x, "px");
    BODY.style.backgroundPositionY = "".concat(cameraPosition.y, "px");
    requestAnimationFrame(animationLoop);
}
/**
 * 변하는 변수들 재설정
 */
function setVariables() {
    winSize.x = window.innerWidth;
    winSize.y = window.innerHeight;
}
