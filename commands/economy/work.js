const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getUser,
    addMoney,
    setLastWork
} = require("../../utils/economy");

const COOLDOWN = 12 * 60 * 60 * 1000;

module.exports = {

    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work to earn some money."),

    async execute(interaction) {

        const user = getUser(interaction.user.id);

        const now = Date.now();

        if (now - user.lastWork < COOLDOWN) {

            const remaining = COOLDOWN - (now - user.lastWork);

            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);

            return interaction.reply({
                content: `⏳ You can work again in **${hours}h ${minutes}m**.`
            });

        }

        // Random reward between 150 and 500
        const reward = Math.floor(Math.random() * 351) + 150;

        addMoney(interaction.user.id, reward);
        setLastWork(interaction.user.id, now);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("💼 Work")
            .setDescription(`You earned **$${reward.toLocaleString()}**!`);

        await interaction.reply({
            embeds: [embed]
        });

    }

};