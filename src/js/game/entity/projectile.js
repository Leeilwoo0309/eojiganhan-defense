"use strict";
var Projectile = /** @class */ (function () {
    function Projectile() {
        this.projectileINIT = {
            angle: 0,
            speed: 15,
            reach: -1,
            isArrive: true, // 최종 지점까지 도달했는가
            isSent: false, // socket을 통해 보내졌는가
            isCollide: false, // 엔티티에게 부딪힌 적이 있는가
            isIgnoreObj: false,
            isCanPass: false, // 관통 가능한가
            tag: "", // 태그
            target: [false, undefined, "player"], // 타겟 [여부, 대상, 종류]
            id: ID, // 발사자
            damageType: "melee",
        };
        this.projectileHit = {
            damage: 0,
            critical: [0, 0],
        };
        this.positionSize = {
            x: 0,
            y: 0,
            width: 10,
            height: 10,
        };
        this.style = {
            color: "red",
            opacity: 100,
        };
        this.whoType = "player";
        this._movedDistance = 0;
    }
    Projectile.prototype.start = function (type) {
        var _this = this;
        this.whoType = type;
        var _main = document.querySelector(".projectiles");
        var _projectile = document.createElement("div");
        _projectile.className = "".concat(this.whoType, " projectile");
        _projectile.style.width = "".concat(this.positionSize.width, "px");
        _projectile.style.height = "".concat(this.positionSize.height, "px");
        _projectile.style.rotate = "".concat(-this.projectileINIT.angle + Math.PI / 2, "rad");
        _projectile.style.left = "".concat(this.positionSize.x - cameraPosition.x - this.positionSize.width / 2, "px");
        _projectile.style.top = "".concat(-this.positionSize.y + cameraPosition.y - this.positionSize.height / 2, "px");
        // 투사체 스타일 결정
        if (this.style.color !== undefined)
            _projectile.style.backgroundColor = "".concat(this.style.color);
        if (this.style.opacity !== undefined)
            _projectile.style.opacity = "".concat(this.style.opacity, "%");
        if (_main instanceof HTMLDivElement) {
            _main.appendChild(_projectile);
        }
        var update = function () {
            _this._movedDistance += _this.projectileINIT.speed;
            if (_this.projectileINIT.isTarget) {
                // this.projectileINIT.angle = Math.atan2(
                //     players[enemyTeam][target].position.y - this.positionSize.y,
                //     players[enemyTeam][target].position.x - this.positionSize.x
                // );
                // this.positionSize.x +=
                //     this.projectileINIT.speed * Math.cos(this.projectileINIT.angle);
                // this.positionSize.y +=
                //     this.projectileINIT.speed * Math.sin(this.projectileINIT.angle);
            }
            else {
                _this.positionSize.x +=
                    -_this.projectileINIT.speed * Math.cos(_this.projectileINIT.angle);
                _this.positionSize.y +=
                    -_this.projectileINIT.speed * Math.sin(_this.projectileINIT.angle);
            }
            _projectile.style.left = "".concat(_this.positionSize.x - cameraPosition.x - _this.positionSize.width / 2, "px");
            _projectile.style.top = "".concat(-_this.positionSize.y + cameraPosition.y - _this.positionSize.height / 2, "px");
            if (_this.projectileHit.damage > 0) {
                monster.forEach(function (e) {
                    if (_this.isCollideWithPlayer2(_projectile, e.id) &&
                        !_this.projectileINIT.isCollide) {
                        _this.projectileINIT.isCollide = true;
                        e.getDamage(_this.projectileHit.damage, _this.projectileINIT.damageType, _this.projectileINIT.id);
                        if (!_this.projectileINIT.isCanPass)
                            _this.projectileINIT.isArrive = false;
                    }
                });
            }
            // 화면 밖으로 나가면 탄환 제거
            if (!_this.projectileINIT.isIgnoreObj) {
                if (Math.abs(_this.positionSize.x) > 1200 || Math.abs(_this.positionSize.y) > 1200) {
                    _this.projectileINIT.isArrive = false;
                }
            }
            if (_this._movedDistance >= _this.projectileINIT.reach * 1.5 &&
                _this.projectileINIT.isArrive) {
                _this.projectileINIT.isArrive = false;
            }
            if (!_this.projectileINIT.isArrive) {
                // clearInterval(update);
                if (_main instanceof HTMLDivElement)
                    _main.removeChild(_projectile);
                return;
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
    Projectile.prototype.isCollideWithPlayer2 = function (projectileSelector, id) {
        var rect1 = getMonsterById(id).selector.getBoundingClientRect();
        var rect2 = projectileSelector.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    };
    Projectile.prototype.modify = function (json) {
        this.positionSize = json.positionSize;
        this.projectileHit = json.projectileHit;
        this.projectileINIT = json.projectileINIT;
        this.style = json.style;
        this.start(json.whoType);
        return this;
    };
    return Projectile;
}());
var ProjectileBuilder = /** @class */ (function () {
    function ProjectileBuilder() {
        this.projectile = new Projectile();
    }
    ProjectileBuilder.prototype.setInfo = function (info) {
        var _a, _b, _c, _d, _e;
        this.projectile.projectileINIT = {
            angle: info.angle,
            isArrive: (_a = info === null || info === void 0 ? void 0 : info.isArrive) !== null && _a !== void 0 ? _a : true,
            isCanPass: (_b = info === null || info === void 0 ? void 0 : info.isCanPass) !== null && _b !== void 0 ? _b : false,
            isCollide: (_c = info === null || info === void 0 ? void 0 : info.isCollide) !== null && _c !== void 0 ? _c : false,
            isIgnoreObj: (_d = info === null || info === void 0 ? void 0 : info.isIgnoreObj) !== null && _d !== void 0 ? _d : false,
            isSent: false,
            reach: info.reach,
            speed: info.speed,
            tag: info.tag,
            target: (_e = info === null || info === void 0 ? void 0 : info.target) !== null && _e !== void 0 ? _e : [false, undefined, "monster"],
            id: info.id,
            isTarget: info.isTarget,
            damageType: info.damageType,
        };
        return this;
    };
    ProjectileBuilder.prototype.setHitInfo = function (hitInfo) {
        this.projectile.projectileHit = {
            critical: hitInfo.critical,
            damage: hitInfo.damage,
        };
        return this;
    };
    ProjectileBuilder.prototype.setPositionSize = function (x, y, height, width) {
        this.projectile.positionSize.x = x;
        this.projectile.positionSize.y = y;
        this.projectile.positionSize.height = height;
        this.projectile.positionSize.width = width;
        return this;
    };
    ProjectileBuilder.prototype.setStyle = function (style) {
        this.projectile.style.color = style === null || style === void 0 ? void 0 : style.color;
        this.projectile.style.opacity = style === null || style === void 0 ? void 0 : style.opacity;
        return this;
    };
    ProjectileBuilder.prototype.build = function (type) {
        this.projectile.start(type);
        return this.projectile;
    };
    return ProjectileBuilder;
}());
