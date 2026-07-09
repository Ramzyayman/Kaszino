const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { getLeaderboard } = require("../../utils/economy");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("View the richest players."),

    async execute(interaction) {

        const users = getLeaderboard();

        if (!users.length) {

            return interaction.reply({
                content: "Nobody has any money yet."
            });

        }

        let description = "";

        for (let i = 0; i < users.length; i++) {

            const user = users[i];

            let medal = `${i + 1}.`;

            if (i === 0) medal = "🥇";
            if (i === 1) medal = "🥈";
            if (i === 2) medal = "🥉";

            let username;

            try {

                username = (await interaction.client.users.fetch(user.userId)).username;

            } catch {

                username = "Unknown User";

            }

            description += `${medal} **${username}**\n`;
            description += `💰 $${user.wallet.toLocaleString()}\n\n`;

        }

        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle("🏆 Kaszinó Leaderboard")
            .setDescription(description)
            .setFooter({
                text: "Who will become the richest?"
            });

        await interaction.reply({
            embeds: [embed]
        });

    }
};