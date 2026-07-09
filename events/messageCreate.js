const adminHandler = require("../admin");

module.exports = {
    name: "messageCreate",

    async execute(message) {

        if (message.author.bot) return;
        if (!message.content.startsWith("!!")) return;

        await adminHandler(message);

    }
};