const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Learn how to use Kaszinó."),

    async execute(interaction) {

        // =========================
        // EMBEDS
        // =========================

        const economyEmbed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle("💰 Kaszinó • Economy")
            .setDescription(
                "Earn money before risking it in the casino."
            )
            .addFields(
                {
                    name: "/balance",
                    value: "View your current wallet balance.",
                    inline: false
                },
                {
                    name: "/work",
                    value:
                        "Work a random job for money.\n" +
                        "⏰ Cooldown: **12 hours**",
                    inline: false
                },
                {
                    name: "/beg",
                    value:
                        "Beg for money.\n" +
                        "Sometimes you'll receive money...\n" +
                        "Sometimes you'll receive nothing.\n" +
                        "⏰ Cooldown: **8 hours**",
                    inline: false
                },
                {
                    name: "/pay",
                    value:
                        "Transfer money to another player.\n" +
                        "Example:\n`/pay @Friend 500`",
                    inline: false
                }
            )
            .setFooter({
                text: "Page 1 / 3"
            });

        const gamesEmbed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle("🎮 Kaszinó • Games")
            .setDescription(
                "Risk your money to win even more."
            )
            .addFields(
                {
                    name: "🪙 /coinflip",
                    value:
                        "Choose **Heads** or **Tails**.\n\n" +
                        "Example:\n" +
                        "`/coinflip heads 1000`\n\n" +
                        "Win → Double your bet.\n" +
                        "Lose → Lose your bet.",
                    inline: false
                },
                {
                    name: "💎 /mines",
                    value:
                        "Choose your bet and number of mines.\n\n" +
                        "`/mines 1000 5`\n\n" +
                        "Every gem increases your payout.\n" +
                        "Cash out whenever you want.\n" +
                        "Hit a mine and lose your bet.",
                    inline: false
                }
            )
            .setFooter({
                text: "Page 2 / 3"
            });

        const otherEmbed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle("🏆 Kaszinó • Other")
            .setDescription(
                "Helpful information."
            )
            .addFields(
                {
                    name: "/leaderboard",
                    value:
                        "See the richest players in the server.",
                    inline: false
                },
                {
                    name: "💡 Tips",
                    value:
                        "• Use **/work** every 12 hours.\n" +
                        "• Use **/beg** every 8 hours.\n" +
                        "• Gamble responsibly.\n" +
                        "• Climb to the top of the leaderboard!",
                    inline: false
                }
            )
            .setFooter({
                text: "Page 3 / 3"
            });

        // =========================
        // BUTTONS
        // =========================

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("economy")
                    .setLabel("💰 Economy")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("games")
                    .setLabel("🎮 Games")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("other")
                    .setLabel("🏆 Other")
                    .setStyle(ButtonStyle.Secondary)
            );
        // =========================
        // SEND MESSAGE
        // =========================

        const reply = await interaction.reply({
            embeds: [economyEmbed],
            components: [row],
            fetchReply: true
        });

        // =========================
        // COLLECTOR
        // =========================

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 5 * 60 * 1000
        });

        collector.on("collect", async i => {

            if (i.user.id !== interaction.user.id) {

                return i.reply({
                    content: "❌ Only the person who used `/help` can use these buttons.",
                    ephemeral: true
                });

            }

            switch (i.customId) {

                case "economy":

                    row.components[0].setStyle(ButtonStyle.Success);
                    row.components[1].setStyle(ButtonStyle.Secondary);
                    row.components[2].setStyle(ButtonStyle.Secondary);

                    await i.update({
                        embeds: [economyEmbed],
                        components: [row]
                    });

                    break;

                case "games":

                    row.components[0].setStyle(ButtonStyle.Secondary);
                    row.components[1].setStyle(ButtonStyle.Success);
                    row.components[2].setStyle(ButtonStyle.Secondary);

                    await i.update({
                        embeds: [gamesEmbed],
                        components: [row]
                    });

                    break;

                case "other":

                    row.components[0].setStyle(ButtonStyle.Secondary);
                    row.components[1].setStyle(ButtonStyle.Secondary);
                    row.components[2].setStyle(ButtonStyle.Success);

                    await i.update({
                        embeds: [otherEmbed],
                        components: [row]
                    });

                    break;

            }

        });

        collector.on("end", async () => {

            row.components.forEach(button => button.setDisabled(true));

            await interaction.editReply({
                components: [row]
            }).catch(() => {});

        });
    }

};