// 'use server';
/**
 * @fileOverview Implements the intelligent search flow using Genkit.
 *
 * - intelligentSearch - A function that performs semantic searches on locally stored documents and texts.
 * - IntelligentSearchInput - The input type for the intelligentSearch function.
 * - IntelligentSearchOutput - The return type for the intelligentSearch function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentSearchInputSchema = z.object({
  query: z.string().describe('The natural language search query.'),
  documents: z.array(z.string()).describe('Array of locally stored documents to search through.'),
});
export type IntelligentSearchInput = z.infer<typeof IntelligentSearchInputSchema>;

const IntelligentSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      document: z.string().describe('The content of the document.'),
      relevanceScore: z.number().describe('The relevance score of the document to the query.'),
    })
  ).describe('The search results, sorted by relevance score.'),
});

export type IntelligentSearchOutput = z.infer<typeof IntelligentSearchOutputSchema>;

export async function intelligentSearch(input: IntelligentSearchInput): Promise<IntelligentSearchOutput> {
  return intelligentSearchFlow(input);
}

const intelligentSearchPrompt = ai.definePrompt({
  name: 'intelligentSearchPrompt',
  input: {schema: IntelligentSearchInputSchema},
  output: {schema: IntelligentSearchOutputSchema},
  prompt: `You are an AI assistant specializing in semantic search.

Given a user's natural language query and a list of documents, your task is to identify the documents that are most relevant to the query.

You should:
1.  Understand the semantic meaning of the query.
2.  Compare the query to each document in the list.
3.  Assign a relevance score to each document, indicating how well it matches the query. The score should be a number between 0 and 1, where 1 is a perfect match and 0 is no match.
4.  Return the documents sorted by their relevance scores in descending order.

Here's the user's query:
{{query}}

Here's the list of documents:
{{#each documents}}
- {{{this}}}
{{/each}}
`,
});

const intelligentSearchFlow = ai.defineFlow(
  {
    name: 'intelligentSearchFlow',
    inputSchema: IntelligentSearchInputSchema,
    outputSchema: IntelligentSearchOutputSchema,
  },
  async input => {
    const {output} = await intelligentSearchPrompt(input);
    return output!;
  }
);
