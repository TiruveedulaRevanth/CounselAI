
'use server';

/**
 * @fileOverview An AI agent that summarizes a user's query into a short journal entry.
 *
 * - summarizeForJournal - A function that accepts a user's query and returns a concise summary.
 * - SummarizeForJournalInput - The input type for the function.
 * - SummarizeForJournalOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { 
    SummarizeForJournalInputSchema, 
    SummarizeForJournalOutputSchema 
} from '../schemas/journal-entry';

import type { 
    SummarizeForJournalInput, 
    SummarizeForJournalOutput 
} from '../schemas/journal-entry';


export async function summarizeForJournal(
  input: SummarizeForJournalInput
): Promise<SummarizeForJournalOutput> {
  return summarizeForJournalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeForJournalPrompt',
  input: {schema: SummarizeForJournalInputSchema},
  output: {schema: SummarizeForJournalOutputSchema},
  prompt: `Summarize the following user query into a concise journal entry of no more than 20 words.

User Query: {{{query}}}`,
});

const summarizeForJournalFlow = ai.defineFlow(
  {
    name: 'summarizeForJournalFlow',
    inputSchema: SummarizeForJournalInputSchema,
    outputSchema: SummarizeForJournalOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (output) {
        return output;
      }
    } catch (error) {
       console.error("Error in summarizeForJournalFlow:", error);
    }
    // Return a truncated version of the query as a fallback.
    const truncatedQuery = input.query.length > 100 ? input.query.substring(0, 100) + '...' : input.query;
    return { summary: truncatedQuery };
  }
);
