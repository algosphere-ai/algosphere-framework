import fetch from "node-fetch";
const BACKEND_URL = "https://api.algosphereai.xyz";

async function getAgent(name) {
	try {
		const res = await fetch(`${BACKEND_URL}/api/get-agent/${name}`);
		if (res.ok) {
			const agent = await res.json();
			return agent;
		} else {
			throw new Error(
				`Error fetching agent: ${res.statusText}`
			);
		}
	} catch (error) {
		console.error(
			"Backend get agent failed:",
			error.message
		);
		return null;
	}
}
async function addAgent(name, details) {
	try {
		const response = await fetch(`${BACKEND_URL}/api/add-agent`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, details }),
		});
		if (response.ok) {
			console.log(`Agent "${name}" successfully stored.`);
		} else {
			throw new Error(`Error storing agent: ${response.statusText}`);
		}
	} catch (error) {
		console.error("Backend add agent failed:", error.message);
	}
}
async function checkAgentExists(name) {
	try {
		const res = await fetch(`${BACKEND_URL}/api/agent/${name}`);
		if (res.ok) {
			const agent = await res.json();
			return agent.exists ?? false;
		} else throw new Error(`Error checking agent data: ${res.statusText}`);
	} catch (err) {
		console.error("Backend check agent failed:", err.message);
		return false;
	}
}

export { getAgent, addAgent, checkAgentExists };