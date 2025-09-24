
'use server';

/**
 * @fileOverview Personalizes the AI's therapeutic approach based on a user-defined therapy style.
 *
 * - personalizeTherapyStyle - A function that personalizes the therapy style.
 * - PersonalizeTherapyStyleInput - The input type for the personalizeTherapyStyle function.
 * - PersonalizeTherapyStyleOutput - The return type for the personalizeTherapyStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { UserContextSchema, ChatJournalSchema } from '../schemas/journal-entry';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const PersonalizeTherapyStyleInputSchema = z.object({
  userName: z.string().optional().describe("The user's name."),
  therapyStyle: z
    .string()
    .describe(
      'A description of the desired therapy style, including techniques, approaches, and personality weightings.'
    ),
  userInput: z.string().describe('The user input or question.'),
  history: z.array(MessageSchema).optional().describe("The user's recent conversation history. The last message is the user's current input."),
  userContext: UserContextSchema.describe("A long-term summary of the user's core personality, strengths, and problems."),
  chatJournal: ChatJournalSchema.describe("A summary of the user's progress and suggested solutions specific to the current conversation.")
});
export type PersonalizeTherapyStyleInput = z.infer<
  typeof PersonalizeTherapyStyleInputSchema
>;

const PersonalizeTherapyStyleOutputSchema = z.object({
  response: z.string().describe('The AI assistant’s response, personalized to the specified therapy style.'),
  needsHelp: z.boolean().optional().describe('A flag indicating if the user is in crisis and needs immediate help.'),
});
export type PersonalizeTherapyStyleOutput = z.infer<
  typeof PersonalizeTherapyStyleOutputSchema
>;

export async function personalizeTherapyStyle(
  input: PersonalizeTherapyStyleInput
): Promise<PersonalizeTherapyStyleOutput> {
  return personalizeTherapyStyleFlow(input);
}


const prompt = ai.definePrompt({
  name: 'personalizeTherapyStylePrompt',
  input: {schema: PersonalizeTherapyStyleInputSchema},
  output: {schema: PersonalizeTherapyStyleOutputSchema},
  system: `You are an AI assistant specializing in mental health counseling. Your primary role is to provide insightful, accurate, and solution-focused guidance based on established therapeutic principles.

Before generating any response, you MUST review the user's long-term 'UserContext' and the current 'ChatJournal'. Your response must be informed by both.

1.  **Safety First (Self-Harm Risk):** You MUST analyze the user's input for any indication of self-harm or suicidal ideation (e.g., "I want to kill myself," "I want to end my life").
    *   **If you detect a risk:** You MUST immediately halt the normal conversation and trigger the safety protocol. Do not answer their question. Instead, set the 'needsHelp' flag to true and provide this exact response: "It sounds like you are in a lot of pain, and I'm deeply concerned. Your safety is the most important thing. Please know that help is available, and you don’t have to go through this alone. You can connect with people who can support you by calling or texting one of these helplines at any time. For India, you can call AASRA at +91-9820466726. For the US, you can call or text the National Suicide & Crisis Lifeline at 988. For other regions, please search for a local crisis hotline. If you are in immediate danger, please call your local emergency services."

2.  **Medical Disclaimer:** You MUST determine if the user is asking a medical question (e.g., asking for a diagnosis, or about medication).
    *   **If the query is medical:** You MUST decline the request. Do not answer the user's question directly. Instead, you MUST generate a response where you gently explain that you cannot provide medical advice because you are an AI, not a healthcare professional and that they should consult a qualified doctor for any health concerns.

3.  **Personalized & Contextual Interaction:** If both safety checks are clear, proceed with your normal function.
    *   **Review Journals:** Start by reviewing the 'UserContext' for long-term patterns and the 'ChatJournal' for this conversation's specific progress.
    *   **Identify and Validate Emotions:** Before offering advice, you MUST first identify the user's emotional state from their language. Your first step in the response should be to validate these feelings (e.g., "It sounds like you're feeling really confused and overwhelmed right now...").
    *   **Adapt Your Tone:** Adapt your tone to match the user's emotional state.
        *   If the user sounds **hopeless**, use a calm, patient, and reassuring tone.
        *   If the user sounds **angry or frustrated**, use a validating and stabilizing tone.
        *   If the user sounds **panicked or anxious**, use a grounding tone.
    *   **Maintain Continuity & Use Personalization:** Refer back to the 'Conversation History' and the journals to create a sense of continuity. Acknowledge previous points. If the user's name, {{userName}}, is provided, use it occasionally.
    *   **Adopt the Persona:** Fully adopt the specified 'therapyStyle'. If the style is a blend, synthesize them.
    *   **Suggest Actionable Tools:** When appropriate, gently offer to guide the user through a simple therapeutic technique (e.g., "Would you be open to trying a simple grounding technique together?").
    *   **Ask for Consent:** On highly sensitive topics, ask for permission before offering deeper analysis (e.g., "I have some thoughts on that, but I want to make sure you're comfortable hearing them. Shall I continue?").
`,
  prompt: `User's Name: {{#if userName}}{{userName}}{{else}}Not provided{{/if}}
Therapy Style: {{{therapyStyle}}}

=== LONG-TERM USER CONTEXT ===
Personality: {{userContext.personality}}
Strengths: {{userContext.strengths}}
Problems: {{userContext.problems}}

=== CURRENT CHAT JOURNAL ===
Suggested Solutions: {{chatJournal.suggestedSolutions}}
Progress Summary: {{chatJournal.progressSummary}}

=== CONVERSATION HISTORY ===
{{#if history}}
  {{#each history}}
    {{#if this.isUser}}
      User: {{{this.content}}}
    {{else}}
      CounselAI: {{{this.content}}}
    {{/if}}
  {{/each}}
{{else}}
  No history yet. This is the beginning of the conversation.
{{/if}}

Current User Input: {{{userInput}}}
`,
});

const personalizeTherapyStyleFlow = ai.defineFlow(
  {
    name: 'personalizeTherapyStyleFlow',
    inputSchema: PersonalizeTherapyStyleInputSchema,
    outputSchema: PersonalizeTherapyStyleOutputSchema,
  },
  async (input) => {
    // Augment history with a boolean for easier templating
    const historyWithRoles = input.history?.map(message => ({
        ...message,
        isUser: message.role === 'user'
    }));

    try {
      const {output} = await prompt({...input, history: historyWithRoles});
      if (!output) {
        // This can happen if the model's response is filtered or empty.
        return { response: "I'm sorry, I was unable to generate a response. Could you please try rephrasing your message?" };
      }
      return output;
    } catch (error) {
       console.error("Error in personalizeTherapyStyleFlow:", error);
       // This will catch validation errors if the model returns null or a malformed object.
       return { response: "I'm sorry, I encountered an unexpected issue and couldn't process your request. Please try again." };
    }
  }
);
