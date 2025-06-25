# ApostropheCMS-MCP

## Installation

```bash
# Clone the repository
git clon git@github.com:speedandfunction/ApostropheCMS-MCP.git
cd ApostropheCMS-MCP

# Install dependencies
npm i
```

## Setup

Go to WindSurf AI settings and add the following configuration to the `ModelContextProtocol` section:

```
{
  "mcpServers": {
    "apostrophe-cms": {
      "command": "node",
      "args": ["path/to/your/server.js"],
      "env": {
        "APOSTROPHE_SNIPPETS_DIR": "/path/to/your/apostrophe-snippets"
      }
    }
  }
}
```

This config file could be placed in the 
/Users/[YOUR_USERNAME]/.codeium/windsurf/mcp_config.json

# Usage

You can now use the ApostropheCMS MCP server by running the following request in Cascade:

```
Could you add Rich Text Widget in my project?
```
