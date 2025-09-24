
'use server';
/**
 * @fileOverview An AI agent that refines the user's long-term 'Values & Goals' based on their feedback.
 *
 * - rectifyValues - A function that takes the current values and user feedback to produce an updated version.
 * - RectifyValuesInput - The input type for the function.
 * - RectifyValuesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const RectifyValuesInputSchema = z.object({
  currentValues: z.string().describe("The AI's current understanding of the user's values and goals."),
  userFeedback: z.string().describe("The user's corrections or clarifications regarding their values and goals."),
});
export type RectifyValuesInput = z.infer<typeof RectifyValuesInputSchema>;

const RectifyValuesOutputSchema = z.object({
  updatedValues: z.string().describe("The revised summary of the user's values and goals based on their feedback."),
});
export type RectifyValuesOutput = z.infer<typeof RectifyValuesOutputSchema>;


export async function rectifyValues(
  input: RectifyValuesInput
): Promise<RectifyValuesOutput> {
  return rectifyValuesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rectifyValuesPrompt',
  input: { schema: RectifyValuesInputSchema },
  output: { schema: RectifyValuesOutputSchema },
  system: `You are an analytical AI assistant responsible for maintaining the 'Values & Goals' section of a user's long-term journal. Your task is to update this section based on direct feedback from the user.

1.  **Analyze:** Carefully read the AI's 'currentValues' understanding.
2.  **Synthesize:** Read the 'userFeedback' to understand the user's corrections.
3.  **Rewrite:** Generate a new, 'updatedValues' text that accurately integrates the user's feedback. Merge the corrections logically, maintain a clear and structured format, and ensure the final text is a comprehensive reflection of the user's stated values and goals. Do not just append the feedback; rewrite the section to be cohesive.
`,
  prompt: `Here is the current 'Values & Goals' summary and the user's feedback.

=== CURRENT VALUES & GOALS ===
{{{currentValues}}}

=== USER'S CORRECTIVE FEEDBACK ===
{{{userFeedback}}}

Based on the user's feedback, please generate the updated 'Values & Goals' summary.
`,
});

const rectifyValuesFlow = ai.defineFlow(
  {
    name: 'rectifyValuesFlow',
    inputSchema: RectifyValuesInputSchema,
    outputSchema: RectifyValuesOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (output) {
        return output;
      }
      throw new Error("AI failed to generate a rectified response.");
    } catch (error) {
       console.error("Error in rectifyValuesFlow:", error);
       // As a fallback, append the feedback to the original values.
       return {
         updatedValues: `${input.currentValues}\n\nUser Feedback: ${input.userFeedback}`
       };
    }
  }
);
