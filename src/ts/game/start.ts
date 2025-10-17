const ID = 0;
const BODY = document.body;

const centerDiv: NodeListOf<HTMLDivElement> = document.querySelectorAll(".center");

let player: PlayerClass[] = [new PlayerClass(0, "Vv지존새우vV")];
let keyDown: { [key in string]: boolean } = {};
let winSize: Position = { x: 1600, y: 900 };
let cameraPosition: Position = { x: 0, y: 0 };

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

/** 게임 시작 시 작동하는 코드 */
function start() {}
