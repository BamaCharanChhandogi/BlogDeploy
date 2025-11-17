# 🚀 BlogCaster MCP — Publish Your Blog Everywhere With One Command

BlogCaster MCP lets you publish a single Markdown post to **multiple blog platforms at once**, including:

- Hashnode
- Dev.to  
- (More platforms coming soon)

It runs as a **cloud-hosted MCP server**, so you don't install anything.  
Just connect it to **Claude Desktop**, **Cursor**, or any MCP-enabled tool.

---

# ✨ What BlogCaster MCP Does

You can talk to an AI and say:

> "Publish this blog post to Hashnode and Dev.to."

And BlogCaster MCP will:

1. Ask for your tokens securely  
2. Store them in Cloudflare KV  
3. Publish your post to all selected platforms  
4. Return links to the published posts  

This is *true* **Publish Once → Everywhere** for bloggers and developers.

---

# 🌐 MCP Server URL

Your BlogCaster MCP endpoint:

```
https://blogcaster-mcp.rrpb2580.workers.dev
```

Replace `<your-account>` with your Cloudflare account prefix.

---

# 🛠 Connecting BlogCaster MCP to Claude Desktop

1. Open Claude Desktop  
2. Go to **Settings → Developer → MCP Servers**  
3. Add the following config:

```json
{
  "mcpServers": {
    "blogcaster": {
      "command": "mcp-remote",
      "args": [
        "https://blogcaster-mcp.<your-account>.workers.dev/mcp"
      ]
    }
  }
}
```

Restart Claude Desktop

Claude will now detect BlogCaster MCP automatically

## 🛠 Connecting to Cursor (or Cline)

Add this to Cursor's MCP config:

```json
{
  "blogcaster": {
    "url": "https://blogcaster-mcp.<your-account>.workers.dev/mcp"
  }
}
```

Cursor will reload MCP integrations on restart.

---

# 🔑 Step 1 — Add Your Platform Tokens

Before publishing to any platform, run these tool commands inside Claude/Cursor:

## Hashnode

```javascript
setPlatformToken(
  platform: "hashnode",
  token: "YOUR_HASHNODE_API_TOKEN"
)
```

## Dev.to

```javascript
setPlatformToken(
  platform: "devto",
  token: "YOUR_DEVTO_API_KEY"
)
```

💡 Tokens are securely stored in Cloudflare KV and never shown again.

---

# 📝 Step 2 — Publish Your First Blog Post

Now you can publish a blog instantly:

```javascript
publishPost(
  title: "My First BlogCaster Demo",
  contentMarkdown: "# Hello World\nThis was published using BlogCaster MCP!",
  platforms: ["hashnode", "devto"]
)
```

BlogCaster will:

- Validate all tokens
- Publish to each platform
- Return a JSON list of results

Example output:

```json
[
  {
    "platform": "hashnode",
    "success": true,
    "result": {
      "id": "123",
      "url": "https://yourblog.hashnode.dev/my-post",
      "slug": "my-post"
    }
  },
  {
    "platform": "devto",
    "success": true,
    "result": {
      "id": 987,
      "url": "https://dev.to/yourname/my-post"
    }
  }
]
```

---

# ✨ Advanced Usage

## Publish to only one platform

```javascript
publishPost(
  title: "Hashnode Only",
  contentMarkdown: "Hello!",
  platforms: ["hashnode"]
)
```

## Publish to multiple platforms

```javascript
publishPost(
  title: "Full Sync",
  contentMarkdown: "This goes everywhere!",
  platforms: ["hashnode", "devto"]
)
```

## Change the token for a platform

```javascript
setPlatformToken(
  platform: "devto",
  token: "NEW_TOKEN"
)
```

---

# 🔍 Supported Platforms

| Platform | Status |
|----------|--------|
| Hashnode | ✅ Fully supported |
| Dev.to | ✅ Fully supported |
| Ghost | 🔜 Coming |
| Medium | 🔜 Coming |
| WordPress | 🔜 Coming |

---

# ❓ FAQ

**Do I need to install anything?**  
No. BlogCaster MCP runs fully in the cloud.

**Where are my tokens stored?**  
In Cloudflare KV, secured and isolated per user.

**Can I add more platforms?**  
Yes — more are coming, and you can request or add your own.

**Does BlogCaster ever see my post text?**  
Only to publish it to your selected platforms. No data is stored.

---

# ❤️ Thanks for Using BlogCaster MCP
