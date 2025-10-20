const shopDiv = document.querySelector("#shop-div");
const shopMain = document.querySelector(".shop-gapan");

const passives = [
    { id: 0, des: "어쩌고 저쩌고0", cost: 500, isBought: false },
    { id: 1, des: "어쩌고 저쩌고1", cost: 500, isBought: false },
    { id: 2, des: "어쩌고 저쩌고2", cost: 500, isBought: false },
    { id: 3, des: "어쩌고 저쩌고3", cost: 500, isBought: false },
    { id: 4, des: "어쩌고 저쩌고4", cost: 500, isBought: false },
    { id: 5, des: "어쩌고 저쩌고5", cost: 500, isBought: false },
    { id: 6, des: "어쩌고 저쩌고6", cost: 500, isBought: false },
];

const skills = [
    { id: 0, des: "어쩌고 저쩌고0", cost: 500, isBought: false },
    { id: 1, des: "어쩌고 저쩌고1", cost: 500, isBought: false },
    { id: 2, des: "어쩌고 저쩌고2", cost: 500, isBought: false },
    { id: 3, des: "어쩌고 저쩌고3", cost: 500, isBought: false },
    { id: 4, des: "어쩌고 저쩌고4", cost: 500, isBought: false },
    { id: 5, des: "어쩌고 저쩌고5", cost: 500, isBought: false },
    { id: 6, des: "어쩌고 저쩌고6", cost: 500, isBought: false },
];

let selected = {
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
                    shopMain.innerHTML = ``;

                    passives.forEach((e) => {
                        if (e.isBought) return;

                        shopMain.innerHTML += `
                        <div class="shop-card" id="card-${e.id}">
                            ${e.des}
                            <p class="shop-buy-btn" id="pass-${e.id}">보기 (G${e.cost})</p>
                        </div>
                    `;
                    });

                    document.querySelectorAll(`.shop-card`).forEach((e, i) => {
                        e.addEventListener("click", () => {
                            selected.passives = parseInt(e.id.split("-")[1]);
                            shopCardUpdate();
                        });
                    });
                }
            } else {
                shopDiv.children[0].innerHTML = `어지간한 상점 - 스킬${shopSkill} 상점`;

                if (shopMain instanceof HTMLDivElement) {
                    shopMain.innerHTML = ``;
                    skills.forEach((e) => {
                        if (e.isBought) return;
                        shopMain.innerHTML += `
                        <div class="shop-card" id="card-${e.id}">
                            ${e.des}
                            <p class="shop-buy-btn" id="pass-${e.id}">보기 (G${e.cost})</p>
                        </div>
                    `;
                    });

                    document.querySelectorAll(`.shop-card`).forEach((e, i) => {
                        e.addEventListener("click", () => {
                            selected.skills = parseInt(e.id.split("-")[1]);
                            shopCardUpdate();
                        });
                    });
                }
            }
            shopCardUpdate();
        } else {
            shopDiv.style.display = "none";
        }
    }
}

function shopCardUpdate() {
    const description = document.querySelector("#shop-des");

    if (description instanceof HTMLDivElement) {
        if (shopKind === "passive") {
            if (selected.passives < 0) {
                description.children[0].innerHTML = ``;
                description.children[1].innerHTML = `패시브를 선택해주세요.`;
            } else {
                description.children[0].innerHTML = `${passives[selected.passives].des}`;
                description.children[1].innerHTML = `구매 (G${passives[selected.passives].cost})`;
            }
        } else {
            if (selected.skills < 0) {
                description.children[0].innerHTML = ``;
                description.children[1].innerHTML = `스킬을 선택해주세요.`;
            } else {
                description.children[0].innerHTML = `${skills[selected.skills].des}`;
                description.children[1].innerHTML = `구매 (G${skills[selected.skills].cost})`;
            }
        }
    }
}

function shopBuy() {
    const p = getPlayerById(ID);
    if (shopKind === "passive") {
        if (selected.passives < 0) return;
        if (p.gold >= passives[selected.passives].cost) {
            passives[selected.passives].isBought = true;

            p.passives.push(passives[selected.passives].id);
            p.gold -= passives[selected.passives].cost;

            selected.passives = -1;
        }
    } else {
        if (selected.skills < 0) return;
        if (p.gold >= skills[selected.skills].cost) {
            skills[selected.skills].isBought = true;

            p.skills[shopSkill - 1] = skills[selected.skills].id;
            p.gold -= skills[selected.skills].cost;

            selected.skills = -1;
        }
    }

    shopStart();
}

const buyBtn = document.querySelector(".shop-buy-btn.real");

buyBtn?.addEventListener("click", () => {
    shopBuy();
});
