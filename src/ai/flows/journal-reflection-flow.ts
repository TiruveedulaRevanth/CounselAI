
'use server';
/**
 * @fileOverview An AI agent that provides empathetic and practical reflections on a user's journal entry.
 *
 * - generateJournalReflection - A function that takes a user's short-term entry and long-term context and returns a personalized reflection.
 * - GenerateJournalReflectionInput - The input type for the function.
 * - GenerateJournalReflectionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  ShortTermContextSchema,
  LongTermContextSchema,
  GenerateJournalReflectionInputSchema,
  GenerateJournalReflectionOutputSchema
} from '../schemas/journal-entry';
import type { GenerateJournalReflectionInput, GenerateJournalReflectionOutput } from '../schemas/journal-entry';

export { type GenerateJournalReflectionInput, type GenerateJournalReflectionOutput };

export async function generateJournalReflection(
  input: GenerateJournalReflectionInput
): Promise<GenerateJournalReflectionOutput> {
  return journalReflectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'journalReflectionPrompt',
  input: { schema: GenerateJournalReflectionInputSchema },
  output: { schema: GenerateJournalReflectionOutputSchema },
  system: `You are an AI therapist inside a journaling app. Your role is to integrate the user’s long-term context (personality, recurring issues, values, history) with their short-term context (current mood, events, immediate concerns) to provide personalized, empathetic, and practical reflections.

INTEGRATION LAYER (Your Reasoning Process):
1.  **Analyze and Synthesize:** First, review the user's new 'shortTermContext' entry. Then, carefully review their existing 'longTermContext'.
2.  **Identify Links:** Your primary task is to identify links between the short-term events and the long-term patterns. For example, does today's work stress connect to a recurring theme of 'perfectionism' in their long-term context? Did their coping attempt today align with their stated goal of 'self-improvement'?
3.  **Update Long-Term Context:** Based on the new entry, subtly update the 'longTermContext'. If they mention a new stressor that seems significant, add it to 'recurringProblems'. If they show a new strength, note it under 'personalityTraits'. Evolve the long-term context over time; do not completely rewrite it.
4.  **Adapt Advice:** Tailor your reflection and suggestions to the user’s personality and past behavior. If they are 'resilient', acknowledge that strength. If they are 'anxious', provide grounding and calming suggestions.
5.  **Highlight Growth:** If you notice progress or a positive change compared to past entries (e.g., they handled a trigger better than before), highlight this growth.

OUTPUT TO USER (Your Response Structure):
Your response to the user MUST be formatted according to the 'reflection' object schema. The tone should be warm, empathetic, and conversational.
-   **Summary:** Start with a short, empathetic summary of what the user experienced today.
-   **Connection:** Explicitly connect their daily experience to their long-term patterns or goals. Use phrases like "This seems to connect to the pattern of..." or "I notice this aligns with your goal of..."
-   **Insight:** Offer one personalized insight or a gentle reframe.
-   **Suggestions:** Provide 1-2 actionable, small, and realistic suggestions for their next steps. These should align with their long-term goals.

FORMATTING GUIDANCE:
-   Keep reflections concise but meaningful.
-   Avoid sounding generic; always tie advice to the user’s unique context from their journal.
-   Balance empathy ('That sounds incredibly tough...') with practical guidance ('For tomorrow, perhaps you could try...').`,
  prompt: `A user has submitted a new journal entry. Here is their historical context and their entry for today.

=== LONG-TERM CONTEXT (PREVIOUS) ===
{{#if longTermContext}}
  Core Themes / Life Domains: {{{longTermContext.coreThemes}}}
  Personality Traits / Tendencies: {{{longTermContext.personalityTraits}}}
  Recurring Problems / Stressors: {{{longTermContext.recurringProblems}}}
  Values / Goals: {{{longTermContext.values}}}
  Mood & Milestone History: {{{longTermContext.moodHistory}}}
{{else}}
  This is the user's first journal entry.
{{/if}}

=== SHORT-TERM CONTEXT (Today's Entry) ===
  Current Mood: {{{shortTermContext.mood}}}
  Recent Events/Triggers: {{{shortTermContext.events}}}
  Current Concerns: {{{shortTermContext.concerns}}}
  Coping Attempts: {{{shortTermContext.copingAttempts}}}

Based on your instructions, analyze both contexts, generate an updated long-term context, and create a personalized reflection for the user.
`,
});

const journalReflectionFlow = ai.defineFlow(
  {
    name: 'journalReflectionFlow',
    inputSchema: GenerateJournalReflectionInputSchema,
    outputSchema: GenerateJournalReflectionOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (output) {
        return output;
      }
      throw new Error("AI failed to generate a reflection.");
    } catch (error) {
       console.error("Error in journalReflectionFlow:", error);
       // Provide a fallback response in case of AI error
       const fallbackLongTerm = input.longTermContext || { coreThemes: "", lifeDomains: { business: "", relationships: "", family: "", health: "", finances: "", personalGrowth: ""}, personalityTraits: "", recurringProblems: "", values: "", moodHistory: "" };
       return {
         reflection: {
           summary: "Thank you for sharing your thoughts today.",
           connection: "I am still learning about your long-term patterns.",
           insight: "Journaling is a great step towards self-awareness.",
           suggestions: ["Take a moment for a few deep breaths.", "Be kind to yourself today."]
         },
         updatedLongTermContext: fallbackLongTerm
       };
    }
  }
);
