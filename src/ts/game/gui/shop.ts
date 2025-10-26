const shopDiv = document.querySelector("#shop-div");
const shopMain = document.querySelector(".shop-gapan");
const buyBtn = document.querySelector(".shop-buy-btn.real");

let passives: Passive[] = [];
let skills: Passive[] = [];

let selected = {
    passives: -1,
    skills: -1,
};

// 아이템 캐시 맵 (성능 최적화)
const passiveMap = new Map<number, Passive>();
const skillMap = new Map<number, Passive>();

// 아이템 맵 업데이트 함수 (passives/skills 배열이 변경될 때 호출)
function updateItemMaps() {
    passiveMap.clear();
    skillMap.clear();
    passives.forEach((p) => passiveMap.set(p.id, p));
    skills.forEach((s) => skillMap.set(s.id, s));
}

// ID로 아이템 조회 (O(1) 성능)
function getItemById(id: number, isPassive: boolean): Passive | null {
    return isPassive ? passiveMap.get(id) ?? null : skillMap.get(id) ?? null;
}

// 상점 카드 HTML 생성
function createShopCard(item: Passive): string {
    return `
        <div class="shop-card" data-item-id="${item.id}">
            ${item.des}
            <p class="shop-buy-btn" id="pass-${item.id}">보기 (G${item.cost})</p>
        </div>
    `;
}

// 상점 메인 렌더링
function renderShopMain(items: Passive[], isPassive: boolean) {
    if (!(shopMain instanceof HTMLDivElement)) return;

    const availableItems = items.filter((item) => !item.isBought);
    shopMain.innerHTML = availableItems.map(createShopCard).join("");

    // 이벤트 위임 사용 (이벤트 리스너 누수 방지)
    shopMain.onclick = (e) => {
        const card = (e.target as HTMLElement).closest(".shop-card");
        if (!card) return;

        const itemId = parseInt(card.getAttribute("data-item-id") || "-1");
        if (isPassive) {
            selected.passives = itemId;
        } else {
            selected.skills = itemId;
        }
        shopCardUpdate();
    };
}

// 상점 시작
function shopStart() {
    if (!(shopDiv instanceof HTMLDivElement)) return;

    if (!isShopOpen) {
        shopDiv.style.display = "none";
        return;
    }

    // 맵 업데이트 (매번 최신 데이터 반영)
    updateItemMaps();

    shopDiv.style.display = "";
    const isPassive = shopKind === "passive";

    // 타이틀 설정
    shopDiv.children[0].innerHTML = isPassive
        ? "어지간한 상점 - 패시브 상점"
        : `어지간한 상점 - 스킬${shopSkill} 상점`;

    // 아이템 목록 렌더링
    renderShopMain(isPassive ? passives : skills, isPassive);
    shopCardUpdate();
}

// 상점 카드 설명 업데이트
function shopCardUpdate() {
    const description = document.querySelector("#shop-des");
    if (!(description instanceof HTMLDivElement)) return;

    const isPassive = shopKind === "passive";
    const selectedId = isPassive ? selected.passives : selected.skills;

    if (selectedId < 0) {
        description.children[0].innerHTML = "";
        description.children[1].innerHTML = `${isPassive ? "패시브" : "스킬"}를 선택해주세요.`;
        return;
    }

    const item = getItemById(selectedId, isPassive);
    if (!item) {
        console.error(`아이템을 찾을 수 없습니다: ID ${selectedId}`);
        return;
    }

    description.children[0].innerHTML = item.infoDes;
    description.children[1].innerHTML = `구매 (G${item.cost})`;
}

// 상점 구매
function shopBuy() {
    const p = getPlayerById(ID);
    const isPassive = shopKind === "passive";
    const selectedId = isPassive ? selected.passives : selected.skills;

    if (selectedId < 0) return;

    const item = getItemById(selectedId, isPassive);
    if (!item || p.gold < item.cost) return;

    // 구매 처리
    item.isBought = true;
    p.gold -= item.cost;

    if (isPassive) {
        p.passives.push(item.id);
        selected.passives = -1;
    } else {
        p.skills[shopSkill - 1] = item.id;
        selected.skills = -1;
    }

    shopStart();
}

// 이벤트 리스너 초기화 (한 번만 실행)
buyBtn?.addEventListener("click", shopBuy);
