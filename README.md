# Blog Deploy MCP Server

A Model Context Protocol (MCP) server for publishing blog posts to multiple platforms simultaneously. Deploy your content to Hashnode, Dev.to, and more with a single command.

## Features

- 🚀 **Multi-Platform Publishing**: Publish to multiple blogging platforms at once
- 🔐 **Secure Token Storage**: Tokens are securely stored in Cloudflare KV
- 📝 **Markdown Support**: Write your posts in Markdown format
- ⚡ **Cloudflare Workers**: Fast, edge-deployed MCP server
- 🔄 **Easy Integration**: Works seamlessly with Claude Desktop and other MCP clients

## Supported Platforms

- ✅ **Hashnode** - Developer blogging platform
- ✅ **Dev.to** - Community-driven developer platform
- 🔜 More platforms coming soon!

## Quick Start

### 1. Deploy to Cloudflare Workers

Deploy your MCP server to Cloudflare Workers:

```bash
npm run deploy
```

This will deploy your server to: `https://blog-deploy-mcp.<your-account>.workers.dev`

### 2. Configure MCP Client

Update your MCP client configuration (e.g., Claude Desktop) to connect to your deployed server:

**For Claude Desktop** (`~/.cursor/mcp.json` or Claude Desktop config):

```json
{
  "mcpServers": {
    "blog-deploy-mcp": {
      "command": "mcp-remote",
      "args": [
        "https://blog-deploy-mcp.<your-account>.workers.dev/mcp"
      ]
    }
  }
}
```

Replace `<your-account>` with your Cloudflare account subdomain.

### 3. Set Platform Tokens

Before publishing, set your API tokens for each platform:

```
setPlatformToken(platform: "hashnode", token: "your-hashnode-token")
setPlatformToken(platform: "devto", token: "your-devto-api-key")
```

### 4. Publish Your First Post

Publish a blog post to one or more platforms:

```
publishPost(
  title: "My First Blog Post",
  contentMarkdown: "# Hello World\n\nThis is my first post!",
  platforms: ["hashnode", "devto"]
)
```

## Available Tools

### `setPlatformToken`

Save API tokens for blogging platforms.

**Parameters:**
- `platform` (string): Platform name (e.g., "hashnode", "devto")
- `token` (string): API token for the platform

**Example:**
```
setPlatformToken(platform: "hashnode", token: "your-token-here")
```

### `publishPost`

Publish a blog post to one or more platforms simultaneously.

**Parameters:**
- `title` (string): Blog post title
- `contentMarkdown` (string): Blog post content in Markdown format
- `platforms` (array): List of platforms to publish to (e.g., ["hashnode", "devto"])

**Example:**
```
publishPost(
  title: "Getting Started with TypeScript",
  contentMarkdown: "# Getting Started\n\nTypeScript is awesome!",
  platforms: ["hashnode"]
)
```

## Getting API Tokens

### Hashnode

1. Go to [Hashnode Settings](https://hashnode.com/settings)
2. Navigate to **API** section
3. Generate a new Personal Access Token
4. Copy the token and use it with `setPlatformToken`

### Dev.to

1. Go to [Dev.to Settings](https://dev.to/settings/extensions)
2. Scroll to **DEV Community API Keys** section
3. Generate a new API key
4. Copy the key and use it with `setPlatformToken`

## Local Development

Run the server locally for testing:

```bash
npm run dev
```

The server will be available at `http://localhost:8787`

## Project Structure

```
BlogDeploy/
├── src/
│   ├── index.ts              # Main MCP server implementation
│   ├── config.ts             # Configuration management
│   ├── platforms/            # Platform-specific implementations
│   │   ├── hashnode/
│   │   ├── devto/
│   │   └── base/
│   └── publisher/
│       └── PlatformManager.ts
├── wrangler.jsonc           # Cloudflare Workers configuration
└── package.json
```

## Environment Setup

The server uses Cloudflare KV for storing platform tokens securely. Make sure your `wrangler.jsonc` is configured with the KV namespace binding.

## Contributing

Want to add support for more platforms? Check out the `platforms/` directory and follow the existing platform implementations.

## License

MIT
