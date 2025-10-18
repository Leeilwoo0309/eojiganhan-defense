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
        attackSpeed: 10,
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

        if (typeParam === "monster") {
            const newMonster = document.createElement("div");
            const monstersParent = document.querySelector(".monsters-div");

            newMonster.classList.add("monster");
            newMonster.id = `m${this.id}`;
            this.selector = newMonster;

            if (monstersParent instanceof HTMLDivElement) monstersParent.appendChild(newMonster);
        } else {
            this.selector = document.querySelector(`.${this.entityType}#p${id}`) as HTMLDivElement;
        }

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
    public entityAnimations() {
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

        // if (this.state.hp[0] <= 0) {
        //     this.death();
        // }
    }

    public getDamage(damage: number, type: DamageType, attakerId: number, isSent: boolean = false) {
        let finalDamage: number = damage;

        if (type === "melee") finalDamage *= 100 / (100 + this.stat.armor);
        if (type !== "true") finalDamage *= 1 - this.stat.armorPercent;

        if (ID !== this.id && this.entityType === "player" && !isSent) {
            sendToPlayers("DAMAGE", {
                damage: finalDamage,
                type: type,
                attakerId: attakerId,
                target: this.id,
            });
        }

        this.state.hp[0] -= finalDamage;

        //@ts-ignore
        const parent: HTMLDivElement = document.querySelector(
            `.damage-print.${this.entityType}${this.id}`
        );
        const alerter: HTMLDivElement = document.createElement("div");
        const textColor = {
            melee: "rgb(227, 106, 14)",
            magic: "rgb(14, 124, 227)",
            true: "white",
            heal: "rgb(0, 180, 0)",
        };
        const shadowColor = {
            melee: "rgba(148, 64, 0, 1)",
            magic: "rgba(0, 76, 147, 1)",
            true: "rgba(136, 136, 136, 1)",
            heal: "rgba(0, 106, 0, 1)",
        };

        if (Math.round(finalDamage) == 0) return;

        alerter.innerHTML = `${Math.round(finalDamage)}`;
        alerter.style.opacity = "100%";
        alerter.style.marginTop = `-${Math.random() * 20 + 40}px`;
        alerter.style.marginLeft = `${Math.random() * 50 - 20}px`;
        alerter.style.color = `${textColor[type]}`;
        alerter.style.fontSize = `${Math.log(finalDamage * 4) + 15}px`;
        alerter.style.transition = "opacity 300ms";
        alerter.style.position = "fixed ";
        alerter.style.textShadow = `0px 0px 2px ${shadowColor[type]}`;
        alerter.style.transform = "scale(1.7, 1.7)";

        parent.appendChild(alerter);

        setTimeout(() => {
            alerter.style.transition = "400 cubic-bezier(0, 0, 0, 0.97);";
            alerter.style.transform = "scale(1, 1)";
        }, 10);

        setTimeout(() => {
            alerter.style.opacity = "0%";
        }, 300);

        setTimeout(() => {
            alerter.style.display = "none";
        }, 600);

        if (this.state.hp[0] <= 0.5) {
            if (this.entityType === "monster") getPlayerById(attakerId).gold += 150;
            this.death();
        }
    }

    public death() {
        if (this.entityType === "monster") {
            document.querySelector(".monsters-div")?.removeChild(this.selector);
        } else if (this.entityType === "player") {
            this.selector.style.display = "none";
        }
    }

    public modify(json: PlayerClass) {
        this.id = json.id;
        this.entityType = json.entityType;
        this.halfSize = json.halfSize;
        this.position = json.position;
        this.stat = json.stat;
        this.state = json.state;

        if (this.entityType === "player") {
            this.selector = document.querySelector(`#p${this.id}`) as HTMLDivElement;
        }

        return this;
    }

    private setTotalBarrier() {
        this.totalBarrier = 0;

        if (this.state.barrier?.length)
            this.state.barrier.forEach((e) => {
                this.totalBarrier += e[0];
            });
    }
}
