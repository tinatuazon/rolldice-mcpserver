// app/api/[transport]/route.ts
import { createMcpHandler } from "mcp-handler";
import { verifyGoogleToken } from "@/lib/auth";
import { rollDice, rollDiceTool } from "@/lib/dice";

const handler = createMcpHandler(
  (server) => {
    server.tool(
      rollDiceTool.name,
      rollDiceTool.description,
      rollDiceTool.schema,
      async ({ sides }, { user }) => {
        // Use the shared dice rolling logic with user information
        const result = rollDice(sides, user?.name || user?.user);
        return {
          content: [result],
        };
      }
    );
  },
  {
    // Add authentication requirement
    async authenticate(authInfo) {
      if (!authInfo?.token) {
        throw new Error("Authentication required - Please log in with Google OAuth");
      }
      
      const payload = await verifyGoogleToken(authInfo.token);
      if (!payload) {
        throw new Error("Invalid authentication token");
      }
      
      // Return user information for context
      return { 
        user: payload.email,
        name: payload.name,
        userId: payload.sub 
      };
    },
  },
  {
    // No Redis config - disable Redis requirement
    basePath: "/api", // this needs to match where the [transport] is located.
    maxDuration: 60,
    verboseLogs: true,
  }
);
export { handler as GET, handler as POST };