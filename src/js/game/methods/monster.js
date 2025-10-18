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
var Monster = /** @class */ (function (_super) {
    __extends(Monster, _super);
    function Monster(id) {
        var _this = _super.call(this, id, "monster") || this;
        _this.isSent = false;
        _this.atkWait = 0;
        _this.selector.style.backgroundColor = "red";
        _this.stat.moveSpeed = 3;
        return _this;
    }
    Monster.prototype.setPosition = function (pos) {
        this.position = pos;
        return this;
    };
    Monster.prototype.setHpArmor = function (hp, armor) {
        this.state.hp = hp;
        this.stat.armor = armor;
        return this;
    };
    Monster.prototype.chaseTarget = function () {
        var _this = this;
        var min = 1000000;
        var target = 5;
        player.forEach(function (e) {
            if (min > e.getDistance(_this.position) && e.state.hp[0] > 0) {
                min = e.getDistance(_this.position);
                target = e.id;
            }
        });
        if (target === 5)
            return;
        var targetPlayer = getPlayerById(target);
        var angle = Math.atan2(targetPlayer.position.y - this.position.y, targetPlayer.position.x - this.position.x);
        if (targetPlayer.halfSize * 2 < targetPlayer.getDistance(this.position)) {
            this.position.x += this.stat.moveSpeed * Math.cos(angle);
            this.position.y += this.stat.moveSpeed * Math.sin(angle);
        }
        else {
            if (this.atkWait === 0) {
                targetPlayer.getDamage(this.stat.ad, "melee", this.id);
                this.atkWait = 32;
            }
            else
                this.atkWait -= 1;
        }
    };
    return Monster;
}(Entity));
