"use strict";
var GameObject = /** @class */ (function () {
    function GameObject() {
        this.position = { x: 0, y: 0 };
        this.size = { height: 30, width: 30 };
        this.canCollide = true;
        this.objSelector = null;
        this.style = { color: "black", isRound: false };
    }
    GameObject.prototype.updatePosition = function () {
        if (this.objSelector instanceof HTMLDivElement)
            this.objSelector.style.transform = "\n                translate(\n                    ".concat(this.position.x - cameraPosition.x, "px,\n                    ").concat(cameraPosition.y - this.position.y, "px\n                )\n        ");
    };
    return GameObject;
}());
var GameObjectBuilder = /** @class */ (function () {
    function GameObjectBuilder() {
        this.obj = new GameObject();
    }
    /**
     * 오브젝트의 좌표 입력
     * @param x x좌표
     * @param y y좌표
     * @returns 이 클래스
     */
    GameObjectBuilder.prototype.setPosition = function (x, y) {
        this.obj.position = { x: x, y: y };
        return this;
    };
    /**
     * 오브젝트의 크기 입력
     * @param height 높이
     * @param width 너비
     * @returns 이 클래스
     */
    GameObjectBuilder.prototype.setSize = function (height, width) {
        this.obj.size = { height: height, width: width };
        return this;
    };
    /**
     * 오브젝트의 스타일 입력
     * @param color 오브젝트의 색깔 입력 (그레디언트 가능)
     * @param isRound 오브젝트의 원형 여부
     * @returns 이 클래스
     */
    GameObjectBuilder.prototype.setStyle = function (color, isRound) {
        this.obj.style = { color: color, isRound: isRound };
        return this;
    };
    /**
     * 오브젝트 빌드하기
     * @param canCollide 플레이어가 통과할 수 있는가? (false: 불가능)
     * @returns GameObject
     */
    GameObjectBuilder.prototype.build = function (canCollide) {
        this.obj.canCollide = canCollide;
        var game = document.querySelector("#objs");
        var newObject = document.createElement("div");
        if (game instanceof HTMLDivElement) {
            newObject.style.height = "".concat(this.obj.size.height, "px");
            newObject.style.width = "".concat(this.obj.size.width, "px");
            newObject.style.left = "".concat(this.obj.position.x - this.obj.size.width / 2, "px");
            newObject.style.top = "".concat(-this.obj.position.y - this.obj.size.height / 2, "px");
            newObject.style.backgroundColor = this.obj.style.color;
            if (this.obj.style.isRound)
                newObject.style.borderRadius = "100%";
            game.appendChild(newObject);
            this.obj.objSelector = newObject;
        }
        return this.obj;
    };
    return GameObjectBuilder;
}());
