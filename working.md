# Tahqeeq AI - How It Works

## 1. Overview
Tahqeeq AI is a specialized Islamic research assistant designed for the Ahl-e-Sunnat wal Jamaat tradition. It combines modern web technologies with advanced AI to provide authenticated research, intelligent search, and a comprehensive digital library of Islamic knowledge.

## 2. Core Technology Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) - Handles the UI, routing, and server-side logic.
- **AI Engine**: [Google Genkit](https://firebase.google.com/docs/genkit) - Orchestrates AI flows using Gemini 2.0 Flash.
- **Database & Auth**: [Firebase](https://firebase.google.com/) - Manages user authentication and persistent data (Firestore).
- **State Management**: [TanStack Query](https://tanstack.com/query) for server state and React Context API for local app state (Auth, Chat, Language).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/UI](https://ui.shadcn.com/) for premium, responsive design.

## 3. Key Subsystems

### A. AI Research (Tahqeeq Chat)
The heart of the application is the `tahqeeqChatFlow` located in `src/ai/flows/tahqeeq-chat-flow.ts`.
- **Modes**: Supports `student` (concise) and `scholar` (detailed) modes.
- **Source Prioritization**: Strictly prioritizes authentic Sunni Hanafi (Barelvi) sources like *Kanzul Iman*, *Fatawa Rizwiya*, and *Bahar-e-Shariat*.
- **Multi-lingual**: Automatically detects and responds in English, Urdu, Arabic, Hindi, or Roman Urdu.
- **Adab-Centric**: Built-in instructions ensure the AI maintains a respectful and scholarly tone.

### B. Virtual Library (Documents)
Users can upload documents which are then processed by Genkit flows:
- **`summarize-document.ts`**: Generates intelligent summaries of uploaded texts.
- **`intelligent-search.ts`**: Enables semantic searching across Islamic content.

### C. Content Modules
The app organizes Islamic knowledge into specialized routes:
- `/quran` & `/ar-quran`: Dynamic Quran reader with translations and transliterations.
- `/hadith`: Searchable collection of prophetic traditions.
- `/tafsir` & `/fiqh`: Deep research modules for interpretation and jurisprudence.

### D. Localization System
Managed via `src/contexts/language-context.tsx` and `src/lib/translations.ts`. It allows the entire UI to switch between multiple languages, including Right-to-Left (RTL) support for Urdu and Arabic.

## 4. User Workflow
1. **Authentication**: Users sign in via Firebase Auth (`src/contexts/auth-context.tsx`).
2. **Interaction**: Users ask research questions in the Chat interface.
3. **Processing**: The request is sent to a server action which executes the Genkit `tahqeeqChatFlow`.
4. **Response**: The AI processes the query using its internal knowledge and specific source constraints, returning a structured response with citations.
5. **Retention**: Conversations are managed in `src/contexts/chat-context.tsx` and can be saved to history.

## 5. Deployment & Development
- **Dev Server**: `bun run dev` (Runs on port 9002).
- **Genkit UI**: `bun run genkit:dev` (For testing and debugging AI flows).
- **Build**: `bun run build` for production-ready Next.js bundle.
