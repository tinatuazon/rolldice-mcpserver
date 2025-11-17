import { z } from "zod"

// Shared Zod schema for dice sides validation
export const diceSchema = z.number().int().min(2)

// Shared dice rolling logic used by both MCP handler and server actions
export function rollDice(sides: number, userName?: string) {
  // Validate input using the shared schema
  const validatedSides = diceSchema.parse(sides)
  
  // Generate random number (same algorithm everywhere)
  const value = 1 + Math.floor(Math.random() * validatedSides)
  
  // Create personalized message if user info is available
  const userGreeting = userName ? ` (Hello, ${userName}!)` : ''
  
  // Return standardized result format
  return {
    type: 'text' as const,
    text: `🎲 You rolled a ${value}!${userGreeting} [Secured with OAuth 2.1]`
  }
}

// Tool definition that can be reused
export const rollDiceTool = {
  name: 'roll_dice',
  description: 'Rolls an N-sided die (requires OAuth 2.1 authentication)',
  schema: {
    sides: diceSchema,
  }
} as const
