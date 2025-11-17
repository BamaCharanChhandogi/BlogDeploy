import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PlatformManager } from "./publisher/PlatformManager.js";
import { loadConfig, saveConfig } from "./config.js";

export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "blogcaster-mcp",
    version: "0.1.0",
  });

  private kv?: KVNamespace;

  constructor(state: DurableObjectState, env: any) {
    super(state, env);
    this.kv = env.BlogMCP;
  }

  async init(env?: any) {
    if (env?.BlogMCP) {
      this.kv = env.BlogMCP;
    }

    // Save API token for any blogging platform
    this.server.tool(
      "setPlatformToken",
      {
        platform: z.string().describe("Platform name (e.g., 'hashnode', 'devto')"),
        token: z.string().describe("API token for the platform"),
      },
      async ({ platform, token }) => {
        if (!this.kv) {
          return {
            content: [
              { type: "text", text: "❌ Error: KV namespace not configured." }
            ]
          };
        }

        try {
          const config = await loadConfig(this.kv);
          config.tokens = config.tokens || {};
          config.tokens[platform] = token;
          await saveConfig(config, this.kv);

          return {
            content: [
              { type: "text", text: `✅ Token saved successfully for platform: ${platform}` }
            ]
          };
        } catch (err: any) {
          return {
            content: [
              { type: "text", text: `❌ Error saving token: ${err.message}` }
            ]
          };
        }
      }
    );

    // Publish blog post to selected platforms
    this.server.tool(
      "publishPost",
      {
        title: z.string().describe("Blog post title"),
        contentMarkdown: z.string().describe("Blog post content in Markdown format"),
        platforms: z.array(z.string()).describe("List of platforms to publish to (e.g., ['hashnode', 'devto'])"),
      },
      async ({ title, contentMarkdown, platforms }) => {
        if (!this.kv) {
          return {
            content: [
              { type: "text", text: "❌ Error: KV namespace not configured." }
            ]
          };
        }

        try {
          const config = await loadConfig(this.kv);
          config.tokens = config.tokens || {};

          const results: any[] = [];

          for (const platformName of platforms) {
            const token = config.tokens[platformName];

            if (!token) {
              results.push({
                platform: platformName,
                error: `Token missing. Use setPlatformToken first.`
              });
              continue;
            }

            try {
              const platform = PlatformManager.getPlatform(platformName as any);

              if (platform.validateToken) {
                const ok = await platform.validateToken(token);
                if (!ok) {
                  results.push({
                    platform: platformName,
                    error: "Invalid token"
                  });
                  continue;
                }
              }

              const result = await platform.publishPost(token, {
                title,
                contentMarkdown
              });

              results.push({
                platform: platformName,
                success: true,
                result
              });
            } catch (err: any) {
              results.push({
                platform: platformName,
                error: err.message
              });
            }
          }

          return {
            content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
          };
        } catch (err: any) {
          return {
            content: [
              { type: "text", text: `❌ Error: ${err.message}` }
            ]
          };
        }
      }
    );
  }
}

export default {
  fetch(request: Request, env: any, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  }
};