import { z } from 'zod';

export const SuggestResourceInputSchema = z.object({
  query: z.string().describe("The user's message or query to find a resource for."),
});
export type SuggestResourceInput = z.infer<typeof SuggestResourceInputSchema>;
