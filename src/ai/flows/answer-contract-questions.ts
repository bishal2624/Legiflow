'use server';
/**
 * @fileOverview This flow allows users to ask questions about a legal contract and receive clear answers.
 *
 * - answerContractQuestion - A function that takes a question and a contract and returns an answer.
 * - AnswerContractQuestionInput - The input type for the answerContractQuestion function.
 * - AnswerContractQuestionOutput - The return type for the answerContractQuestion function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
const AnswerContractQuestionInputSchema = z.object({
  contractText: z
    .string()
    .describe('The complete text of the legal contract to analyze.'),
  question: z.string().describe('The specific question about the contract.'),
});
export type AnswerContractQuestionInput = z.infer<
  typeof AnswerContractQuestionInputSchema
>;

const AnswerContractQuestionOutputSchema = z.object({
  answer: z
    .string()
    .describe(
      'A clear and concise answer to the question, in plain language.'
    ),
  confidence: z
    .number()
    .describe(
      'A confidence score (0-1) indicating the certainty of the answer.'
    ),
  sources: z
    .array(z.string())
    .describe(
      'Specific clauses or sections of the contract that support the answer.'
    ),
});
export type AnswerContractQuestionOutput = z.infer<
  typeof AnswerContractQuestionOutputSchema
>;
export async function answerContractQuestion(
  input: AnswerContractQuestionInput
): Promise<AnswerContractQuestionOutput> {
  return answerContractQuestionFlow(input);
}
const answerContractQuestionPrompt = ai.definePrompt({
  name: 'answerContractQuestionPrompt',
  input: {schema: AnswerContractQuestionInputSchema},
  output: {schema: AnswerContractQuestionOutputSchema},
  prompt: `You are an AI legal assistant with expertise in contract law and relevant government regulations. Your role is to answer questions about legal contracts, providing context based on applicable laws.

  Given the following legal contract and a question, provide a clear and concise answer in plain language. Your answer should incorporate relevant legal principles and cite specific government laws or regulations where applicable.
  Also, provide a confidence score (0-1) indicating the certainty of your answer and cite the specific clauses or sections of the contract that support your answer.
  Contract:
  {{contractText}}
  Question:
  {{question}}

  Answer:
  `,
});
const answerContractQuestionFlow = ai.defineFlow(
  {
    name: 'answerContractQuestionFlow',
    inputSchema: AnswerContractQuestionInputSchema,
    outputSchema: AnswerContractQuestionOutputSchema,
  },
  async input => {
    const {output} = await answerContractQuestionPrompt(input);
    return output!;
  }
);
