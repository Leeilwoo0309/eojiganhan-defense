requestAnimationFrame(animationLoop);

// update 메인
setInterval(() => {
    movePlayer();
    setVariables();
}, 16);

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
