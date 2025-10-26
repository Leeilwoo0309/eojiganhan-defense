"use strict";
var shopDiv = document.querySelector("#shop-div");
var shopMain = document.querySelector(".shop-gapan");
var buyBtn = document.querySelector(".shop-buy-btn.real");
var passives = [];
var skills = [];
var selected = {
    passives: -1,
    skills: -1,
};
// 아이템 캐시 맵 (성능 최적화)
var passiveMap = new Map();
var skillMap = new Map();
// 아이템 맵 업데이트 함수 (passives/skills 배열이 변경될 때 호출)
function updateItemMaps() {
    passiveMap.clear();
    skillMap.clear();
    passives.forEach(function (p) { return passiveMap.set(p.id, p); });
    skills.forEach(function (s) { return skillMap.set(s.id, s); });
}
// ID로 아이템 조회 (O(1) 성능)
function getItemById(id, isPassive) {
    var _a, _b;
    return isPassive ? (_a = passiveMap.get(id)) !== null && _a !== void 0 ? _a : null : (_b = skillMap.get(id)) !== null && _b !== void 0 ? _b : null;
}
// 상점 카드 HTML 생성
function createShopCard(item) {
    return "\n        <div class=\"shop-card\" data-item-id=\"".concat(item.id, "\">\n            ").concat(item.des, "\n            <p class=\"shop-buy-btn\" id=\"pass-").concat(item.id, "\">\uBCF4\uAE30 (G").concat(item.cost, ")</p>\n        </div>\n    ");
}
// 상점 메인 렌더링
function renderShopMain(items, isPassive) {
    if (!(shopMain instanceof HTMLDivElement))
        return;
    var availableItems = items.filter(function (item) { return !item.isBought; });
    shopMain.innerHTML = availableItems.map(createShopCard).join("");
    // 이벤트 위임 사용 (이벤트 리스너 누수 방지)
    shopMain.onclick = function (e) {
        var card = e.target.closest(".shop-card");
        if (!card)
            return;
        var itemId = parseInt(card.getAttribute("data-item-id") || "-1");
        if (isPassive) {
            selected.passives = itemId;
        }
        else {
            selected.skills = itemId;
        }
        shopCardUpdate();
    };
}
// 상점 시작
function shopStart() {
    if (!(shopDiv instanceof HTMLDivElement))
        return;
    if (!isShopOpen) {
        shopDiv.style.display = "none";
        return;
    }
    // 맵 업데이트 (매번 최신 데이터 반영)
    updateItemMaps();
    shopDiv.style.display = "";
    var isPassive = shopKind === "passive";
    // 타이틀 설정
    shopDiv.children[0].innerHTML = isPassive
        ? "어지간한 상점 - 패시브 상점"
        : "\uC5B4\uC9C0\uAC04\uD55C \uC0C1\uC810 - \uC2A4\uD0AC".concat(shopSkill, " \uC0C1\uC810");
    // 아이템 목록 렌더링
    renderShopMain(isPassive ? passives : skills, isPassive);
    shopCardUpdate();
}
// 상점 카드 설명 업데이트
function shopCardUpdate() {
    var description = document.querySelector("#shop-des");
    if (!(description instanceof HTMLDivElement))
        return;
    var isPassive = shopKind === "passive";
    var selectedId = isPassive ? selected.passives : selected.skills;
    if (selectedId < 0) {
        description.children[0].innerHTML = "";
        description.children[1].innerHTML = "".concat(isPassive ? "패시브" : "스킬", "\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");
        return;
    }
    var item = getItemById(selectedId, isPassive);
    if (!item) {
        console.error("\uC544\uC774\uD15C\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4: ID ".concat(selectedId));
        return;
    }
    description.children[0].innerHTML = item.infoDes;
    description.children[1].innerHTML = "\uAD6C\uB9E4 (G".concat(item.cost, ")");
}
// 상점 구매
function shopBuy() {
    var p = getPlayerById(ID);
    var isPassive = shopKind === "passive";
    var selectedId = isPassive ? selected.passives : selected.skills;
    if (selectedId < 0)
        return;
    var item = getItemById(selectedId, isPassive);
    if (!item || p.gold < item.cost)
        return;
    // 구매 처리
    item.isBought = true;
    p.gold -= item.cost;
    if (isPassive) {
        p.passives.push(item.id);
        selected.passives = -1;
    }
    else {
        p.skills[shopSkill - 1] = item.id;
        selected.skills = -1;
    }
    shopStart();
}
// 이벤트 리스너 초기화 (한 번만 실행)
buyBtn === null || buyBtn === void 0 ? void 0 : buyBtn.addEventListener("click", shopBuy);
