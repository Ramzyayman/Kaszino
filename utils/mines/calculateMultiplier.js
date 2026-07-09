function factorial(n) {
    let result = 1;

    for (let i = 2; i <= n; i++) {
        result *= i;
    }

    return result;
}

function combination(n, r) {
    return factorial(n) / (factorial(r) * factorial(n - r));
}

function calculateMultiplier(mines, gemsFound) {

    const TOTAL_TILES = 20;
    const HOUSE_EDGE = 0.98; // 2% house edge

    const safeTiles = TOTAL_TILES - mines;

    const multiplier =
        HOUSE_EDGE *
        (
            combination(TOTAL_TILES, gemsFound) /
            combination(safeTiles, gemsFound)
        );

    return Number(multiplier.toFixed(2));
}

module.exports = calculateMultiplier;