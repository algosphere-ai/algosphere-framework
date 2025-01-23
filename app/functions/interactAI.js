import fetch from "node-fetch";
import { firstTopBuyersQuery, marketCapQuery, topHoldersQuery, trendingTokensQuery } from "../lib/query.js";
import { checkAgentExists } from "../lib/agent-db.js";

const BITQUERY_API_URL = "https://streaming.bitquery.io/eap";
const BITQUERY_API_KEY = "ory_at_w1NtPKqID7ahMNKqFl1XSccyELqZRSxWFkTiWBb9kwA.mr07Cinxo7gCSNlCJKAIOjz-9T29ZIMMQbAK9eRm5j8";

async function fetchMarketcap(count, term) {
    if (count > 30)
        count = 30;
    const query = marketCapQuery(term, count);
    try {
        const response = await fetch(BITQUERY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${BITQUERY_API_KEY}`,
            },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch market cap data: ${response.statusText}`);
        }
        const data = (await response.json());
        const updates = data?.data?.Solana?.TokenSupplyUpdates || [];
        if (updates.length === 0) {
            console.log(`No results found for term: "${term}"`);
            return;
        }
        console.log(`Marketcap Data for term: "${term}":`);
        updates.forEach(({ TokenSupplyUpdate }) => {
            const marketcap = formatMarketcap(TokenSupplyUpdate.Marketcap);
            const symbol = TokenSupplyUpdate.Currency.Symbol;
            const mintAddress = TokenSupplyUpdate.Currency.MintAddress;
            console.log(`${symbol} | ${mintAddress} | Marketcap: ${marketcap}`);
        });
    }
    catch (error) {
        console.error("Error fetching market cap data from Bitquery:", error);
    }
}
async function fetchTopHolders(mintAddress) {
    const query = topHoldersQuery(mintAddress);
    try {
        const response = await fetch(BITQUERY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${BITQUERY_API_KEY}`,
            },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch top holders: ${response.statusText}`);
        }
        const data = (await response.json());
        const balanceUpdates = data?.data?.Solana?.BalanceUpdates || [];
        if (balanceUpdates.length === 0) {
            console.log(`No top holders found for MintAddress: ${mintAddress}`);
            return;
        }
        console.log(`Fetching top 10 holders for: ${mintAddress}`);
        balanceUpdates.forEach(({ BalanceUpdate }) => {
            const address = BalanceUpdate?.Account?.Address || "Unknown Address";
            const holding = BalanceUpdate?.Holding ? parseFloat(BalanceUpdate.Holding).toFixed(6) : "0.000000";
            console.log(`${address} | Holdings: ${holding}`);
        });
    }
    catch (error) {
        console.error("Error fetching top holders from Bitquery:", error);
    }
}
async function fetchFirstTopBuyers(mintAddress, count) {
    const query = firstTopBuyersQuery(mintAddress, count);
    try {
        const response = await fetch(BITQUERY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${BITQUERY_API_KEY}`,
            },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch top buyers: ${response.statusText}`);
        }
        const data = (await response.json());
        const trades = data?.data?.Solana?.DEXTrades || [];
        if (trades.length === 0) {
            console.log(`No top buyers found for MintAddress: ${mintAddress}`);
            return;
        }
        console.log(`Top ${count} buyers for: ${mintAddress}`);
        trades.forEach(({ Trade }) => {
            const amount = Trade.Buy.Amount;
            const owner = Trade.Buy.Account.Token.Owner;
            console.log(`Amount: ${amount} | Owner: ${owner}`);
        });
    }
    catch (error) {
        console.error("Error fetching top buyers from Bitquery:", error);
    }
}
async function fetchTrendingTokens() {
    const query = trendingTokensQuery();
    try {
        const response = await fetch(BITQUERY_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${BITQUERY_API_KEY}`,
            },
            body: JSON.stringify({ query }),
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch trending tokens: ${response.statusText}`);
        }
        const data = (await response.json());
        const trades = data?.data?.Solana?.DEXTradeByTokens || [];
        if (trades.length === 0) {
            console.log("No trending tokens found.");
            return;
        }
        console.log("Top 5 Trending Tokens 24h:");
        trades.forEach(({ Trade }) => {
            const name = Trade.Currency.Name || "Unknown Token";
            const mintAddress = Trade.Currency.MintAddress || "Unknown Address";
            console.log(`${mintAddress} | ${name}`);
        });
    }
    catch (error) {
        console.error("Error fetching trending tokens from Bitquery:", error);
    }
}

async function interactAgent(agentName, question) {
    const hasMarketcapKeywords = /marketcap/i.test(question);
    const hasTrendingKeywords = /trending/i.test(question);
    const hasTopHoldersKeywords = /top.*holders/i.test(question);
    const hasTopBuyersKeywords = /first.*top.*buyers/i.test(question);
    const agentExists = await checkAgentExists(agentName);
    if (!agentExists) {
        console.error(`Cannot process request. Agent "${agentName}" is not registered.`);
        return;
    }

    if (hasMarketcapKeywords) {
        const countMatch = question.match(/count:\s*(\d+)/i);
        const termMatch = question.match(/term:\s*"([^"]+)"/i);
        const count = countMatch ? parseInt(countMatch[1], 10) : 10;
        const term = termMatch ? termMatch[1] : "";
        if (term) {
            await fetchMarketcap(count, term);
        }
        else {
            console.log("Please provide a valid search term. Marketcap / Trending / Top holders / First top buyers");
        }
    }
    else if (hasTopHoldersKeywords) {
        const mintAddressMatch = question.match(/[A-Za-z0-9]{32,44}/);
        if (mintAddressMatch) {
            const mintAddress = mintAddressMatch[0];
            await fetchTopHolders(mintAddress);
        }
        else {
            console.log("Please provide a valid MintAddress in the question.");
        }
    }
    else if (hasTopBuyersKeywords) {
        const mintAddressMatch = question.match(/[A-Za-z0-9]{32,44}/);
        const countMatch = question.match(/First.*top\s*(\d+)/i);
        const count = countMatch ? parseInt(countMatch[1], 10) : 10;
        if (mintAddressMatch) {
            const mintAddress = mintAddressMatch[0];
            await fetchFirstTopBuyers(mintAddress, count);
        }
        else {
            console.log("Please provide a valid MintAddress in the question.");
        }
    }
    else if (hasTrendingKeywords) {
        await fetchTrendingTokens();
    }
    else {
        console.log(`Unsupported question: "${question}"`);
    }
}
const args = process.argv.slice(2);
if (args.length < 3 || args[1] !== "ask") {
    console.error('Usage: npm run interact {agent_name} ask "Your question"');
    process.exit(1);
}
const agentName = args[0];
const question = args.slice(2).join(" ");

interactAgent(agentName, question).catch((error) => {
    console.error("An error occurred:", error);
});
