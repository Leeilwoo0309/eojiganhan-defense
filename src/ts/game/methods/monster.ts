class Monster extends Entity {
    constructor(id: number) {
        super(id, "monster");

        this.selector.style.backgroundColor = "red";
    }
}
