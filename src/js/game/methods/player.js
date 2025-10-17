"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PlayerClass = /** @class */ (function (_super) {
    __extends(PlayerClass, _super);
    function PlayerClass(id, nickname) {
        var _this = _super.call(this, id, "player") || this;
        _this.nickname = "감자전";
        _this.gold = 0;
        _this.exp = 0;
        _this.level = 1;
        _this.nickname = nickname;
        _this.selector.innerHTML = "\n            <div class=\"info\">\n                <span id=\"nickname\">".concat(_this.nickname, "</span>\n            </div>\n\n            <div class=\"hp player").concat(_this.id, "\">\n                <div class=\"hp-progress later player").concat(_this.id, "\"></div>\n                <div class=\"hp-progress barrier player").concat(_this.id, "\"></div>\n                <div class=\"hp-progress player").concat(_this.id, "\"></div>\n            </div>\n            <div class=\"damage-print player").concat(_this.id, "\">\n            </div>\n        ");
        return _this;
    }
    return PlayerClass;
}(Entity));
/**
 * 플레이어의 움직임 총괄.
 */
function movePlayer() {
    var velocityVector = { x: 0, y: 0 };
    if (keyDown.w)
        velocityVector.y += player[ID].stat.moveSpeed;
    if (keyDown.a)
        velocityVector.x -= player[ID].stat.moveSpeed;
    if (keyDown.s)
        velocityVector.y -= player[ID].stat.moveSpeed;
    if (keyDown.d)
        velocityVector.x += player[ID].stat.moveSpeed;
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
