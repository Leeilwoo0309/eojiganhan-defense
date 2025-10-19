"use strict";
var classPassives = {
    adc: [
        { id: 10, name: "빠른 공격", des: "공격 속도 10% 증가" },
        { id: 11, name: "치명 집중", des: "치명타 확률 5% 증가 및 치명타 피해량 7% 증가" },
        { id: 12, name: "실전에 강한 타입", des: "보스 및 준보스에게 입히는 피해량 7% 증가" },
    ],
    mage: [
        { id: 20, name: "더 넓은 공격", des: "광역 공격 범위 10% 증가" },
        { id: 21, name: "더 강한 공격", des: "광역 공격 피해량 4% 증가" },
        { id: 22, name: "연습에 강한 타입", des: "일반 몹에게 입히는 피해량 7% 증가" },
    ],
    tanker: [
        { id: 30, name: "돌맹이", des: "피해 감소 3% 증가" },
        { id: 31, name: "약물 중독자", des: "받는 회복량 8% 증가" },
        {
            id: 32,
            name: "공격형 탱커",
            des: "공격력 50%, 공격 속도 100% 증가 / 체력 50%, 방어력 30% 감소 ",
        },
    ],
    supporter: [
        { id: 40, name: "보호 집중", des: "주는 보호막 6% 증가" },
        { id: 41, name: "공격 집중", des: "아군에게 버프 시 공격력 3% 추가 제공" },
        { id: 42, name: "민생회복 소비쿠폰", des: "모든 아군이 얻는 경험치와 골드 5% 증가" },
    ],
};
var allPassives = [
    { id: 1000, name: "경력직 신입", des: "획득 경험치 8% 증가" },
    { id: 1001, name: "극한의 이득충", des: "획득 골드 8% 증가" },
    { id: 1002, name: "체력차 극복", des: "체력이 40% 이하인 몹 공격 시 피해량 8% 증가" },
    { id: 1003, name: "최후의 일격", des: "체력이 60% 이상인 몹 공격 시 피해량 8% 증가" },
    { id: 1004, name: "영혼 약탈자", des: "몹을 죽일 시 잃은 체력의 2% 회복" },
];
var idToClass = ["adc", "mage", "tanker", "supporter"];
var nowClass = -1;
var classBtn = document.querySelectorAll(".class-btn");
var classPassiveBtn = document.querySelectorAll(".class-passive-btn:not(.all)");
var allPassiveBtn = document.querySelectorAll(".all");
allPassiveBtn.forEach(function (e, i) {
    e.innerHTML = "\n            <h2>".concat(allPassives[i].name, "</h2>\n            <p>").concat(allPassives[i].des, "</p>\n        ");
});
classBtn.forEach(function (e, i) {
    e.addEventListener("click", function () {
        var _a;
        nowClass = i;
        (_a = document.querySelector(".selected")) === null || _a === void 0 ? void 0 : _a.classList.remove("selected");
        e.classList.add("selected");
        refreshInfo();
    });
});
function refreshInfo() {
    classPassiveBtn.forEach(function (e, i) {
        e.innerHTML = "\n            <h2>".concat(classPassives[idToClass[nowClass]][i].name, "</h2>\n            <p>").concat(classPassives[idToClass[nowClass]][i].des, "</p>\n        ");
    });
}
