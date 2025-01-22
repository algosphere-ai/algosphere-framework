import * as dotenv from "dotenv";
import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import fetch from "node-fetch";
// import { checkAgentExists } from "../lib/agent-db.js";
dotenv.config();

const RPC_ENDPOINT =
	process.env.RPC_ENDPOINT || "https://api.mainnet-beta.solana.com";
const web3Connection = new Connection(RPC_ENDPOINT, "confirmed");

async function sendPortalTransaction(agentName) {
	// const agent = await checkAgentExists(agentName);
	// if (!agent) {
	// 	console.error(`Error: Agent "${agentName}" not found in database.`);
	// 	return;
	// }

	const action = process.env.ACTION || "buy";
	const mint = process.env.MINT || "";
	const amount = parseInt(process.env.AMOUNT || "1000");
	const secret = process.env.PRIVATE_KEYPAIR;
	if (!secret) {
		throw new Error("PRIVATE_KEYPAIR environment variable not set.");
	}

	const decodedSecret = bs58.decode(secret);
	if (decodedSecret.length !== 64) {
		throw new Error(
			"Invalid private key! Make sure it is a 64-character base58 encoded string."
		);
	}
	const signerKeyPair = Keypair.fromSecretKey(decodedSecret);

	const res = await fetch("https://pumpportal.fun/api/trade-local", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			publicKey: signerKeyPair.publicKey.toBase58(),
			action: action,
			mint: mint,
			denominatedInSol: "false",
			amount: amount,
			slippage: 10,
			priorityFee: 0.00001,
			pool: "pump",
		}),
	});
	if (res.status !== 200) {
		console.error("Error:", res.statusText);
        return;
	}
	const data = await res.arrayBuffer();
	const tx = VersionedTransaction.deserialize(new Uint8Array(data));
	tx.sign([signerKeyPair]);
	const signature = await web3Connection.sendTransaction(tx);
	console.log(`Transaction successful: https://solscan.io/tx/${signature}`);
}

const name = process.argv[2];
if (!name) {
	console.error("Error: Please provide the agent name as an argument.");
	process.exit(1);
}

sendPortalTransaction(name).catch((error) => {
	console.error("An error occurred:", error);
});
