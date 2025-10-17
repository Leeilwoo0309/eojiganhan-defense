class Entity {
    public id: number = 0;
    // public nickname: string = "감자전";
    public selector: HTMLDivElement = document.createElement("div");
    public state: { hp: [number, number]; barrier: [number, number][] | undefined } = {
        hp: [100, 100], // [현재체력, 최대체력]
        barrier: [], // [[보호막의 크기, 남은 시간]]
    };
    public position: Position = { x: 0, y: 0 };
    public halfSize: number = 15;
    public stat: Stat = {
        ad: 20,
        attackSpeed: 1,
        criticalChance: 0,
        criticalDamage: 1.5,

        moveSpeed: 5,
        armor: 0,
        armorPercent: 0,
        hpRegeneration: 5,
        ccTimeDown: 0,
    };
    // public type: Type = "adc";
    public entityType: "monster" | "player" = "monster";

    private totalBarrier: number = 0;

    /**
     * 플레이어 클래스를 생성
     * @param id 플레이어의 아이디
     * @param typeParam player: 플레이어 / monster: 몬스터
     * @returns 이 클래스
     */
    constructor(id: number, typeParam: "player" | "monster") {
        this.id = id;
        this.entityType = typeParam;
        // this.nickname = nickname;
        this.selector = document.querySelector(`.${this.entityType}#p${id}`) as HTMLDivElement;

        this.selector.style.top = "0px";

        if (this.id === id) {
            this.selector.style.backgroundColor = "blue";
        }

        this.selector.innerHTML = `
                <div class="hp ${this.entityType}${this.id}">
                    <div class="hp-progress later ${this.entityType}${this.id}"></div>
                    <div class="hp-progress barrier ${this.entityType}${this.id}"></div>
                    <div class="hp-progress ${this.entityType}${this.id}"></div>
                </div>
                <div class="damage-print ${this.entityType}${this.id}">
                </div>
        `;

        return this;
    }

    /**
     * 플레이어 애니메이션(움직임, 크기)
     * @param id 변경할 플레이어의 id
     */
    public playerAnimations() {
        if (this.selector instanceof HTMLDivElement) {
            const x = this.position.x - cameraPosition.x - this.halfSize;
            const y = -this.position.y + cameraPosition.y - this.halfSize;

            this.selector.style.transform = `translate(${x}px, ${y}px)`;

            this.selector.style.height = `${this.halfSize * 2}px`;
            this.selector.style.width = `${this.halfSize * 2}px`;

            /**
             * 체력바 애니메이션
             */
            const hps: NodeListOf<HTMLDivElement> = document.querySelectorAll(
                `.${this.entityType}${this.id}.hp-progress`
            );

            hps.forEach((e) => {
                this.setTotalBarrier();

                // 기본 상태 (보호막 無)
                e.style.width = `${(this.state.hp[0] / this.state.hp[1]) * 100}%`;

                // 보호막 + 현재 체력 < 최대 체력일 때 보호막
                if (e.classList.contains("barrier"))
                    e.style.width = `${
                        ((this.state.hp[0] + this.totalBarrier) / this.state.hp[1]) * 100
                    }%`;

                // 보호막 + 현재 체력 > 최대 체력일 때 체력바와 보호막
                if (this.totalBarrier + this.state.hp[0] > this.state.hp[1]) {
                    e.style.width = `${
                        (this.state.hp[0] / (this.totalBarrier + this.state.hp[0])) * 100
                    }%`;

                    if (e.classList.contains("barrier")) e.style.width = `100%`;
                }
            });
        }
    }

    private setTotalBarrier() {
        this.totalBarrier = 0;

        if (this.state.barrier?.length)
            this.state.barrier.forEach((e) => {
                this.totalBarrier += e[0];
            });
    }
}
