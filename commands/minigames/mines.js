const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const { getUser, removeMoney } = require("../../utils/economy");
const generateBoard = require("../../utils/mines/generateBoard");
const activeGames = require("../../utils/mines/activeGames");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mines")
        .setDescription("Play a game of Mines.")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Amount to bet")
                .setRequired(true)
                .setMinValue(1)
        )
        .addIntegerOption(option =>
            option
                .setName("mines")
                .setDescription("Number of mines")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(19)
        ),

    async execute(interaction) {

        const amount = interaction.options.getInteger("amount");
        const mineCount = interaction.options.getInteger("mines");

        const user = getUser(interaction.user.id);

        if (user.wallet < amount) {
            return interaction.reply({
                content: "❌ You don't have enough money."
            });
        }

        if (activeGames.has(interaction.user.id)) {
            return interaction.reply({
                content: "❌ You already have an active Mines game."
            });
        }

        // Take the player's bet
        removeMoney(interaction.user.id, amount);

        // Generate a new board
        const board = generateBoard(mineCount);

        // ========================================
// OWNER DEBUG BOARD
// ========================================

if (interaction.user.id === process.env.OWNER_IDS) {

    console.log("\n========== MINES DEBUG ==========\n");

    console.log("         C1      C2      C3      C4      C5");
    console.log("      -----------------------------------------");

    for (let row = 0; row < 4; row++) {

        let line = `R${row + 1} | `;

        for (let col = 0; col < 5; col++) {

            const index = row * 5 + col;

            const tile = board[index] === "mine"
                ? `M(${index.toString().padStart(2, "0")})`
                : `G(${index.toString().padStart(2, "0")})`;

            line += tile.padEnd(8);

        }

        console.log(line);

    }

    console.log("\nLegend:");
    console.log("G = Gem");
    console.log("M = Mine");

    console.log("\n=================================\n");

}
/////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

        // Save the game
        activeGames.set(interaction.user.id, {
            userId: interaction.user.id,
            bet: amount,
            mines: mineCount,
            board,
            revealed: new Set(),
            gemsFound: 0,
            multiplier: 1,
            messageId: null
        });

        // Build the 4x5 board
        const rows = [];

        for (let row = 0; row < 4; row++) {

            const actionRow = new ActionRowBuilder();

            for (let col = 0; col < 5; col++) {

                const index = row * 5 + col;

                actionRow.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`mine_${index}`)
                        .setLabel("\u200B")
                        .setStyle(ButtonStyle.Secondary)
                );

            }

            rows.push(actionRow);

        }

        // Cash Out button
        rows.push(
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("cashout")
                    .setLabel(`💰 Cash Out ($${amount.toLocaleString()})`)
                    .setStyle(ButtonStyle.Success)
            )
        );

        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle("💎 Mines")
            .setDescription(
                [
                    `**Bet:** $${amount.toLocaleString()}`,
                    `**Mines:** ${mineCount}`,
                    "",
                    "Click a tile to begin!"
                ].join("\n")
            );

        const reply = await interaction.reply({
            embeds: [embed],
            components: rows,
            fetchReply: true
        });

        const game = activeGames.get(interaction.user.id);

        if (game) {
            game.messageId = reply.id;
        }

    }
};