
'use server';

/**
 * @fileOverview An AI agent that analyzes a conversation and updates both a long-term user context and a short-term chat journal.
 *
 * - updateJournal - A function that takes conversation history and existing journals and returns updated versions.
 * - UpdateJournalInput - The input type for the function.
 * - UpdateJournalOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  UpdateJournalInputSchema,
  UpdateJournalOutputSchema
} from '../schemas/journal-entry';
import type { UpdateJournalInput, UpdateJournalOutput } from '../schemas/journal-entry';

export { type UpdateJournalInput, type UpdateJournalOutput };

export async function updateJournal(
  input: UpdateJournalInput
): Promise<UpdateJournalOutput> {
  return updateJournalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'updateJournalPrompt',
  input: { schema: UpdateJournalInputSchema },
  output: { schema: UpdateJournalOutputSchema },
  system: `You are a journal-keeping AI assistant. Your task is to analyze a therapy conversation and update two separate journals: the 'UserContext' and the 'ChatJournal'.

You MUST adhere to these rules:
1.  **Synthesize, Don't Replace:** Your primary goal is to *evolve* the journals, not overwrite them. Integrate new insights from the latest conversation history into the existing journal notes.
2.  **Differentiate Contexts:**
    *   **UserContext (Long-Term):** This journal should change slowly. It captures the user's core, enduring traits. Only add new, significant, and recurring themes. Do NOT add fleeting details from a single chat. Focus on personality, recurring strengths, and major, long-term problems.
    *   **ChatJournal (Short-Term):** This journal is specific to the *current* conversation. It should be updated more frequently to reflect the immediate discussion, including solutions suggested and progress made *within this single chat*.
3.  **Use Objective Language:** Write the journal entries in a neutral, observational third-person tone (e.g., "The user expresses...", "A recurring theme is..."). Avoid using "I" or "You".

**Your Process:**
1.  Review the full 'history' of the conversation.
2.  Compare the new information with the 'currentUserContext' and 'currentChatJournal'.
3.  Generate 'updatedUserContext' by cautiously adding any new, significant, long-term insights. If no new long-term insights are revealed, return the 'currentUserContext' unchanged.
4.  Generate 'updatedChatJournal' by summarizing the key solutions and progress points from the recent conversation turn.
`,
  prompt: `A conversation has just concluded. Here is the full history and the current state of the journals.

=== CURRENT USER CONTEXT (Long-Term) ===
Personality: {{currentUserContext.personality}}
Strengths: {{currentUserContext.strengths}}
Problems: {{currentUserContext.problems}}

=== CURRENT CHAT JOURNAL (This Session) ===
Suggested Solutions: {{currentChatJournal.suggestedSolutions}}
Progress Summary: {{currentChatJournal.progressSummary}}

=== FULL CONVERSATION HISTORY ===
{{#each history}}
  {{role}}: {{{content}}}
{{/each}}

Based on your instructions, analyze the conversation and generate the updated 'UserContext' and 'ChatJournal'.
`,
});

const updateJournalFlow = ai.defineFlow(
  {
    name: 'updateJournalFlow',
    inputSchema: UpdateJournalInputSchema,
    outputSchema: UpdateJournalOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      if (output) {
        return output;
      }
      // If AI fails, return the original context to prevent data loss.
      return {
          updatedUserContext: input.currentUserContext,
          updatedChatJournal: input.currentChatJournal,
      };
    } catch (error) {
       console.error("Error in updateJournalFlow:", error);
       // On error, return original context to ensure no data is lost.
       return {
          updatedUserContext: input.currentUserContext,
          updatedChatJournal: input.currentChatJournal,
       };
    }
  }
);
