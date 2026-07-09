# 🎰 Kaszinó

![Version](https://img.shields.io/badge/version-v1.0.0-gold?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

> A modern Discord economy & gambling bot built with **Node.js**, **discord.js**, and **SQLite**.

Kaszinó is a private Discord economy bot created for the **Austria-Hungary** community. Earn money, gamble it, compete with friends, and climb the leaderboard.

---

# ✨ Features

## 💰 Economy

| Command | Description |
|---------|-------------|
| `/balance` | View your current wallet balance. |
| `/work` | Earn a random amount of money every **12 hours**. |
| `/beg` | Try your luck every **8 hours**. |
| `/pay` | Send money to another player. |

---

## 🎮 Minigames

### 🪙 Coinflip

- Bet on **Heads** or **Tails**
- Win and double your bet
- Lose and forfeit your wager

Example:

```text
/coinflip heads 1000
```

---

### 💎 Mines

- Choose your bet
- Select the number of mines
- Reveal gems to increase your payout
- Cash out whenever you like
- Hit a mine and lose your bet

Example:

```text
/mines 1000 5
```

---

## 🏆 Community

| Command | Description |
|---------|-------------|
| `/leaderboard` | View the richest players in the server. |

---

## 📖 Help

Interactive help menu with buttons.

Includes:

- Economy commands
- Game explanations
- Cooldowns
- Beginner tips

---

## 👑 Hidden Admin Commands

Only the bot owner can use these.

```text
!!setbalance
!!addbalance
!!removebalance
!!resetuser
```

Supports:

- Discord User IDs
- Discord mentions

---

# 🛠 Built With

- Node.js
- discord.js v14
- SQLite
- better-sqlite3

---

# 📂 Project Structure

```text
Kaszinó
│
├── admin/
├── commands/
│   ├── economy/
│   └── minigames/
│
├── database/
├── events/
├── handlers/
├── utils/
│
├── deploy-commands.js
├── index.js
└── README.md
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Ramzyayman/Kaszino.git
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
TOKEN=YOUR_BOT_TOKEN
CLIENT_ID=YOUR_CLIENT_ID
GUILD_ID=YOUR_GUILD_ID
OWNER_IDS=YOUR_DISCORD_ID
```

Deploy commands

```bash
node deploy-commands.js
```

Start the bot

```bash
node index.js
```

---

# 📈 Current Version

## ✅ Kaszinó v1.0.0

Implemented:

- ✅ Economy System
- ✅ Coinflip
- ✅ Mines
- ✅ Leaderboard
- ✅ Interactive Help Menu
- ✅ Hidden Admin System

---

# 🔮 Roadmap

### 🎰 Version 1.1

- 🃏 Blackjack

### 🎰 Version 1.2

- 🎰 Slots
- 🎡 Roulette

### 🎰 Future

- 🏦 Bank System
- 🎁 Daily Rewards
- 🛒 Shop
- 📊 Economy Statistics

---

# 📸 Preview

> *Screenshots will be added after the first public release.*

---

# 🤝 Contributing

This project is currently private and not accepting external contributions.

---

# 📜 License

Private repository.

All rights reserved.

---

<div align="center">

## 🍀 Good luck, and gamble responsibly.

**Kaszinó • Austria-Hungary**

</div>