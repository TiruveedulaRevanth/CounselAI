
'use server';

/**
 * @fileOverview An AI agent that analyzes a conversation and updates both a long-term user context and a short-term chat journal.
 *
 * - updateJournal - A function that takes conversation history and existing journals and returns updated versions.
 * - UpdateJournalInput - The input type for the function.
 * - UpdateJournalOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
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
  system: `You are an analytical psychologist AI. Your primary function is to meticulously maintain a user's journal, which is divided into a 'UserContext' (long-term memory) and a 'ChatJournal' (short-term, session-specific notes). Your analysis must be clinical, objective, and insightful.

**GUIDING PRINCIPLES:**
1.  **Synthesize and Evolve:** Do not simply replace information. Integrate new insights from the latest conversation into the existing journal notes, allowing the user's profile to evolve.
2.  **Differentiate Contexts:**
    *   **UserContext (Long-Term):** This is the core, enduring profile of the user. It should change slowly. Only add significant, recurring themes, personality traits, or problems that are clearly established over time. Do not add fleeting details from a single chat.
    *   **ChatJournal (Short-Term):** This is for the current conversation only. Update it to reflect the immediate discussion, including specific strategies discussed and progress made *within this session*.
3.  **Clinical Language:** Use objective, third-person language (e.g., "The user expresses...", "A pattern of avoidance was noted...").

**YOUR PROCESS:**
1.  **Review History:** Analyze the full 'history' of the conversation.
2.  **Compare and Contrast:** Compare the new information against the 'currentUserContext' and 'currentChatJournal'.
3.  **Generate 'updatedUserContext':**
    *   Cautiously add any new, significant, long-term insights.
    *   When noting 'recurringProblems', attempt to qualify them. Assess the **intensity** (e.g., mild, moderate, severe anxiety), **frequency**, or **duration** if the user provides enough information.
    *   Summarize and infer patterns. For example, if the user mentions multiple instances of avoiding social events, note a potential pattern of 'social avoidance'.
    *   If no new long-term insights are revealed, return the 'currentUserContext' fields unchanged, but do not leave them blank.
4.  **Generate 'updatedChatJournal':**
    *   Summarize the key solutions, coping strategies, or actionable next steps discussed in the latest turn of the conversation (e.g., "Discussed implementing a structured decision-making matrix," "Suggested mindfulness exercises for anxiety.").
    *   Briefly note any progress or new understanding the user reached *in this session*.
`,
  prompt: `A conversation has just concluded. Here is the full history and the current state of the journals.

=== CURRENT USER CONTEXT (Long-Term) ===
Core Themes: {{currentUserContext.coreThemes}}
Life Domains:
  - Business: {{currentUserContext.lifeDomains.business}}
  - Relationships: {{currentUserContext.lifeDomains.relationships}}
  - Family: {{currentUserContext.lifeDomains.family}}
  - Health: {{currentUserContext.lifeDomains.health}}
  - Finances: {{currentUserContext.lifeDomains.finances}}
  - Personal Growth: {{currentUserContext.lifeDomains.personalGrowth}}
Personality Traits: {{currentUserContext.personalityTraits}}
Recurring Problems / Stressors: {{currentUserContext.recurringProblems}}
Values / Goals: {{currentUserContext.values}}
Mood History: {{currentUserContext.moodHistory}}

=== CURRENT CHAT JOURNAL (This Session) ===
Suggested Solutions: {{currentChatJournal.suggestedSolutions}}
Progress Summary: {{currentChatJournal.progressSummary}}

=== FULL CONVERSATION HISTORY ===
{{#each history}}
  {{role}}: {{{content}}}
{{/each}}

Based on your instructions, analyze the conversation and generate the updated 'UserContext' and 'ChatJournal' with a clinical and analytical approach.
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
