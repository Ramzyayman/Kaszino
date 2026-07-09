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
        .setName("coinflip")
        .setDescription("Flip a coin and bet your money.")
        .addStringOption(option =>
            option
                .setName("side")
                .setDescription("Choose Heads or Tails")
                .setRequired(true)
                .addChoices(
                    { name: "Heads", value: "heads" },
                    { name: "Tails", value: "tails" }
                )
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("How much money to bet")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {

        const side = interaction.options.getString("side");
        const amount = interaction.options.getInteger("amount");

        const user = getUser(interaction.user.id);

        if (user.wallet < amount) {
            return interaction.reply({
                content: "❌ You don't have enough money."
            });
        }

        const result = Math.random() < 0.5 ? "heads" : "tails";

        if (result === side) {

            addMoney(interaction.user.id, amount);

            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🪙 Coin Flip")
                .setDescription(
                    `The coin landed on **${result}**!\n\nYou won **$${amount.toLocaleString()}**!`
                );

            return interaction.reply({
                embeds: [embed]
            });

        }

        removeMoney(interaction.user.id, amount);

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🪙 Coin Flip")
            .setDescription(
                `The coin landed on **${result}**!\n\nYou lost **$${amount.toLocaleString()}**.`
            );

        return interaction.reply({
            embeds: [embed]
        });

    }
};