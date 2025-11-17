import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(token: string) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();
        
        if (!payload) {
            console.error("No payload in token");
            return null;
        }
        
        // Log successful authentication (remove in production)
        console.log(`Authentication successful for user: ${payload.email}`);
        
        return payload;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}

export interface AuthenticatedUser {
    user: string;
    name?: string;
    userId: string;
}