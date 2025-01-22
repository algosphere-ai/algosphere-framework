import * as dotenv from "dotenv";
dotenv.config();

import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import { agentDetails } from "../agent/details.js";
import bs58 from "bs58";
import fs from "fs";
import fetch from "node-fetch";
import { addAgent, checkAgentExists } from "../lib/agent-db.js";

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const web3Connection = new Connection(RPC_ENDPOINT, "confirmed");

async function createTokenTx() {
	const agentName = agentDetails.name;
	// Check if the agent already exists
	const agentExists = await checkAgentExists(agentName);

	if (agentExists) {
		console.error(`Agent "${agentName}" already exists. Try another name.`);
		return;
	}

	// Validate the private keypair
	const secret = process.env.PRIVATE_KEYPAIR;
	if (!secret) {
		throw new Error(
			"PRIVATE_KEYPAIR not found! Please set it in your .env file."
		);
	}
	const signerKeyPair = Keypair.fromSecretKey(bs58.decode(secret));
	const mintKeypair = Keypair.generate();

	// Prepare metadata upload
	const FormData = (await import("form-data")).default;
	const formData = new FormData();
	formData.append("file", fs.createReadStream(agentDetails.imagePath));
	formData.append("name", agentDetails.name);
	formData.append("symbol", agentDetails.symbol);
	const modifiedDescription = `${agentDetails.description}\n\n. Made by AlgoSphere.`;
	formData.append("description", modifiedDescription);
	const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
		method: "POST",
		body: formData,
		headers: formData.getHeaders(),
	});
	if (!metadataResponse.ok) {
		throw new Error(
			`Failed to upload metadata: ${metadataResponse.statusText}`
		);
	}
	const metadataResponseJSON = await metadataResponse.json();

	// Create the token on Solana
	const response = await fetch("https://pumpportal.fun/api/trade-local", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			publicKey: signerKeyPair.publicKey.toBase58(),
			action: "create",
			tokenMetadata: {
				name: metadataResponseJSON.metadata.name,
				symbol: metadataResponseJSON.metadata.symbol,
				uri: metadataResponseJSON.metadataUri,
			},
			mint: mintKeypair.publicKey.toBase58(),
			denominatedInSol: "true",
			amount: agentDetails.initialBuyAmount,
			slippage: 10,
			priorityFee: 0.0005,
			pool: "pump",
		}),
	});
	if (response.ok) {
		const data = await response.arrayBuffer();
		const tx = VersionedTransaction.deserialize(new Uint8Array(data));
		tx.sign([mintKeypair, signerKeyPair]);
		const signature = await web3Connection.sendTransaction(tx);
		console.log(
			`Transaction successful: https://solscan.io/tx/${signature}`
		);
		// Store agent details in Firebase, including personality
		await addAgent(agentName, {
			...agentDetails,
			mintAddress: mintKeypair.publicKey.toBase58(),
			personality: agentDetails.personality, // Save the personality field
		});
		console.log(`Agent "${agentName}" and mint address saved.`);
	} else {
		console.error(`Error creating token: ${response.statusText}`);
	}
}

createTokenTx().catch((error) => {
	console.error("An error occurred during token deployment:", error);
    error.getLogs().then(log => {
        console.log(log);
    })
});
