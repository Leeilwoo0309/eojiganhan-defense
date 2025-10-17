"use strict";
function generateMap() {
    var isOccupied = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    var map = new Array(25);
    setBiome(map, 1, isOccupied, "pollute");
    setBiome(map, 2, isOccupied, "mushroom");
    setBiome(map, 2, isOccupied, "lave");
    setBiome(map, 3, isOccupied, "rock");
    setBiome(map, 3, isOccupied, "snow");
    setBiome(map, 3, isOccupied, "jungle");
    setBiome(map, 3, isOccupied, "desert");
    setBiome(map, 3, isOccupied, "lake");
    setBiome(map, 5, isOccupied, "forest");
    return map;
}
function setBiome(map, count, isOccupied, biome) {
    for (var i = 0; i < count; i++) {
        var position = Math.floor(getRandomNumber(isOccupied.length - 1));
        map[isOccupied[position]] = biome;
        isOccupied.splice(position, 1);
    }
}
