
'use server';

/**
 * @fileOverview Personalizes the AI's therapeutic approach based on a text-defined therapy style.
 *
 * - personalizeTherapyStyle - A function that personalizes the therapy style.
 * - PersonalizeTherapyStyleInput - The input type for the personalizeTherapyStyle function.
 * - PersonalizeTherapyStyleOutput - The return type for the personalizeTherapyStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeTherapyStyleInputSchema = z.object({
  therapyStyle: z
    .string()
    .describe(
      'A description of the desired therapy style, including techniques and approaches.'
    ),
  userInput: z.string().describe('The user input or question.'),
});
export type PersonalizeTherapyStyleInput = z.infer<
  typeof PersonalizeTherapyStyleInputSchema
>;

const PersonalizeTherapyStyleOutputSchema = z.object({
  response: z.string().describe('The AI assistant’s response, personalized to the specified therapy style.'),
});
export type PersonalizeTherapyStyleOutput = z.infer<
  typeof PersonalizeTherapyStyleOutputSchema
>;

export async function personalizeTherapyStyle(
  input: PersonalizeTherapyStyleInput
): Promise<PersonalizeTherapyStyleOutput> {
  return personalizeTherapyStyleFlow(input);
}

const checkForMedicalQueryTool = ai.defineTool(
  {
    name: 'checkForMedicalQuery',
    description: 'Checks if the user input is asking for medical advice, diagnosis, or prescription.',
    inputSchema: z.object({
      userInput: z.string(),
    }),
    outputSchema: z.boolean(),
  },
  async ({ userInput }) => {
    const medicalKeywords = ['prescribe', 'medicine', 'drug', 'medication', 'headache', 'migraine', 'fever', 'sore throat', 'pain', 'sickness', 'illness', 'doctor', 'pharmacist', 'hospital', 'diagnose', 'treatment', 'symptom'];
    const lowerInput = userInput.toLowerCase();
    return medicalKeywords.some(keyword => lowerInput.includes(keyword));
  }
);


const prompt = ai.definePrompt({
  name: 'personalizeTherapyStylePrompt',
  input: {schema: PersonalizeTherapyStyleInputSchema},
  output: {schema: PersonalizeTherapyStyleOutputSchema},
  tools: [checkForMedicalQueryTool],
  system: `You are an AI assistant specializing in mental health counseling. Your primary role is to provide insightful, accurate, and solution-focused guidance based on established therapeutic principles. Your responses should be comprehensive, detailed, and structured to empower the user.

You have a critical safety guideline: You are NOT a medical professional. You MUST NOT provide any form of medical advice, diagnosis, treatment, or prescriptions.

Before responding to the user, you MUST use the checkForMedicalQueryTool to determine if the user is asking a medical question.

- If the tool returns 'true': You MUST decline the request. Do not answer the user's question directly. Instead, you MUST generate a response object that contains a 'response' field where you:
  1. Gently explain that you cannot provide medical advice because you are an AI, not a healthcare professional.
  2. Emphasize the importance of consulting a qualified doctor or pharmacist for any health concerns.
  3. Tailor the refusal to the user's query to sound natural and not like a canned response. For example, if they ask about a headache, acknowledge their specific issue in your refusal (e.g., "I understand you're asking about what to do for a headache, but...").
  4. Reiterate your purpose is to provide supportive conversation and you are here to talk if they need it.

- If the tool returns 'false': Proceed with your normal function. Adopt the specified therapy style to provide a supportive, non-medical response. Structure your response to be helpful and constructive, following these core principles:
  1.  **Validation and Empathy:** Always begin by acknowledging and validating the user's feelings. Use phrases like, "It sounds like you're going through a lot," or "It makes sense that you're feeling that way."
  2.  **Ask Clarifying, Open-Ended Questions:** If the user's statement is brief, ask gentle, open-ended questions to encourage them to share more. For example, "Can you tell me more about what that's been like for you?" or "What's on your mind when you feel that way?"
  3.  **Explore and Reframe:** Help the user explore the underlying thoughts and patterns. Offer gentle reframes to provide a new perspective, without being dismissive.
  4.  **Provide Actionable, Solution-Focused Strategies:** Offer concrete, actionable steps, coping mechanisms, or reframing techniques that the user can apply. Avoid generic platitudes. Your goal is to provide real value and insight.
  5.  **Maintain a Compassionate and Professional Tone:** Your tone should always be supportive, non-judgmental, and encouraging.
`,
  prompt: `Therapy Style: {{{therapyStyle}}}
User Input: {{{userInput}}}
`,
});

const personalizeTherapyStyleFlow = ai.defineFlow(
  {
    name: 'personalizeTherapyStyleFlow',
    inputSchema: PersonalizeTherapyStyleInputSchema,
    outputSchema: PersonalizeTherapyStyleOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
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
