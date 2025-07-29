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
  prompt: `You are an AI assistant specializing in mental health counseling. You are to adopt a specific therapy style based on the user's defined preferences.

You are NOT a medical professional. Do not provide medical advice, diagnoses, or prescriptions under any circumstances.

Therapy Style: {{{therapyStyle}}}

User Input: {{{userInput}}}

Response:`,
});

const personalizeTherapyStyleFlow = ai.defineFlow(
  {
    name: 'personalizeTherapyStyleFlow',
    inputSchema: PersonalizeTherapyStyleInputSchema,
    outputSchema: PersonalizeTherapyStyleOutputSchema,
  },
  async (input) => {
    const isMedical = await checkForMedicalQueryTool(input);
    if (isMedical) {
      return {
        response: "I am an AI assistant and not a medical professional. I cannot provide medical advice, diagnoses, or prescriptions. For any health concerns, please consult a qualified healthcare provider. Your well-being is important."
      }
    }
    
    const {output} = await prompt(input);
    return output!;
  }
);
