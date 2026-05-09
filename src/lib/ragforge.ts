
export interface RagForgeQueryInput {
  versionId: number;
  message: string;
  systemPrompt?: string;
}

export interface RagForgeSource {
  documentId: number;
  documentName: string;
  pageNo: number;
  text: string;
}

export interface RagForgeQueryOutput {
  response: string;
  sources: RagForgeSource[];
  tokensUsed: number;
}

export async function queryRagForge(input: RagForgeQueryInput): Promise<RagForgeQueryOutput> {
  const baseUrl = process.env.RAGFORGE_API_URL || "http://localhost:3000/api/trpc";
  const apiKey = process.env.RAGFORGE_API_KEY;

  if (!apiKey) {
    throw new Error("RAGFORGE_API_KEY is not set in environment variables.");
  }

  const url = `${baseUrl}/chat.query`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({
      json: {
        versionId: input.versionId,
        message: input.message,
        systemPrompt: input.systemPrompt,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RagForge API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  // tRPC response structure with SuperJSON is { result: { data: { json: ... } } }
  if (data.error) {
    throw new Error(`RagForge tRPC error: ${JSON.stringify(data.error)}`);
  }

  const resultData = data.result?.data;
  const finalData = resultData?.json || resultData;

  if (!finalData) {
    throw new Error("RagForge returned an empty response.");
  }

  return finalData as RagForgeQueryOutput;
}
