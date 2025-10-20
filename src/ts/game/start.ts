const param = new URLSearchParams(window.location.search);

const ID: number = Number(param.get("id"));
const NICKNAME: string = param.get("nickname") as string;
const CLASS_NAME: PlayerClassNames = param.get("class") as PlayerClassNames;
const RUNES: number[] = JSON.parse(param.get("runes") as string);
const BODY = document.body;

const centerDiv: NodeListOf<HTMLDivElement> = document.querySelectorAll(".center");
const center2Div: NodeListOf<HTMLDivElement> = document.querySelectorAll(".center2");
const goldP = document.querySelector(".gold");
const nicknameP = document.querySelector(".nickname");
const hpBarProgress = document.querySelector(".hp-gui-bar");
const levelBarProgress = document.querySelector(".level-gui-bar");
const waveText = document.querySelector(".title");
const leftMobText = document.querySelector(".small");

let player: PlayerClass[] = [new PlayerClass(ID, NICKNAME, CLASS_NAME, RUNES)];
let monster: Monster[] = [];
let projectiles: Projectile[] = [];
let wave: number = 1;
let leftMobs: number = 10;
let monsterId: number = 101;
let waveTermTime: number = 0;
const needExp: number[] = [12345, 1234, 1234, 1234, 1234, 1234];

let isShopOpen: boolean = false;
let shopKind: "passive" | "skill" = "passive";
let shopSkill: number = 0;

let keyDown: { [key in string]: boolean } = {};
let mouseDown: [boolean, boolean, boolean] = [false, false, false];
let winSize: Position = { x: 1600, y: 900 };
let cameraPosition: Position = { x: 0, y: 0 };
let mousePosition: Position = { x: 0, y: 0 };

let objects: GameObject[] = [
    new GameObjectBuilder()
        .setPosition(-1200, 0)
        .setSize(5000, 2500)
        .setStyle("gray", false)
        .build(true),
    new GameObjectBuilder()
        .setPosition(1200, 0)
        .setSize(5000, 2500)
        .setStyle("gray", false)
        .build(true),
    new GameObjectBuilder()
        .setPosition(0, 1200)
        .setSize(2500, 2500)
        .setStyle("gray", false)
        .build(true),
    new GameObjectBuilder()
        .setPosition(0, -1200)
        .setSize(2500, 2500)
        .setStyle("gray", false)
        .build(true),
];

/*****************************************************************************************/
/* ^^ 변수 선언 ^^ ||| vv start 부분 vv*/
/*****************************************************************************************/

document.body.addEventListener("keydown", (e) => {
    let key = e.key.toLowerCase();

    if (key === " ") key = "space";
    if (key === "p" || key === "l" || key === ";") {
        if (!isShopOpen) isShopOpen = true;
        else if (isShopOpen)
            if (shopKind === "passive" && key === "p") isShopOpen = false;
            else if (shopKind === "skill") {
                if (shopSkill === 1 && key === "l") isShopOpen = false;
                else if (shopSkill === 2 && key === ";") isShopOpen = false;
            }

        if (key === "p") shopKind = "passive";
        else shopKind = "skill";

        if (key === "l") shopSkill = 1;
        else if (key === ";") shopSkill = 2;

        shopStart();
    }
    keyDown[key] = true;
});

document.body.addEventListener("keyup", (e) => {
    let key = e.key.toLowerCase();

    if (key === " ") key = "space";
    keyDown[key] = false;
});

BODY.style.width = "17000px";
BODY.style.height = "17000px";

// 마우스 위치 구함
BODY.addEventListener("mousemove", (e) => {
    mousePosition.x = e.clientX + cameraPosition.x;
    mousePosition.y = -e.clientY + cameraPosition.y;
});

BODY.addEventListener("mousedown", (e) => {
    mouseDown[e.button] = true;
});

BODY.addEventListener("mouseup", (e) => {
    mouseDown[e.button] = false;
});

async function getClassData(className: string) {
    let ret = await fetch(`http://kimchi-game.kro.kr:1975/class/${className}`, {
        method: "GET",
    }).then((r) => r.json());

    return ret;
}

/** 게임 시작 시 작동하는 코드 */
async function start() {
    const classData = await getClassData(CLASS_NAME);

    getPlayerById(ID).stat = classData.stat;
    getPlayerById(ID).state.hp = classData.state.hp;

    if (ID === 0) {
        waveFinish();

        wave = 1;
    }
}

start();
