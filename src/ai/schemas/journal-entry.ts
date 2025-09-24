import { z } from 'zod';

// For the user to fill out in each new entry
export const ShortTermContextSchema = z.object({
  mood: z.string().describe("The user's current mood or primary emotion for the day."),
  events: z.string().describe("A brief description of recent events or triggers from the day."),
  concerns: z.string().describe("The main concerns or focus of the user's thoughts today."),
  copingAttempts: z.string().describe("What the user tried to do to cope, and whether it worked."),
});
export type ShortTermContext = z.infer<typeof ShortTermContextSchema>;

// For the AI to maintain and update over time
export const LongTermContextSchema = z.object({
  coreThemes: z.string().describe("A summary of the user's core life domains (e.g., work, relationships, health)."),
  personalityTraits: z.string().describe("A summary of the user's personality traits and tendencies (e.g., perfectionist, anxious)."),
  recurringProblems: z.string().describe("A summary of the user's repeated stressors or problems."),
  values: z.string().describe("A summary of the user's core values and long-term goals."),
  moodHistory: z.string().describe("A brief history of the user's mood patterns and major life milestones."),
});
export type LongTermContext = z.infer<typeof LongTermContextSchema>;

// The structure for a single journal entry
export const JournalEntrySchema = z.object({
  id: z.string(),
  date: z.number(),
  shortTermContext: ShortTermContextSchema,
  reflection: z.object({
    summary: z.string(),
    connection: z.string(),
    insight: z.string(),
    suggestions: z.array(z.string()),
  }).optional(),
});
export type JournalEntry = z.infer<typeof JournalEntrySchema>;


// --- Schema for the AI Flow ---

export const GenerateJournalReflectionInputSchema = z.object({
  shortTermContext: ShortTermContextSchema,
  longTermContext: LongTermContextSchema.optional(),
});
export type GenerateJournalReflectionInput = z.infer<typeof GenerateJournalReflectionInputSchema>;


const ReflectionSchema = z.object({
    summary: z.string().describe("A short, empathetic summary of what the user experienced today."),
    connection: z.string().describe("An explicit connection of the daily experience to long-term patterns or goals."),
    insight: z.string().describe("A personalized insight or a gentle reframe of the situation."),
    suggestions: z.array(z.string()).describe("1-2 actionable, small, and realistic suggestions for the user's next steps."),
});

export const GenerateJournalReflectionOutputSchema = z.object({
    reflection: ReflectionSchema,
    updatedLongTermContext: LongTermContextSchema,
});
export type GenerateJournalReflectionOutput = z.infer<typeof GenerateJournalReflectionOutputSchema>;