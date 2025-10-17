class GameObject {
    public position: Position = { x: 0, y: 0 };
    public size: { height: number; width: number } = { height: 30, width: 30 };
    public canCollide: boolean = true;
    public objSelector: HTMLDivElement | null = null;
    public style: { color: string; isRound: boolean } = { color: "black", isRound: false };

    public updatePosition() {
        if (this.objSelector instanceof HTMLDivElement)
            this.objSelector.style.transform = `
                translate(
                    ${this.position.x - cameraPosition.x}px,
                    ${cameraPosition.y - this.position.y}px
                )
        `;
    }
}

class GameObjectBuilder {
    private obj: GameObject;

    constructor() {
        this.obj = new GameObject();
    }

    /**
     * 오브젝트의 좌표 입력
     * @param x x좌표
     * @param y y좌표
     * @returns 이 클래스
     */
    public setPosition(x: number, y: number): GameObjectBuilder {
        this.obj.position = { x: x, y: y };
        return this;
    }

    /**
     * 오브젝트의 크기 입력
     * @param height 높이
     * @param width 너비
     * @returns 이 클래스
     */
    public setSize(height: number, width: number): GameObjectBuilder {
        this.obj.size = { height: height, width: width };
        return this;
    }

    /**
     * 오브젝트의 스타일 입력
     * @param color 오브젝트의 색깔 입력 (그레디언트 가능)
     * @param isRound 오브젝트의 원형 여부
     * @returns 이 클래스
     */
    public setStyle(color: string, isRound: boolean): GameObjectBuilder {
        this.obj.style = { color: color, isRound: isRound };
        return this;
    }

    /**
     * 오브젝트 빌드하기
     * @param canCollide 플레이어가 통과할 수 있는가? (false: 불가능)
     * @returns GameObject
     */
    public build(canCollide: boolean): GameObject {
        this.obj.canCollide = canCollide;

        const game = document.querySelector("#objs");
        const newObject: HTMLDivElement = document.createElement("div");

        if (game instanceof HTMLDivElement) {
            newObject.style.height = `${this.obj.size.height}px`;
            newObject.style.width = `${this.obj.size.width}px`;

            newObject.style.left = `${this.obj.position.x - this.obj.size.width / 2}px`;
            newObject.style.top = `${-this.obj.position.y - this.obj.size.height / 2}px`;

            newObject.style.backgroundColor = this.obj.style.color;

            if (this.obj.style.isRound) newObject.style.borderRadius = "100%";

            game.appendChild(newObject);

            this.obj.objSelector = newObject;
        }

        return this.obj;
    }
}
