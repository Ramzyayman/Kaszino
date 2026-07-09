const calculateMultiplier = require("../utils/mines/calculateMultiplier");

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const activeGames = require("../utils/mines/activeGames");
const { addMoney, getUser } = require("../utils/economy");

module.exports = async (interaction) => {

    if (
        !interaction.customId.startsWith("mine_") &&
        interaction.customId !== "cashout"
    ) return;

    const game = activeGames.get(interaction.user.id);

    if (!game) {
        return interaction.reply({
            content: "❌ You don't have an active Mines game.",
            ephemeral: true
        });
    }

    if (interaction.message.id !== game.messageId) {
        return interaction.reply({
            content: "❌ This isn't your Mines game.",
            ephemeral: true
        });
    }

    // ==========================
    // Cash Out
    // ==========================

    if (interaction.customId === "cashout") {

        const winnings = Math.floor(game.bet * game.multiplier);

        addMoney(interaction.user.id, winnings);

        const balance = getUser(interaction.user.id).wallet;

        activeGames.delete(interaction.user.id);

        const rows = [];

        for (let row = 0; row < 4; row++) {

            const actionRow = new ActionRowBuilder();

            for (let col = 0; col < 5; col++) {

                const i = row * 5 + col;

                const button = new ButtonBuilder()
                    .setCustomId(`mine_${i}`)
                    .setLabel("\u200B")
                    .setDisabled(true);

                if (game.board[i] === "mine") {

                    button
                        .setEmoji("💣")
                        .setStyle(ButtonStyle.Danger);

                } else if (game.revealed.has(i)) {

                    button
                        .setEmoji("💎")
                        .setStyle(ButtonStyle.Success);

                } else {

                    button.setStyle(ButtonStyle.Secondary);

                }

                actionRow.addComponents(button);

            }

            rows.push(actionRow);

        }

        rows.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("cashout")
                    .setLabel("💰 Cashed Out")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true)
            )
        );

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🎉 Mines")
            .setDescription(
                `You successfully cashed out!\n\n` +
                `💵 **Won:** +$${winnings.toLocaleString()}\n` +
                `💰 **Current Balance:** $${balance.toLocaleString()}`
            );

        return interaction.update({
            embeds: [embed],
            components: rows
        });

    }

    // ==========================
    // Tile Click
    // ==========================

    const index = Number(interaction.customId.split("_")[1]);

    if (game.revealed.has(index))
        return interaction.deferUpdate();

    game.revealed.add(index);

    if (game.board[index] === "mine") {

        for (let i = 0; i < game.board.length; i++) {

            if (game.board[i] === "mine") {
                game.revealed.add(i);
            }

        }

        game.gameOver = true;

        activeGames.delete(interaction.user.id);

    } else {

        game.gemsFound++;

        game.multiplier = calculateMultiplier(
            game.mines,
            game.gemsFound
        );

    }

    const currentCashout = Math.floor(
        game.bet * game.multiplier
    );

    // ===== Build Board ====
    const rows = [];

for (let row = 0; row < 4; row++) {

    const actionRow = new ActionRowBuilder();

    for (let col = 0; col < 5; col++) {

        const i = row * 5 + col;

        const button = new ButtonBuilder()
            .setCustomId(`mine_${i}`)
            .setLabel("\u200B")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(game.gameOver === true || game.revealed.has(i));

        if (game.revealed.has(i)) {

            if (game.board[i] === "mine") {

                button
                    .setEmoji("💣")
                    .setStyle(ButtonStyle.Danger);

            } else {

                button
                    .setEmoji("💎")
                    .setStyle(ButtonStyle.Success);

            }

        }

        actionRow.addComponents(button);

    }

    rows.push(actionRow);

}

rows.push(
    new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("cashout")
            .setLabel(
                game.gameOver
                    ? "💥 Game Over"
                    : `💰 Cash Out ($${currentCashout.toLocaleString()})`
            )
            .setStyle(ButtonStyle.Success)
            .setDisabled(game.gameOver === true)
    )
);

let embed;

if (game.gameOver) {

    const balance = getUser(interaction.user.id).wallet;

    embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("💥 Mines")
        .setDescription(
            `You hit a mine!\n\n` +
            `💸 **Lost:** -$${game.bet.toLocaleString()}\n` +
            `💰 **Current Balance:** $${balance.toLocaleString()}`
        );

} else {

    embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("💎 Mines")
        .setDescription(
            `**Bet:** $${game.bet.toLocaleString()}\n` +
            `**Mines:** ${game.mines}\n\n` +
            `Click a tile to continue!`
        );

}

await interaction.update({
    embeds: [embed],
    components: rows
});

};