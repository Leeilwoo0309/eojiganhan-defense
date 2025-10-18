const param = new URLSearchParams(window.location.search);

const ID: number = Number(param.get("id"));
const NICKNAME: string = param.get("nickname") as string;
const BODY = document.body;

const centerDiv: NodeListOf<HTMLDivElement> = document.querySelectorAll(".center");

let player: PlayerClass[] = [new PlayerClass(ID, NICKNAME)];
let monster: Monster[] = [new Monster(100)];
let projectiles: Projectile[] = [];

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

/** 게임 시작 시 작동하는 코드 */
function start() {}
