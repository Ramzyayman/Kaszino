const minesHandler = require("../handlers/minesHandler");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {

        // Slash Commands
        if (interaction.isChatInputCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {

                await command.execute(interaction);

            } catch (error) {

                console.error(error);

                if (interaction.replied || interaction.deferred) {

                    await interaction.followUp({
                        content: "There was an error while executing this command."
                    });

                } else {

                    await interaction.reply({
                        content: "There was an error while executing this command."
                    });

                }

            }

            return;

        }

        // Buttons
        if (interaction.isButton()) {

            return minesHandler(interaction);

        }

    }
};