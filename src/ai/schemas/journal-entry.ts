
import { z } from 'zod';

export const UserContextSchema = z.object({
  personality: z.string().describe("A summary of the user's core personality traits observed over all conversations."),
  strengths: z.string().describe("A summary of the user's recurring strengths and positive attributes."),
  problems: z.string().describe("A summary of the user's main, long-term challenges, mental health problems, and real-world issues."),
});
export type UserContext = z.infer<typeof UserContextSchema>;

export const ChatJournalSchema = z.object({
  suggestedSolutions: z.string().describe("A summary of potential solutions or coping strategies discussed in the current chat."),
  progressSummary: z.string().describe("An assessment of the user's progress and improvement within the current chat session."),
});
export type ChatJournal = z.infer<typeof ChatJournalSchema>;

export const UpdateJournalInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).describe("The full conversation history."),
  currentUserContext: UserContextSchema.describe("The existing long-term context of the user."),
  currentChatJournal: ChatJournalSchema.describe("The existing journal for the current chat session."),
});
export type UpdateJournalInput = z.infer<typeof UpdateJournalInputSchema>;

export const UpdateJournalOutputSchema = z.object({
  updatedUserContext: UserContextSchema,
  updatedChatJournal: ChatJournalSchema,
});
export type UpdateJournalOutput = z.infer<typeof UpdateJournalOutputSchema>;

export const UserJournalEntrySchema = z.object({
  id: z.string(),
  date: z.number(),
  summary: z.string(),
});
export type UserJournalEntry = z.infer<typeof UserJournalEntrySchema>;

export const SummarizeForJournalInputSchema = z.object({
  query: z.string().describe("The user's query to be summarized."),
});
export type SummarizeForJournalInput = z.infer<typeof SummarizeForJournalInputSchema>;

export const SummarizeForJournalOutputSchema = z.object({
  summary: z.string().describe("A concise summary of the user's query, no more than 20 words."),
});
export type SummarizeForJournalOutput = z.infer<typeof SummarizeForJournalOutputSchema>;
