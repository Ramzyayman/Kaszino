const isOwner = require("../utils/isOwner");

const {
    getUser,
    addMoney,
    removeMoney,
    setMoney,
    resetUser
} = require("../utils/economy");

module.exports = async (message) => {

    // Owner only
    if (!isOwner(message.author.id))
        return false;

    // Prefix
    if (!message.content.startsWith("!!"))
        return false;

    const args = message.content.slice(2).trim().split(/\s+/);

    const command = args.shift().toLowerCase();

    // -------------------------
    // Resolve target
    // -------------------------

    const targetArg = args[0];

    if (!targetArg) {
        await message.reply("❌ You must specify a user.");
        return true;
    }

    const userId = targetArg.replace(/[<@!>]/g, "");

    const target = await message.client.users
        .fetch(userId)
        .catch(() => null);

    if (!target) {
        await message.reply("❌ Invalid user.");
        return true;
    }

    // -------------------------
    // RESET USER
    // -------------------------

    if (command === "resetuser") {

        resetUser(target.id);

        await message.reply(
            `✅ **${target.username}** has been reset.`
        );

        return true;

    }

    // -------------------------
    // Amount validation
    // -------------------------

    const amount = Number(args[1]);

    if (!Number.isInteger(amount) || amount < 0) {

        await message.reply("❌ Invalid amount.");

        return true;

    }

    // -------------------------
    // Execute command
    // -------------------------

    switch (command) {

        case "setbalance":

            setMoney(target.id, amount);

            break;

        case "addbalance":

            addMoney(target.id, amount);

            break;

        case "removebalance":

            removeMoney(target.id, amount);

            break;

        default:

            return false;

    }

    const user = getUser(target.id);

    let action = "";

    switch (command) {

        case "setbalance":
            action = `set to **$${amount.toLocaleString()}**`;
            break;

        case "addbalance":
            action = `increased by **$${amount.toLocaleString()}**`;
            break;

        case "removebalance":
            action = `decreased by **$${amount.toLocaleString()}**`;
            break;

    }

    await message.reply({
        embeds: [
            {
                color: 0x57F287,
                title: "✅ Balance Updated",
                fields: [
                    {
                        name: "User",
                        value: `${target.username} (${target.id})`
                    },
                    {
                        name: "Action",
                        value: action
                    },
                    {
                        name: "Current Balance",
                        value: `$${user.wallet.toLocaleString()}`
                    }
                ]
            }
        ]
    });

    return true;

};