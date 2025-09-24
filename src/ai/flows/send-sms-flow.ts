
'use server';

/**
 * @fileOverview An AI agent that constructs and sends an emergency SMS using Twilio.
 *
 * - sendSms - A function that constructs the SMS and sends it.
 * - SendSmsInput - The input type for the sendSms function.
 * - SendSmsOutput - The return type for the sendSms function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { SendSmsInputSchema, SendSmsOutputSchema } from '../schemas';
import type { SendSmsInput, SendSmsOutput } from '../schemas';

export { type SendSmsInput, type SendSmsOutput };

export async function sendSms(input: SendSmsInput): Promise<SendSmsOutput> {
  return sendSmsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sendSmsPrompt',
  input: { schema: SendSmsInputSchema },
  output: { schema: z.object({ message: z.string() }) },
  prompt: `Generate a concise, 4 to 5-line SMS message to be sent to an emergency contact. The user, {{userName}}, is having a mental health crisis and may be considering self-harm. The message should be calm, clear, and urgent. It must state that {{userName}} is going through a difficult time and encourage the contact to reach out to them immediately. It must also state that this is an automated message from the CounselAI app. Do not include any phone numbers or links.`,
});

const sendSmsFlow = ai.defineFlow(
  {
    name: 'sendSmsFlow',
    inputSchema: SendSmsInputSchema,
    outputSchema: SendSmsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);

      if (!output || !output.message) {
        throw new Error('AI failed to generate an SMS message.');
      }

      // This is a simulation. In a real application, you would integrate
      // an SMS service like Twilio here.
      console.log('==================================================');
      console.log('EMERGENCY SMS SIMULATION');
      console.log(`Intended recipient: ${input.emergencyContactPhone}`);
      console.log(`Message: ${output.message}`);
      console.log('==================================================');

      return {
        success: true,
        message: output.message,
      };
    } catch (error) {
      console.error('Error in sendSmsFlow:', error);
      return {
        success: false,
        message: 'Failed to construct or send SMS.',
      };
    }
  }
);
