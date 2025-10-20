"use strict";
var shopDiv = document.querySelector("#shop-div");
var shopMain = document.querySelector(".shop-gapan");
var passives = [
    { id: 0, des: "어쩌고 저쩌고0", cost: 500, isBought: false },
    { id: 1, des: "어쩌고 저쩌고1", cost: 500, isBought: false },
    { id: 2, des: "어쩌고 저쩌고2", cost: 500, isBought: false },
    { id: 3, des: "어쩌고 저쩌고3", cost: 500, isBought: false },
    { id: 4, des: "어쩌고 저쩌고4", cost: 500, isBought: false },
    { id: 5, des: "어쩌고 저쩌고5", cost: 500, isBought: false },
    { id: 6, des: "어쩌고 저쩌고6", cost: 500, isBought: false },
];
var skills = [
    { id: 0, des: "어쩌고 저쩌고0", cost: 500, isBought: false },
    { id: 1, des: "어쩌고 저쩌고1", cost: 500, isBought: false },
    { id: 2, des: "어쩌고 저쩌고2", cost: 500, isBought: false },
    { id: 3, des: "어쩌고 저쩌고3", cost: 500, isBought: false },
    { id: 4, des: "어쩌고 저쩌고4", cost: 500, isBought: false },
    { id: 5, des: "어쩌고 저쩌고5", cost: 500, isBought: false },
    { id: 6, des: "어쩌고 저쩌고6", cost: 500, isBought: false },
];
var selected = {
    passives: 0,
    skills: 0,
};
function shopStart() {
    if (shopDiv instanceof HTMLDivElement) {
        if (isShopOpen) {
            shopDiv.style.display = "";
            if (shopKind === "passive") {
                shopDiv.children[0].innerHTML = "어지간한 상점 - 패시브 상점";
                if (shopMain instanceof HTMLDivElement) {
                    shopMain.innerHTML = "";
                    passives.forEach(function (e) {
                        if (e.isBought)
                            return;
                        shopMain.innerHTML += "\n                        <div class=\"shop-card\" id=\"card-".concat(e.id, "\">\n                            ").concat(e.des, "\n                            <p class=\"shop-buy-btn\" id=\"pass-").concat(e.id, "\">\uBCF4\uAE30 (G").concat(e.cost, ")</p>\n                        </div>\n                    ");
                    });
                    document.querySelectorAll(".shop-card").forEach(function (e, i) {
                        e.addEventListener("click", function () {
                            selected.passives = parseInt(e.id.split("-")[1]);
                            shopCardUpdate();
                        });
                    });
                }
            }
            else {
                shopDiv.children[0].innerHTML = "\uC5B4\uC9C0\uAC04\uD55C \uC0C1\uC810 - \uC2A4\uD0AC".concat(shopSkill, " \uC0C1\uC810");
                if (shopMain instanceof HTMLDivElement) {
                    shopMain.innerHTML = "";
                    skills.forEach(function (e) {
                        if (e.isBought)
                            return;
                        shopMain.innerHTML += "\n                        <div class=\"shop-card\" id=\"card-".concat(e.id, "\">\n                            ").concat(e.des, "\n                            <p class=\"shop-buy-btn\" id=\"pass-").concat(e.id, "\">\uBCF4\uAE30 (G").concat(e.cost, ")</p>\n                        </div>\n                    ");
                    });
                    document.querySelectorAll(".shop-card").forEach(function (e, i) {
                        e.addEventListener("click", function () {
                            selected.skills = parseInt(e.id.split("-")[1]);
                            shopCardUpdate();
                        });
                    });
                }
            }
            shopCardUpdate();
        }
        else {
            shopDiv.style.display = "none";
        }
    }
}
function shopCardUpdate() {
    var description = document.querySelector("#shop-des");
    if (description instanceof HTMLDivElement) {
        if (shopKind === "passive") {
            if (selected.passives < 0) {
                description.children[0].innerHTML = "";
                description.children[1].innerHTML = "\uD328\uC2DC\uBE0C\uB97C \uC120\uD0DD\uD574\uC8FC\uC138\uC694.";
            }
            else {
                description.children[0].innerHTML = "".concat(passives[selected.passives].des);
                description.children[1].innerHTML = "\uAD6C\uB9E4 (G".concat(passives[selected.passives].cost, ")");
            }
        }
        else {
            if (selected.skills < 0) {
                description.children[0].innerHTML = "";
                description.children[1].innerHTML = "\uC2A4\uD0AC\uC744 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.";
            }
            else {
                description.children[0].innerHTML = "".concat(skills[selected.skills].des);
                description.children[1].innerHTML = "\uAD6C\uB9E4 (G".concat(skills[selected.skills].cost, ")");
            }
        }
    }
}
function shopBuy() {
    var p = getPlayerById(ID);
    if (shopKind === "passive") {
        if (selected.passives < 0)
            return;
        if (p.gold >= passives[selected.passives].cost) {
            passives[selected.passives].isBought = true;
            p.passives.push(passives[selected.passives].id);
            p.gold -= passives[selected.passives].cost;
            selected.passives = -1;
        }
    }
    else {
        if (selected.skills < 0)
            return;
        if (p.gold >= skills[selected.skills].cost) {
            skills[selected.skills].isBought = true;
            p.skills[shopSkill - 1] = skills[selected.skills].id;
            p.gold -= skills[selected.skills].cost;
            selected.skills = -1;
        }
    }
    shopStart();
}
var buyBtn = document.querySelector(".shop-buy-btn.real");
buyBtn === null || buyBtn === void 0 ? void 0 : buyBtn.addEventListener("click", function () {
    shopBuy();
});
