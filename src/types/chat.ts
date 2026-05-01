
import type { ChatReference } from "@/ai/flows/tahqeeq-chat-flow";

export type ChatMode = "student" | "scholar";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  references?: ChatReference[];
  mode: ChatMode;
  timestamp: string;
  isError?: boolean;
  detectedQueryLanguage?: string; // To store the language of the query or response
  domain?: string; // To store the selected knowledge domain for the user's query
}


    