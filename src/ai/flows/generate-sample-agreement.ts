'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSampleAgreementInputSchema = z.object({
  title: z.string().describe('The title of the legal agreement to generate.'),
});

export type GenerateSampleAgreementInput = z.infer<
  typeof GenerateSampleAgreementInputSchema
>;

const GenerateSampleAgreementOutputSchema = z.object({
  agreementText: z
    .string()
    .describe('The full text of the generated sample legal agreement.'),
});

export type GenerateSampleAgreementOutput = z.infer<
  typeof GenerateSampleAgreementOutputSchema
>;

export async function generateSampleAgreement(
  input: GenerateSampleAgreementInput
): Promise<GenerateSampleAgreementOutput> {
  return generateSampleAgreementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSampleAgreementPrompt',
  input: { schema: GenerateSampleAgreementInputSchema },
  output: { schema: GenerateSampleAgreementOutputSchema },
  prompt: `You are an expert legal assistant. Your job is to generate a sample legal agreement based on the provided title. The agreement should be suitable for use in India and include typical clauses and placeholder text.

Title: {{{title}}}

Generate the full text of the sample agreement.`,
});

const generateSampleAgreementFlow = ai.defineFlow(
  {
    name: 'generateSampleAgreementFlow',
    inputSchema: GenerateSampleAgreementInputSchema,
    outputSchema: GenerateSampleAgreementOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
