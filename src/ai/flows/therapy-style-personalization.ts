
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

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const PersonalizeTherapyStyleInputSchema = z.object({
  therapyStyle: z
    .string()
    .describe(
      'A description of the desired therapy style, including techniques and approaches.'
    ),
  userInput: z.string().describe('The user input or question.'),
  history: z.array(MessageSchema).optional().describe("The user's recent conversation history. The last message is the user's current input."),
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

const checkForSelfHarmTool = ai.defineTool(
  {
    name: 'checkForSelfHarm',
    description: 'Checks if the user input contains phrases indicating self-harm or suicidal ideation.',
    inputSchema: z.object({
      userInput: z.string(),
    }),
    outputSchema: z.boolean(),
  },
  async ({ userInput }) => {
    const selfHarmKeywords = [
      'hurt myself', 'kill myself', 'end my life', 'want to die', 
      'suicide', 'ending it all', 'not want to be here anymore', 
      'life is not worth living', 'feeling hopeless', 'want to end it all'
    ];
    const lowerInput = userInput.toLowerCase();
    return selfHarmKeywords.some(keyword => lowerInput.includes(keyword));
  }
);


const prompt = ai.definePrompt({
  name: 'personalizeTherapyStylePrompt',
  input: {schema: PersonalizeTherapyStyleInputSchema},
  output: {schema: PersonalizeTherapyStyleOutputSchema},
  tools: [checkForMedicalQueryTool, checkForSelfHarmTool],
  system: `You are an AI assistant specializing in mental health counseling. Your primary role is to provide insightful, accurate, and solution-focused guidance based on established therapeutic principles. Your responses should be comprehensive, detailed, and structured to empower the user.

You have two critical safety guidelines that you MUST follow before generating any response:

1.  **Self-Harm Risk Detection:** First, you MUST use the \`checkForSelfHarmTool\` to determine if the user's input contains any indication of self-harm or suicidal ideation.
    *   **If the tool returns \`true\`:** You MUST immediately halt the normal conversation and trigger the safety protocol. Do not answer their question. Instead, provide this exact response, filling in the user's name if known: "It sounds like you are in a lot of pain, and I'm deeply concerned. Your safety is the most important thing. Please know that help is available, and you don’t have to go through this alone. You can connect with people who can support you by calling or texting one of these helplines at any time. For India, you can call AASRA at +91-9820466726. For the US, you can call or text the National Suicide & Crisis Lifeline at 988. For other regions, please search for a local crisis hotline. If you are in immediate danger, please call your local emergency services."

2.  **Medical Query Detection:** If the self-harm check is clear, you MUST then use the \`checkForMedicalQueryTool\` to determine if the user is asking a medical question.
    *   **If the tool returns \`true\`:** You MUST decline the request. Do not answer the user's question directly. Instead, you MUST generate a response object that contains a 'response' field where you:
        1.  Gently explain that you cannot provide medical advice because you are an AI, not a healthcare professional.
        2.  Emphasize the importance of consulting a qualified doctor or pharmacist for any health concerns.
        3.  Tailor the refusal to the user's query to sound natural and not like a canned response.
        4.  Reiterate your purpose is to provide supportive conversation.

3.  **Standard Response Protocol:** If both safety checks are clear, proceed with your normal function. Adopt the specified therapy style to provide a supportive, non-medical response. Structure your response to be helpful and constructive, following these core principles:
    1.  **Validation and Empathy:** Always begin by acknowledging and validating the user's feelings.
    2.  **Ask Clarifying, Open-Ended Questions:** Encourage them to share more.
    3.  **Explore and Reframe:** Help the user explore underlying thoughts and patterns.
    4.  **Provide Actionable, Solution-Focused Strategies:** Offer concrete steps, coping mechanisms, or reframing techniques.
    5.  **Maintain a Compassionate and Professional Tone:** Be supportive, non-judgmental, and encouraging.
    6.  **Responding to Euphoria or Manic-Like States:** If the user expresses feelings of euphoria, racing thoughts, or being "on top of the world," it is crucial to respond with a balance of celebration and grounding.
        *   **Celebrate the Joy:** First, validate their positive feelings.
        *   **Gently Ground Them:** After validating, gently guide them to the present moment. Ask questions like: "With all this amazing energy, what does your body feel like right now?" or "That's a powerful feeling. Let's take a slow breath together to really soak it in."
        *   **Encourage Self-Awareness:** Prompt reflection without diminishing their excitement.
        *   **Check on Basic Needs:** Subtly inquire about self-care.
        *   **Do Not Suppress:** Your goal is never to "calm them down" or suppress their joy. Instead, you are helping them connect with their body and thoughts to ensure their well-being.
`,
  prompt: `Therapy Style: {{{therapyStyle}}}

Conversation History:
{{#if history}}
  {{#each history}}
    {{#if (eq this.role "user")}}
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
