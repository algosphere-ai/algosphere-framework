# 🌐 AlgoSphere AI Framework

### Bridging AI and Blockchain Technology

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Discord](https://img.shields.io/discord/937797631323226112?color=7389D8&label=Discord&logo=discord&logoColor=ffffff)](https://discord.gg/algosphere)

## 📋 Overview

**AlgoSphere AI Framework** is a cutting-edge open-source solution that seamlessly integrates artificial intelligence with blockchain technology. Designed for developers seeking to create, deploy, and manage AI agents while harnessing the power of decentralized networks.

## ✨ Key Features

- 🤖 **AI Agent Creation**
  - Develop custom AI agents with defined behaviors
  - Intuitive APIs for agent management
  - Built-in natural language processing capabilities

- 🔗 **Blockchain Integration**
  - Direct deployment to Solana blockchain
  - Secure transaction handling
  - Built-in publishing tools

- 🛠️ **Developer Tools**
  - Command Line Interface (CLI)
  - Comprehensive API documentation
  - Extensive debugging capabilities

## 📦 Prerequisites

Before diving into AlgoSphere AI Framework, ensure you have:

| Requirement | Purpose | Verification Command |
|------------|----------|---------------------|
| **Node.js** | Runtime environment | `node -v` |
| **npm** | Package management | `npm -v` |
| **Git** | Version control | `git --version` |

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/algosphere-ai/algosphere-framework.git

# Navigate to project directory
cd algosphere-framework

# Install dependencies
npm install
```

## ⚙️ Configuration

Create a `.env` file in your project root:

```env
# 🔐 Solana Configuration
PRIVATE_KEYPAIR=<YOUR_PRIVATE_KEYPAIR>
RPC_ENDPOINT=https://api.mainnet-beta.solana.com

# 🤖 OpenAI Configuration
OPENAI_API_KEY=<OPENAI_API_KEY>

# 💹 Trading Parameters
ACTION=buy
MINT=<TOKEN_MINT_ADDRESS>
AMOUNT=1000
```

### Configuration Details

#### 🔑 Solana Parameters
- `PRIVATE_KEYPAIR`: Your secure Solana private keypair
- `RPC_ENDPOINT`: Network endpoint URL for blockchain interaction

#### 🎯 OpenAI Parameters
- `OPENAI_API_KEY`: Authentication key for AI capabilities

#### 📊 Trading Parameters
- `ACTION`: Trade direction (`buy`/`sell`)
- `MINT`: Token contract address
- `AMOUNT`: Transaction volume

## 🎮 Core Commands

### 1. Deploy AI Agents
Deploy your custom AI agents to the blockchain with a single command:

```bash
npm run deploy
```

Before deployment:
- Configure agent details in `app/agent/details.js`
- Add your agent's logo to `app/agent/logo.png`
- Ensure your Solana private keypair is set in `.env`

### 2. Query AI Agents
Interact with deployed agents using natural language queries:

```bash
npm run ask <agent_name> "Your Question Here"
```

Note: Requires OpenAI API Key in `.env` file for natural language processing.

### 3. Execute Trades
Perform token trading operations on the blockchain:

```bash
npm run trade
```

Configure trading parameters in `.env` before execution for:
- Token selection (MINT address)
- Trade direction (buy/sell)
- Transaction volume

### 4. Interactive Mode
Engage in ongoing conversations with AI agents:

```bash
npm run interact <agent_name> ask "Your question here"
```

This mode enables:
- Real-time agent interactions
- Complex query handling

## 📚 Documentation

Comprehensive documentation is available in our [Gitbook](https://algosphere.gitbook.io/algosphere-ai-framework).

## ⚖️ License

This project is protected under the MIT License - see [LICENSE](LICENSE) for details.

## 🌟 Support & Community

Connect with us through various channels:

- 💬 [Telegram Community](https://t.me/example)
- 🐦 [Twitter Updates](https://twitter.com/example)
- 🌐 [Official Website](https://algosphereai.xyz)

---

Built with ❤️ by the AlgoSphere Team