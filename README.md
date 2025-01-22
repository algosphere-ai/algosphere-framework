# AlgoSphere AI Agent Framework

##### The AlgoSohere Framework supports developers in managing the complexities of AI agent creation, deployment, and blockchain integration. With built-in tools for natural language processing and blockchain interaction, it’s a versatile solution for building intelligent, decentralized applications.

### Overview

The AlgoSphere Framework is an open-source tool designed to empower developers to create, deploy, and interact with AI agents directly from their Command Line Interface (CLI). With built-in capabilities for natural language processing and blockchain queries, AlgoSphere simplifies the complexities of AI agent management and blockchain integration.


### 🌟 Key Features

- **AI Agent Creation**: Define custom AI agents with specific behaviors and purposes.
- **Blockchain Integration**: Publish AI agents seamlessly to Solana.
- **Developer-Friendly**: Simple APIs and CLI commands for quick setup and deployment.

## 🚀 Quick Start
### Prerequisites
- Node.js (>= 16.x)
- npm (or yarn) installed
- A valid Bitquery API key
- read .env.example for rest of the Prerequisites

### Installation 
1. Clone the repository

2. Install dependencies:
``` bash
npm install
```
3. Set up environment variables: Create a .env file in the root directory and add the following variables:
 
```bash
PRIVATE_KEYPAIR=<YOUR_PRIVATE_KEYPAIR>
OPENAI_API_KEY=<YOUR_OPENAI_API_KEY> 
RPC_ENDPOINT=https://api.mainnet-beta.solana.com 
Add your Bitquery API in interactAI.js 
```