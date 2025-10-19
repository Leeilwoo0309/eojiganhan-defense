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
            attackSpeed: 10,
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
        if (typeParam === "monster") {
            var newMonster = document.createElement("div");
            var monstersParent = document.querySelector(".monsters-div");
            newMonster.classList.add("monster");
            newMonster.id = "m".concat(this.id);
            this.selector = newMonster;
            if (monstersParent instanceof HTMLDivElement)
                monstersParent.appendChild(newMonster);
        }
        else {
            this.selector = document.querySelector(".".concat(this.entityType, "#p").concat(id));
        }
        this.selector.style.top = "0px";
        if (this.id === ID) {
            this.selector.style.backgroundColor = "blue";
        }
        this.selector.innerHTML = "\n                <div class=\"hp ".concat(this.entityType).concat(this.id, "\">\n                    <div class=\"hp-progress later ").concat(this.entityType).concat(this.id, "\"></div>\n                    <div class=\"hp-progress barrier ").concat(this.entityType).concat(this.id, "\"></div>\n                    <div class=\"hp-progress ").concat(this.entityType).concat(this.id, "\"></div>\n                </div>\n                <div class=\"damage-print ").concat(this.entityType).concat(this.id, "\">\n                </div>\n        ");
        return this;
    }
    /**
     * 플레이어 애니메이션(움직임, 크기)
     * @param id 변경할 플레이어의 id
     */
    Entity.prototype.entityAnimations = function () {
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
        if (this.state.hp[0] <= 0 && this.entityType === "player") {
            this.death();
        }
    };
    Entity.prototype.getDamage = function (damage, type, attakerId, isSent) {
        if (isSent === void 0) { isSent = false; }
        var finalDamage = damage;
        if (type === "melee")
            finalDamage *= 100 / (100 + this.stat.armor);
        if (type !== "true")
            finalDamage *= 1 - this.stat.armorPercent;
        finalDamage = Math.floor(finalDamage);
        if (ID !== this.id && this.entityType === "player" && !isSent) {
            sendToPlayers("DAMAGE", {
                damage: finalDamage,
                type: type,
                attakerId: attakerId,
                target: this.id,
            });
        }
        this.state.hp[0] -= finalDamage;
        //@ts-ignore
        var parent = document.querySelector(".damage-print.".concat(this.entityType).concat(this.id));
        var alerter = document.createElement("div");
        var textColor = {
            melee: "rgb(227, 106, 14)",
            magic: "rgb(14, 124, 227)",
            true: "white",
            heal: "rgb(0, 180, 0)",
        };
        var shadowColor = {
            melee: "rgba(148, 64, 0, 1)",
            magic: "rgba(0, 76, 147, 1)",
            true: "rgba(136, 136, 136, 1)",
            heal: "rgba(0, 106, 0, 1)",
        };
        if (Math.round(finalDamage) == 0)
            return;
        alerter.innerHTML = "".concat(Math.round(finalDamage));
        alerter.style.opacity = "100%";
        alerter.style.marginTop = "-".concat(Math.random() * 20 + 40, "px");
        alerter.style.marginLeft = "".concat(Math.random() * 50 - 20, "px");
        alerter.style.color = "".concat(textColor[type]);
        alerter.style.fontSize = "".concat(Math.log(finalDamage * 4) + 15, "px");
        alerter.style.transition = "opacity 300ms";
        alerter.style.position = "fixed ";
        alerter.style.textShadow = "0px 0px 2px ".concat(shadowColor[type]);
        alerter.style.transform = "scale(1.7, 1.7)";
        parent.appendChild(alerter);
        setTimeout(function () {
            alerter.style.transition = "400 cubic-bezier(0, 0, 0, 0.97);";
            alerter.style.transform = "scale(1, 1)";
        }, 10);
        setTimeout(function () {
            alerter.style.opacity = "0%";
        }, 300);
        setTimeout(function () {
            alerter.style.display = "none";
        }, 600);
        if (this.state.hp[0] <= 0.5) {
            if (this.entityType === "monster") {
                getPlayerById(attakerId).gold += 7;
                getPlayerById(attakerId).exp[1] += 10;
                player[ID].gold += 10;
                player[ID].exp[1] += 5;
                leftMobs -= 1;
            }
            this.death();
        }
    };
    Entity.prototype.death = function () {
        var _a;
        if (this.entityType === "monster") {
            (_a = document.querySelector(".monsters-div")) === null || _a === void 0 ? void 0 : _a.removeChild(this.selector);
        }
        else if (this.entityType === "player") {
            this.selector.style.display = "none";
        }
    };
    Entity.prototype.modify = function (json) {
        this.id = json.id;
        this.entityType = json.entityType;
        this.halfSize = json.halfSize;
        this.position = json.position;
        this.stat = json.stat;
        this.state = json.state;
        if (this.entityType === "player") {
            this.selector = document.querySelector("#p".concat(this.id));
        }
        return this;
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
