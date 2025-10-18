"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var param = new URLSearchParams(window.location.search);
var ID = Number(param.get("id"));
var NICKNAME = param.get("nickname");
var BODY = document.body;
var centerDiv = document.querySelectorAll(".center");
var goldP = document.querySelector(".gold");
var player = [new PlayerClass(ID, NICKNAME)];
var monster = [];
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
function getClassData(className) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("http://kimchi-game.kro.kr:1975/class/".concat(className), {
                        method: "GET",
                    }).then(function (r) { return r.json(); })];
                case 1:
                    ret = _a.sent();
                    return [2 /*return*/, ret];
            }
        });
    });
}
/** 게임 시작 시 작동하는 코드 */
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var classData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getClassData("adc")];
                case 1:
                    classData = _a.sent();
                    getPlayerById(ID).stat = classData.stat;
                    getPlayerById(ID).state.hp = classData.state.hp;
                    return [2 /*return*/];
            }
        });
    });
}
start();
