const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const {
    getUser,
    addMoney,
    removeMoney
} = require("../../utils/economy");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Send money to another player.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who do you want to pay?")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Amount of money")
                .setMinValue(1)
                .setRequired(true)
        ),

    async execute(interaction) {

        const sender = interaction.user;
        const receiver = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");

        if (sender.id === receiver.id) {
            return interaction.reply({
                content: "❌ You can't pay yourself."
            });
        }

        const senderData = getUser(sender.id);

        if (senderData.wallet < amount) {
            return interaction.reply({
                content: "❌ You don't have enough money."
            });
        }

        removeMoney(sender.id, amount);
        addMoney(receiver.id, amount);

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("💸 Payment")
            .setDescription(
                `**${sender.username}** paid **$${amount.toLocaleString()}** to **${receiver.username}**.`
            );

        await interaction.reply({
            embeds: [embed]
        });

    }

};