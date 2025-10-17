"use strict";
var ID = 0;
var BODY = document.body;
var centerDiv = document.querySelectorAll(".center");
var player = [new PlayerClass(0, "Vv지존새우vV")];
var monster = [];
var keyDown = {};
var winSize = { x: 1600, y: 900 };
var cameraPosition = { x: 0, y: 0 };
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
/** 게임 시작 시 작동하는 코드 */
function start() { }
