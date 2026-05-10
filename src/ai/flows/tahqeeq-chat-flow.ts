
'use server';
/**
 * @fileOverview Implements the Tahqeeq AI chat flow with Scholar and Student modes.
 *
 * - tahqeeqChat - A function that handles the chat interaction.
 * - TahqeeqChatInput - The input type for the tahqeeqChat function.
 * - TahqeeqChatOutput - The return type for the tahqeeqChat function.
 * - ChatReference - The type for chat references.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { queryRagForge } from '@/lib/ragforge';

const ChatReferenceSchema = z.object({
  book: z.string().describe("Name of the book cited."),
  volume: z.string().optional().describe("Volume number, if applicable."),
  page: z.string().optional().describe("Page number, if applicable."),
  otherDetails: z.string().optional().describe("Any other relevant details like Hadith number, verse number, chapter, etc.")
});
export type ChatReference = z.infer<typeof ChatReferenceSchema>;

const TahqeeqChatInputSchema = z.object({
  query: z.string().describe('The user_s question or prompt. Can be in English, Urdu, Arabic, Hindi, or Roman Urdu.'),
  mode: z.enum(['student', 'scholar']).describe('The desired mode for the AI_s response: "student" for simple answers, "scholar" for detailed answers.'),
  queryLanguageHint: z.string().optional().describe("Optional hint for the query language if known (e.g., 'en', 'ur', 'ar', 'hi', 'roman-ur'). AI will attempt to auto-detect if not provided.")
});
export type TahqeeqChatInput = z.infer<typeof TahqeeqChatInputSchema>;

const TahqeeqChatOutputSchema = z.object({
  answer: z.string().describe("The AI's generated answer to the query, formatted with requested headings and language matching the query."),
  references: z.array(ChatReferenceSchema).describe("A list of references supporting the answer. Can be empty if no specific references are applicable or found."),
  modeUsed: z.enum(['student', 'scholar']).describe("The mode in which the answer was generated, confirming the input mode."),
  detectedQueryLanguage: z.string().optional().describe("The language detected for the user's query (e.g., 'en', 'ur', 'ar', 'hi', 'roman-ur').")
});
export type TahqeeqChatOutput = z.infer<typeof TahqeeqChatOutputSchema>;

export async function tahqeeqChat(input: TahqeeqChatInput): Promise<TahqeeqChatOutput> {
  return tahqeeqChatFlow(input);
}

const basePromptInstructions = `
You are Tahqeeq Assistant, an AI specializing in Islamic research from an Ahl-e-Sunnat wal Jamaat (Sunni Hanafi, particularly Barelvi/Ahlus Sunnah) perspective.
Your responses MUST embody Adab (respect), Mohabbat (love), and complete adherence to Sharia.

Language Analysis and Response:
1.  **Detect Query Language**: Carefully analyze the user's query to determine its primary language. Consider:
    *   **Script**: Perso-Arabic (for Arabic, Urdu), Devanagari (for Hindi), Latin (for English, Roman Urdu).
    *   **Vocabulary and Grammar**: Identify common words and sentence structures characteristic of English, Urdu, Arabic, Hindi.
    *   **Roman Urdu**: If the script is Latin but includes common Urdu/Hindi words (e.g., 'kya', 'aap', 'masjid', 'jawab'), transliterated phrases, or a mix of English and Urdu/Hindi, treat it as Roman Urdu.
    *   The \`queryLanguageHint\` ({{{queryLanguageHint}}}) provided is a basic hint from the system; use your advanced understanding to make the final determination.
2.  **Set \`detectedQueryLanguage\`**: Populate the \`detectedQueryLanguage\` field in your output schema with one of the following codes: 'en' (English), 'ur' (Urdu), 'ar' (Arabic), 'hi' (Hindi), 'roman-ur' (Roman Urdu). If detection is genuinely ambiguous after analysis, you may default to 'en'.
3.  **Respond in Detected Language**: Generate your entire answer, including all headings, in the SAME language you detected for the query.
4.  **Roman Urdu Transliteration**: If the detected query language is 'roman-ur', your entire response MUST be in Roman Urdu (a Latin script transliteration of Urdu).

Source Prioritization & Referencing:
ALWAYS prioritize authentic Ahl-e-Sunnat wal Jamaat (Sunni Hanafi Barelvi) sources.
- Quran Translation (Urdu): If an Urdu Quran translation is requested or relevant, prioritize "Kanzul Iman" by Aala Hazrat Imam Ahmad Raza Khan.
- Fiqh: Fatawa Rizwiya Shareef, Jaddul Mumtar Shareef, Bahar-e-Shariat, Fatawa Alamgiri.
- Tasawwuf: Sirr-ul-Asrar, Ihya Uloomuddin (Sunni interpretations).
- Hadith: Siha Sitta (authentic narrations and interpretations by Sunni scholars), Riyad-us-Saliheen.
- Tafsir: Tafseer-e-Jalalain (with authentic Sunni commentary, preferably Hashiya al-Sawi), Tafsir-e-Naeemi.
- Ilm-e-Nahw: Nahw Mir (for grammatical context if query relates to Arabic linguistics).
- Seerat: Seerah Ibn Hisham (Sunni perspectives).
STRICTLY EXCLUDE interpretations or sources from Deobandi, Wahabi, Salafi, Rafzi (Shia), and Ahl-e-Hadees schools of thought. If a query seems to lead towards these, politely guide back to Ahl-e-Sunnat sources or state that addressing it from other perspectives is outside your scope.
Provide precise references for every answer whenever possible using a consistent citation style: "Book Name, Vol. X, Page Y, [Other details e.g., Hadith/Verse No. Z, Chapter C]". If precise details are not available from your knowledge, cite what you can (e.g., "Book Name").

Answer Formatting:
Structure your response clearly. Your response in the 'answer' field of the output MUST include the following headings, **wrapped in HTML <strong> tags for bolding**, in the language of the response:
- English: "<strong>Question:</strong>", "<strong>Answer:</strong>", "<strong>Reference(s):</strong>" (or "<strong>Reference:</strong>" if singular)
- Urdu: "<strong>سوال:</strong>", "<strong>جواب:</strong>", "<strong>حوالہ جات:</strong>" (or "<strong>حوالہ:</strong>" if singular)
- Arabic: "<strong>سؤال:</strong>", "<strong>جواب:</strong>", "<strong>مراجع:</strong>" (or "<strong>مرجع:</strong>" if singular)
- Hindi: "<strong>प्रश्न:</strong>", "<strong>उत्तर:</strong>", "<strong>संदर्भ:</strong>"
- Roman Urdu: "<strong>Sawaal:</strong>", "<strong>Jawaab:</strong>", "<strong>Hawaala/Hawaaley:</strong>" (or "<strong>Hawaala:</strong>" if singular)

Follow each heading with the corresponding content. For example:
<strong>Question:</strong> [User's question restated or summarized]
<strong>Answer:</strong> [Your detailed answer]
<strong>Reference(s):</strong> [List of references]

References (the actual list of cited works) should be clearly listed under the "<strong>Reference(s):</strong>" heading (or its equivalent in other languages) within the 'answer' field. The separate 'references' array in the output schema is for structured data if you can extract it.
Ensure that the only HTML tags you use are <strong> for these specific headings and for no other purpose. Do not use Markdown for bolding or any other formatting.

User-Uploaded Documents:
If the user's query references a document they claim to have uploaded (e.g., "According to the PDF I provided...", "In the book I uploaded...", "From page 10 of my uploaded text..."), acknowledge this possibility in your response. State that you don't have direct access to their specific uploaded files but can discuss the topic based on your general knowledge or other available authentic sources. Do not attempt to fabricate content or references from a document you haven't seen. You can offer to summarize or discuss general concepts if they provide the text from the document.
`;

const studentPromptTemplate = `
${basePromptInstructions}

The user is a student or general user seeking simple, concise, and easy-to-understand answers.
Avoid overly academic jargon. Focus on clarity.
Provide answers based on authentic sources. Whenever possible, cite 1-2 key references clearly.

User's query: {{{query}}}
`;

const scholarPromptTemplate = `
${basePromptInstructions}

The user is a scholar or advanced researcher seeking detailed, comprehensive, and nuanced answers.
Include thorough research, explanations of different viewpoints within the Ahl-e-Sunnat tradition if relevant, and historical context where appropriate.
Cite multiple references extensively, aiming for primary sources when possible. Ensure references are precise (book, volume, page).

User's query: {{{query}}}
`;


const chatPrompt = ai.definePrompt({
  name: 'tahqeeqChatPrompt',
  input: {schema: TahqeeqChatInputSchema},
  output: {schema: TahqeeqChatOutputSchema},
  prompt: (input) => {
    const effectiveQueryLanguageHint = input.queryLanguageHint || 'unknown';

    if (input.mode === 'scholar') {
      return [
        {
          text: scholarPromptTemplate
            .replace('{{{queryLanguageHint}}}', effectiveQueryLanguageHint)
            .replace('{{{query}}}', input.query),
        },
      ];
    }
    return [
      {
        text: studentPromptTemplate
          .replace('{{{queryLanguageHint}}}', effectiveQueryLanguageHint)
          .replace('{{{query}}}', input.query),
      },
    ];
  },
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const tahqeeqChatFlow = ai.defineFlow(
  {
    name: 'tahqeeqChatFlow',
    inputSchema: TahqeeqChatInputSchema,
    outputSchema: TahqeeqChatOutputSchema,
  },
  async (input) => {
    const ragApiKey = process.env.RAGFORGE_API_KEY;
    const ragVersionId = process.env.RAGFORGE_VERSION_ID ? parseInt(process.env.RAGFORGE_VERSION_ID) : undefined;
    const disableGenkit = process.env.DISABLE_GENKIT === 'true';

    if (ragApiKey && ragVersionId) {
      try {
        console.log(`ChatProvider: Using RagForge for query: "${input.query}" (Version: ${ragVersionId})`);
        
        // Detect language locally for UI consistency
        let detectedLanguage = input.queryLanguageHint || 'en';
        if (/[ء-ي]/.test(input.query)) detectedLanguage = 'ar';
        else if (/[\u0600-\u06FF]/.test(input.query)) detectedLanguage = 'ur';
        
        // Prepare system prompt for RagForge
        const systemPromptTemplate = input.mode === 'scholar' ? scholarPromptTemplate : studentPromptTemplate;
        const finalSystemPrompt = systemPromptTemplate
          .replace('{{{queryLanguageHint}}}', detectedLanguage)
          .replace('User\'s query: {{{query}}}', ""); // Remove this as RagForge adds it in user message

        const ragResult = await queryRagForge({
          versionId: ragVersionId,
          message: input.query,
          systemPrompt: finalSystemPrompt
        });

        return {
          answer: ragResult.response,
          references: (ragResult.sources || []).map(s => ({
            book: s.documentName,
            page: (s.pageNo || 0).toString(),
            otherDetails: (s.text || "").substring(0, 100) + "..."
          })),
          modeUsed: input.mode,
          detectedQueryLanguage: detectedLanguage
        };
      } catch (error) {
        console.error("RagForge integration error:", error);
        if (disableGenkit) {
          return {
            answer: "<strong>Error:</strong> RagForge query failed and Genkit is disabled. Please check your configuration or try again later.",
            references: [],
            modeUsed: input.mode,
            detectedQueryLanguage: input.queryLanguageHint || 'en'
          };
        }
        // Fallback to normal flow if RagForge fails and Genkit is NOT disabled
      }
    } else if (disableGenkit) {
      return {
        answer: "<strong>Error:</strong> RagForge is not configured (missing API Key or Version ID) and Genkit is disabled.",
        references: [],
        modeUsed: input.mode,
        detectedQueryLanguage: input.queryLanguageHint || 'en'
      };
    }

    // If we reach here, either RagForge is not configured or it failed, AND Genkit is NOT disabled.
    const {output} = await chatPrompt(input);
    
    return {
        answer: output?.answer || "Sorry, I couldn't generate a response at this moment. Please ensure your query is clear and try again.",
        references: output?.references || [],
        modeUsed: input.mode,
        detectedQueryLanguage: output?.detectedQueryLanguage 
    };
  }
);

    

    