export interface Config {
	tokens?: Record<string, string>; // platform → token
}

const CONFIG_KEY = "blog-mcp-config";

// Load config from Durable Object storage (isolated per instance/user)
export async function loadConfigFromStorage(storage: DurableObjectStorage): Promise<Config> {
	try {
		const raw = await storage.get<string>(CONFIG_KEY);
		if (!raw) {
			return { tokens: {} };
		}
		return JSON.parse(raw);
	} catch {
		return { tokens: {} };
	}
}

// Save config to Durable Object storage (isolated per instance/user)
export async function saveConfigToStorage(config: Config, storage: DurableObjectStorage): Promise<void> {
	const finalConfig: Config = {
		tokens: {
			...(config.tokens || {}),
		},
	};

	await storage.put(CONFIG_KEY, JSON.stringify(finalConfig, null, 2));
}

// Legacy KV functions (kept for backward compatibility if needed)
export async function loadConfig(kv: KVNamespace): Promise<Config> {
	try {
		const raw = await kv.get(CONFIG_KEY);
		if (!raw) {
			return { tokens: {} };
		}
		return JSON.parse(raw);
	} catch {
		return { tokens: {} };
	}
}

export async function saveConfig(config: Config, kv: KVNamespace): Promise<void> {
	const finalConfig: Config = {
		tokens: {
			...(config.tokens || {}),
		},
	};

	await kv.put(CONFIG_KEY, JSON.stringify(finalConfig, null, 2));
}

