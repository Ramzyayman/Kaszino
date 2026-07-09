function generateBoard(mineCount) {

    const board = Array(20).fill("gem");

    let placed = 0;

    while (placed < mineCount) {

        const index = Math.floor(Math.random() * 20);

        if (board[index] === "mine") continue;

        board[index] = "mine";
        placed++;

    }

    return board;

}

module.exports = generateBoard;