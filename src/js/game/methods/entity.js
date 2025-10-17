"use strict";
var Entity = /** @class */ (function () {
    /**
     * 플레이어 클래스를 생성
     * @param id 플레이어의 아이디
     * @param typeParam player: 플레이어 / monster: 몬스터
     * @returns 이 클래스
     */
    function Entity(id, typeParam) {
        this.id = 0;
        // public nickname: string = "감자전";
        this.selector = document.createElement("div");
        this.state = {
            hp: [100, 100], // [현재체력, 최대체력]
            barrier: [], // [[보호막의 크기, 남은 시간]]
        };
        this.position = { x: 0, y: 0 };
        this.halfSize = 15;
        this.stat = {
            ad: 20,
            attackSpeed: 1,
            criticalChance: 0,
            criticalDamage: 1.5,
            moveSpeed: 5,
            armor: 0,
            armorPercent: 0,
            hpRegeneration: 5,
            ccTimeDown: 0,
        };
        // public type: Type = "adc";
        this.entityType = "monster";
        this.totalBarrier = 0;
        this.id = id;
        this.entityType = typeParam;
        // this.nickname = nickname;
        this.selector = document.querySelector(".".concat(this.entityType, "#p").concat(id));
        this.selector.style.top = "0px";
        if (this.id === id) {
            this.selector.style.backgroundColor = "blue";
        }
        this.selector.innerHTML = "\n                <div class=\"hp ".concat(this.entityType).concat(this.id, "\">\n                    <div class=\"hp-progress later ").concat(this.entityType).concat(this.id, "\"></div>\n                    <div class=\"hp-progress barrier ").concat(this.entityType).concat(this.id, "\"></div>\n                    <div class=\"hp-progress ").concat(this.entityType).concat(this.id, "\"></div>\n                </div>\n                <div class=\"damage-print ").concat(this.entityType).concat(this.id, "\">\n                </div>\n        ");
        return this;
    }
    /**
     * 플레이어 애니메이션(움직임, 크기)
     * @param id 변경할 플레이어의 id
     */
    Entity.prototype.playerAnimations = function () {
        var _this = this;
        if (this.selector instanceof HTMLDivElement) {
            var x = this.position.x - cameraPosition.x - this.halfSize;
            var y = -this.position.y + cameraPosition.y - this.halfSize;
            this.selector.style.transform = "translate(".concat(x, "px, ").concat(y, "px)");
            this.selector.style.height = "".concat(this.halfSize * 2, "px");
            this.selector.style.width = "".concat(this.halfSize * 2, "px");
            /**
             * 체력바 애니메이션
             */
            var hps = document.querySelectorAll(".".concat(this.entityType).concat(this.id, ".hp-progress"));
            hps.forEach(function (e) {
                _this.setTotalBarrier();
                // 기본 상태 (보호막 無)
                e.style.width = "".concat((_this.state.hp[0] / _this.state.hp[1]) * 100, "%");
                // 보호막 + 현재 체력 < 최대 체력일 때 보호막
                if (e.classList.contains("barrier"))
                    e.style.width = "".concat(((_this.state.hp[0] + _this.totalBarrier) / _this.state.hp[1]) * 100, "%");
                // 보호막 + 현재 체력 > 최대 체력일 때 체력바와 보호막
                if (_this.totalBarrier + _this.state.hp[0] > _this.state.hp[1]) {
                    e.style.width = "".concat((_this.state.hp[0] / (_this.totalBarrier + _this.state.hp[0])) * 100, "%");
                    if (e.classList.contains("barrier"))
                        e.style.width = "100%";
                }
            });
        }
    };
    Entity.prototype.setTotalBarrier = function () {
        var _this = this;
        var _a;
        this.totalBarrier = 0;
        if ((_a = this.state.barrier) === null || _a === void 0 ? void 0 : _a.length)
            this.state.barrier.forEach(function (e) {
                _this.totalBarrier += e[0];
            });
    };
    return Entity;
}());
