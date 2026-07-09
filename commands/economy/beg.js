const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getUser,
    addMoney,
    setLastBeg
} = require("../../utils/economy");

const COOLDOWN = 8 * 60 * 60 * 1000;

module.exports = {

    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("Beg for a small amount of money."),

    async execute(interaction) {

        const user = getUser(interaction.user.id);

        const now = Date.now();

        if (now - user.lastBeg < COOLDOWN) {

            const remaining = COOLDOWN - (now - user.lastBeg);

            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);

            return interaction.reply({
                content: `⏳ You can beg again in **${hours}h ${minutes}m**.`
            });

        }

        setLastBeg(interaction.user.id, now);

        const success = Math.random() < 0.4;

        if (!success) {

            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("🙏 Beg")
                .setDescription("Nobody gave you any money.");

            return interaction.reply({
                embeds: [embed]
            });

        }

        const reward = Math.floor(Math.random() * 66) + 10;

        addMoney(interaction.user.id, reward);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🙏 Beg")
            .setDescription(`Someone gave you **$${reward.toLocaleString()}**!`);

        interaction.reply({
            embeds: [embed]
        });

    }

};