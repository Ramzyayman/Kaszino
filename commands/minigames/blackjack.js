const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} = require('discord.js');

const {
    getUser,
    addMoney,
    removeMoney
} = require('../../utils/economy');

const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createDeck() {
    let deck = [];
    for (let suit of suits) {
        for (let val of values) {
            let numVal = parseInt(val);
            if (['J', 'Q', 'K'].includes(val)) numVal = 10;
            if (val === 'A') numVal = 11;
            deck.push({ suit, val, numVal });
        }
    }
    return deck.sort(() => Math.random() - 0.5);
}

function calculateHand(hand) {
    let sum = 0;
    let aces = 0;
    for (let card of hand) {
        sum += card.numVal;
        if (card.val === 'A') aces += 1;
    }
    while (sum > 21 && aces > 0) {
        sum -= 10;
        aces -= 1;
    }
    return sum;
}

function displayHand(hand, hideSecond = false) {
    if (hideSecond) {
        return **** | 🎴;
    }
    return hand.map(c => ****).join(' | ');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of Blackjack.')
        .addIntegerOption(option =>
            option
                .setName('amount')
                .setDescription('How much money to bet')
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const user = getUser(interaction.user.id);

        if (user.wallet < amount) {
            return interaction.reply({
                content: '❌ You do not have enough money in your wallet.',
                ephemeral: true
            });
        }

        removeMoney(interaction.user.id, amount);

        let deck = createDeck();
        let playerHand = [deck.pop(), deck.pop()];
        let dealerHand = [deck.pop(), deck.pop()];

        let playerTotal = calculateHand(playerHand);
        let dealerTotal = calculateHand(dealerHand);

        let embed = new EmbedBuilder()
            .setTitle('🃏 Blackjack')
            .setColor('Blurple')
            .setDescription(**Bet:** {amount.toLocaleString()})
            .addFields(
                { name: Your Hand (), value: displayHand(playerHand), inline: true },
                { name: Dealer's Hand (), value: displayHand(dealerHand, true), inline: true }
            );

        if (playerTotal === 21) {
            if (dealerTotal === 21) {
                addMoney(interaction.user.id, amount);
                embed.setColor('Yellow').setDescription(**Bet:** {amount.toLocaleString()}\n\n**Push!** Both got Blackjack. Money refunded.);
                embed.data.fields[1] = { name: Dealer's Hand (21), value: displayHand(dealerHand), inline: true };
                return interaction.reply({ embeds: [embed] });
            } else {
                let winAmount = Math.floor(amount * 2.5);
                addMoney(interaction.user.id, winAmount);
                embed.setColor('Gold').setDescription(**Bet:** {amount.toLocaleString()}\n\n**BLACKJACK!** You won {(winAmount - amount).toLocaleString()} profit!);
                embed.data.fields[1] = { name: Dealer's Hand (), value: displayHand(dealerHand), inline: true };
                return interaction.reply({ embeds: [embed] });
            }
        }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('hit').setLabel('Hit').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('stand').setLabel('Stand').setStyle(ButtonStyle.Secondary)
        );

        const reply = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
        const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                return i.reply({ content: '❌ This is not your game.', ephemeral: true });
            }

            if (i.customId === 'hit') {
                playerHand.push(deck.pop());
                playerTotal = calculateHand(playerHand);

                if (playerTotal > 21) {
                    embed.setColor('Red').setDescription(**Bet:** {amount.toLocaleString()}\n\n**Bust!** You went over 21 and lost {amount.toLocaleString()}.);
                    embed.data.fields[0] = { name: Your Hand (), value: displayHand(playerHand), inline: true };
                    embed.data.fields[1] = { name: Dealer's Hand (), value: displayHand(dealerHand), inline: true };
                    row.components.forEach(c => c.setDisabled(true));
                    await i.update({ embeds: [embed], components: [row] });
                    collector.stop('bust');
                } else if (playerTotal === 21) {
                    playDealer();
                    await i.update({ embeds: [embed], components: [row] });
                    collector.stop('21');
                } else {
                    embed.data.fields[0] = { name: Your Hand (), value: displayHand(playerHand), inline: true };
                    await i.update({ embeds: [embed], components: [row] });
                }
            } else if (i.customId === 'stand') {
                playDealer();
                await i.update({ embeds: [embed], components: [row] });
                collector.stop('stand');
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                embed.setColor('Red').setDescription(**Bet:** {amount.toLocaleString()}\n\n**Timeout!** You took too long and lost {amount.toLocaleString()}.);
                embed.data.fields[1] = { name: Dealer's Hand (), value: displayHand(dealerHand), inline: true };
                row.components.forEach(c => c.setDisabled(true));
                await interaction.editReply({ embeds: [embed], components: [row] }).catch(()=>{});
            }
        });

        function playDealer() {
            while (calculateHand(dealerHand) < 17) {
                dealerHand.push(deck.pop());
            }
            dealerTotal = calculateHand(dealerHand);
            embed.data.fields[0] = { name: Your Hand (), value: displayHand(playerHand), inline: true };
            embed.data.fields[1] = { name: Dealer's Hand (), value: displayHand(dealerHand), inline: true };
            row.components.forEach(c => c.setDisabled(true));

            if (dealerTotal > 21 || playerTotal > dealerTotal) {
                addMoney(interaction.user.id, amount * 2);
                embed.setColor('Green').setDescription(**Bet:** {amount.toLocaleString()}\n\n**You Won!** You profit {amount.toLocaleString()}!);
            } else if (dealerTotal === playerTotal) {
                addMoney(interaction.user.id, amount);
                embed.setColor('Yellow').setDescription(**Bet:** {amount.toLocaleString()}\n\n**Push!** It's a tie, your money was refunded.);
            } else {
                embed.setColor('Red').setDescription(**Bet:** {amount.toLocaleString()}\n\n**You Lost!** The dealer had a better hand.);
            }
        }
    }
};
