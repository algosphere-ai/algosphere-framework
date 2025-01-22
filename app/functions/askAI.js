import { OpenAI } from "openai";

import * as dotenv from "dotenv";
import { getAgent } from "../lib/agent-db.js";
dotenv.config();

const openAi = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function aiResponse(name, message) {

    const agent = await getAgent(name);

    if (!agent) {
        console.error(`Error: Agent "${name}" not found in database.`);
        return;
    }

    try {
        const response = await openAi.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are ${name}, an helpful AI companion. Reply in this personality: ${agent.personality}.`,
                },
                { role: "user", content: message },
            ],
        });
        const agentReply = response.choices[0]?.message?.content || "I'm sorry, I am not able to answer your question.";
        console.log(`Agent ${name}: ${agentReply}`);
    }
    catch (error) {
        console.error("Error generating response:", error);
    }
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Error: Not enough arguments provided.");
    console.error('Usage: npm run askai {agent_name} "Your message here"');
    process.exit(1);
}

const name = args[0];
const message = args.slice(1).join(" ");

aiResponse(name, message).catch((error) => {
    console.error("An error occurred:", error);
});
