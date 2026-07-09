const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const { getUser } = require("../../utils/economy");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("View your wallet balance."),

    async execute(interaction) {

        const user = getUser(interaction.user.id);

        const embed = new EmbedBuilder()
            .setTitle("💰 Wallet")
            .setDescription(
                `**${interaction.user.username}** has **$${user.wallet}**`
            )
            .setColor("Green");

        await interaction.reply({
            embeds: [embed]
        });

    }

};