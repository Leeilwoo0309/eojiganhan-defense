type Player = {
    id: number;
    nickname: string;
    selector: HTMLDivElement | null;
    state: {
        hp: [number, number]; // 최대체력, 현재체력
        barrier: [[number, number][]?];
    };
    position: { x: number; y: number };
    halfSize: number;
    stat: Stat;
};

type Stat = {
    ad: number;
    attackSpeed: number;
    criticalChance: number;
    criticalDamage: number;

    moveSpeed: number;
    armor: number;
    armorPercent: number;
    hpRegeneration: number;
    ccTimeDown: number;
};

type StatWithQuestionMark = {
    ad?: number;
    attackSpeed?: number;
    criticalChance?: number;
    criticalDamage?: number;

    moveSpeed?: number;
    armor?: number;
    armorPercent?: number;
    hpRegeneration?: number;
    ccTimeDown?: number;
};

type Position = { x: number; y: number };
type PlayerClassNames = "adc" | "mage" | "tanker" | "supporter";
type DamageType = "melee" | "magic" | "true";

type Passive = {
    id: number;
    des: string;
    infoDes: string;
    cost: number;
    isBought: boolean;
    effect: StatWithQuestionMark;
};
