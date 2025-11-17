# Secure Rolldice MCP Server with OAuth 2.1

A Model Context Protocol (MCP) server that provides dice rolling functionality with Google OAuth 2.1 authentication.

## Features

- 🎲 Dice rolling tools with OAuth 2.1 security
- 🔐 Google OAuth authentication
- 👤 Personalized responses with user information
- 🔍 OAuth discovery endpoints for automatic client configuration
- 📱 Compatible with VS Code MCP Extension and Claude Desktop

## Prerequisites

Before running this server, you need:

1. **Google OAuth Credentials**: Complete Phase 1 of the AI Agents Security Workshop to obtain:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

2. **Environment Setup**: 
   - Node.js 22+ and pnpm installed
   - VS Code Insider with MCP Extension (for testing)

## Setup Instructions

### 1. Environment Configuration

Create or update your `.env.local` file with your Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm dev
```

The server will be available at `http://localhost:3000`

### 4. Configure Google OAuth Redirect URIs

In your Google Cloud Console OAuth client configuration, add these redirect URIs:

- `http://localhost:3000/api/auth/callback` (for local development)
- `https://your-app-name.vercel.app/api/auth/callback` (for production)

## MCP Client Configuration

### VS Code MCP Extension

Update your `.vscode/mcp.json`:

```json
{
  "servers": {
    "secure-rolldice-local": {
      "type": "http",
      "url": "http://localhost:3000/api/mcp"
    }
  }
}
```

### Claude Desktop

Update your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "secure-rolldice": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "http://localhost:3000/api/mcp"
      ]
    }
  }
}
```

## Available Tools

### roll_dice

Rolls an N-sided die with OAuth 2.1 authentication.

**Parameters:**
- `sides`: Number of sides on the die (minimum 2)

**Example Usage:**
- "roll a d6" 
- "roll a d20"
- "roll 2d10"

## Authentication Flow

1. MCP client requests access to tools
2. Server redirects to Google OAuth login
3. User authenticates with Google
4. Server validates token and returns user context
5. Tools are accessible with personalized responses

## OAuth 2.1 Discovery Endpoints

The server implements OAuth 2.1 discovery endpoints for automatic client configuration:

- `/.well-known/oauth-authorization-server` - Authorization server metadata
- `/.well-known/oauth-protected-resource` - Protected resource metadata

## Security Features

- ✅ HTTPS mandatory for production
- ✅ PKCE support for authorization code protection
- ✅ Token audience validation
- ✅ Secure token storage and handling
- ✅ Bearer token authentication in headers

## Deployment

### Deploy to Vercel

1. Deploy your repository to Vercel
2. Add environment variables in Vercel project settings:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
3. Update Google OAuth redirect URIs with your production domain
4. Update MCP client configurations with production URLs

### Testing Authentication

1. Access dice rolling tools through your MCP client
2. You should see an OAuth login prompt
3. Complete Google authentication 
4. Verify personalized dice rolling works
5. Test that unauthenticated requests are rejected

## Troubleshooting

- **OAuth errors**: Check environment variables are set correctly
- **Redirect URI mismatch**: Verify Google Cloud Console redirect URIs
- **Token validation fails**: Ensure Google Client ID matches environment variable
- **Discovery endpoints not found**: Check `.well-known` directory structure

## Workshop Reference

This implementation follows the patterns from the AI Agents Security Workshop:
- Phase 1: Study authentication patterns from `mcp-auth-demo`
- Phase 2: Apply OAuth 2.1 authentication to rolldice MCP server

For more information, see: https://aiagents.ausbizconsulting.com.au/agent-security-advanced