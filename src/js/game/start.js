"use strict";
var param = new URLSearchParams(window.location.search);
var ID = Number(param.get("id"));
var NICKNAME = param.get("nickname");
var BODY = document.body;
var centerDiv = document.querySelectorAll(".center");
var player = [new PlayerClass(ID, NICKNAME)];
var monster = [new Monster(100)];
var projectiles = [];
var keyDown = {};
var mouseDown = [false, false, false];
var winSize = { x: 1600, y: 900 };
var cameraPosition = { x: 0, y: 0 };
var mousePosition = { x: 0, y: 0 };
var objects = [
    new GameObjectBuilder()
        .setPosition(-1200, 0)
        .setSize(5000, 2500)
        .setStyle("gray", false)
        .build(true),
    new GameObjectBuilder()
        .setPosition(1200, 0)
        .setSize(5000, 2500)
        .setStyle("gray", false)
        .build(true),
    new GameObjectBuilder()
        .setPosition(0, 1200)
        .setSize(2500, 2500)
        .setStyle("gray", false)
        .build(true),
    new GameObjectBuilder()
        .setPosition(0, -1200)
        .setSize(2500, 2500)
        .setStyle("gray", false)
        .build(true),
];
/*****************************************************************************************/
/* ^^ 변수 선언 ^^ ||| vv start 부분 vv*/
/*****************************************************************************************/
document.body.addEventListener("keydown", function (e) {
    var key = e.key.toLowerCase();
    if (key === " ")
        key = "space";
    keyDown[key] = true;
});
document.body.addEventListener("keyup", function (e) {
    var key = e.key.toLowerCase();
    if (key === " ")
        key = "space";
    keyDown[key] = false;
});
BODY.style.width = "17000px";
BODY.style.height = "17000px";
// 마우스 위치 구함
BODY.addEventListener("mousemove", function (e) {
    mousePosition.x = e.clientX + cameraPosition.x;
    mousePosition.y = -e.clientY + cameraPosition.y;
});
BODY.addEventListener("mousedown", function (e) {
    mouseDown[e.button] = true;
});
BODY.addEventListener("mouseup", function (e) {
    mouseDown[e.button] = false;
});
/** 게임 시작 시 작동하는 코드 */
function start() { }
