# Project Instructions

## Tech Stack
- **Framework**: Next.js 15.2.8 (App Router, Turbopack)
- **Language**: TypeScript 5.x (strict mode)
- **UI**: React 18, Tailwind CSS 3.4, ShadCN UI (default style, neutral base)
- **AI**: Genkit 1.8 with Google AI plugin
- **Data**: Firebase (conceptual/mocked), TanStack Query 5.x
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## Code Style
- Path aliases: `@/*` maps to `src/*` (see tsconfig.json)
- File naming: kebab-case for utility files, PascalCase for React components
- RSC enabled by default (see components.json `"rsc": true`)
- Component styling: `class-variance-authority` + `tailwind-merge` + `clsx`
- UI components installed via ShadCN (see `components.json` for aliases)

## Build & Run
- **Dev**: `npm run dev` (Turbopack, port 9002)
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Lint**: `npm run lint`
- **Type check**: `npm run typecheck`
- **Genkit dev**: `npm run genkit:dev`

## Project Structure
| Directory | Purpose |
|-----------|---------|
| `src/app/` | Next.js App Router routes and pages |
| `src/app/chat/` | AI Chat page (Student/Scholar modes) |
| `src/app/quran/` | Quran browser with Kanzul Iman translations |
| `src/app/hadith/` | Hadith browser |
| `src/app/tafsir/` | Tafsir browser |
| `src/app/fiqh/` | Fiqh content |
| `src/app/documents/` | Document management (PDF/text import) |
| `src/app/search/` | Intelligent AI search |
| `src/components/ui/` | ShadCN UI components |
| `src/components/layout/` | Layout components (Sidebar, Header) |
| `src/components/auth/` | Authentication components (mocked) |
| `src/ai/flows/` | Genkit AI flows (chat, search, summarization) |
| `src/ai/genkit.ts` | Genkit configuration |
| `src/contexts/` | React Context providers (Auth, Chat, Theme, Language) |
| `src/config/` | Site-wide config (navigation, site.ts) |
| `src/lib/` | Utilities (firebase.ts, translations.ts, utils.ts) |
| `src/types/` | TypeScript type definitions |
| `src/hooks/` | Custom React hooks |

## Conventions
- Commit style: Single commit history ("tahqeeq-ai") — no established convention yet
- Git workflow: Main branch only, no CI/CD configured
- Error handling: Client-side form validation via Zod, AI error handling in flows
- State management: React Context for global state (auth, chat, theme, language)
- Data fetching: TanStack Query for server state
- Environment: `.env.local` for Firebase config and `GOOGLE_API_KEY`

## Key Entry Points
- **Home page**: `src/app/page.tsx` (Chat interface)
- **AI Chat flow**: `src/ai/flows/tahqeeq-chat-flow.ts`
- **Intelligent search**: `src/ai/flows/intelligent-search.ts`
- **Document summarization**: `src/ai/flows/summarize-document.ts`
- **Translations**: `src/lib/translations.ts` (large translation dataset)

---------------------------------------------------------------

Onboarding Guide: Tahqeeq AI

  Overview

  Tahqeeq AI is a Next.js application for Islamic research, featuring AI-powered search, Quran/Hadith browsing, document management, and multi-lingual chat  
  with Student and Scholar modes.

  Tech Stack

  ┌───────────┬────────────────────────────────────┬────────────────────────┐
  │   Layer   │             Technology             │        Version         │
  ├───────────┼────────────────────────────────────┼────────────────────────┤
  │ Language  │ TypeScript                         │ 5.x (strict)           │
  ├───────────┼────────────────────────────────────┼────────────────────────┤
  │ Framework │ Next.js (App Router)               │ 15.2.8                 │
  ├───────────┼────────────────────────────────────┼────────────────────────┤
  │ UI        │ React + ShadCN + Tailwind CSS      │ 18.x / 3.4             │
  ├───────────┼────────────────────────────────────┼────────────────────────┤
  │ AI        │ Genkit + Google AI                 │ 1.8.0                  │
  ├───────────┼────────────────────────────────────┼────────────────────────┤
  │ Data      │ Firebase (mocked) + TanStack Query │ 11.8 / 5.x             │
  ├───────────┼────────────────────────────────────┼────────────────────────┤
  │ Forms     │ React Hook Form + Zod              │ 7.54 / 3.24            │
  ├───────────┼────────────────────────────────────┼────────────────────────┤
  │ Build     │ Turbopack                          │ (bundled with Next.js) │
  └───────────┴────────────────────────────────────┴────────────────────────┘

  Architecture

  - Pattern: Full-stack Next.js with App Router, RSC enabled
  - Frontend/Backend: Unified Next.js app with API routes via Genkit flows
  - State: React Context (auth, chat, theme, language) + TanStack Query for server state
  - AI Layer: Genkit flows in src/ai/flows/ — chat, search, document summarization

  Key Entry Points

  - Home/Chat: src/app/page.tsx → src/app/chat/ (AI chat with mode selection)
  - Quran Browser: src/app/quran/ + src/app/quran/ — text, translations, recitations
  - Hadith Browser: src/app/hadith/
  - AI Flows: src/ai/flows/tahqeeq-chat-flow.ts, intelligent-search.ts, summarize-document.ts
  - Config: next.config.ts, tailwind.config.ts, src/config/site.ts

  Directory Map

  ┌────────────────────────┬───────────────────────────────────────────────────────────────────────┐
  │       Directory        │                                Purpose                                │
  ├────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ src/app/               │ Next.js routes (chat, quran, hadith, tafsir, fiqh, documents, search) │
  ├────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ src/components/ui/     │ ShadCN UI components                                                  │
  ├────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ src/components/layout/ │ Sidebar, Header layout components                                     │
  ├────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ src/ai/flows/          │ Genkit AI flows                                                       │
  ├────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ src/contexts/          │ AuthContext, ChatContext, ThemeProvider, LanguageContext              │
  ├────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ src/lib/               │ firebase.ts, translations.ts, utils.ts                                │
  ├────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ src/config/            │ site.ts (navigation, site config)                                     │
  ├────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ src/types/             │ TypeScript type definitions                                           │
  ├────────────────────────┼───────────────────────────────────────────────────────────────────────┤
  │ src/hooks/             │ Custom React hooks                                                    │
  └────────────────────────┴───────────────────────────────────────────────────────────────────────┘

  Request Lifecycle (AI Chat)

  1. User submits message in src/app/chat/ page
  2. ChatContext (src/contexts/chat-context.tsx) manages state
  3. Genkit flow src/ai/flows/tahqeeq-chat-flow.ts processes the request
  4. Google AI API responds via Genkit plugin
  5. Response rendered in chat UI with Student/Scholar mode formatting

  Conventions

  - File naming: PascalCase for components, kebab-case for utilities
  - Path aliases: @/* → src/*
  - Styling: Tailwind classes + cn() utility (clsx + tailwind-merge)
  - Components: ShadCN patterns with class-variance-authority
  - Commit style: Not yet established (single commit: "tahqeeq-ai")
  - No test runner configured yet

  Common Tasks

  - Run dev server: npm run dev (port 9002, Turbopack)
  - Build: npm run build
  - Lint: npm run lint
  - Type check: npm run typecheck
  - Genkit dev: npm run genkit:dev
  - Add ShadCN component: npx shadcn@latest add <component>

  Where to Look

  ┌────────────────────────┬───────────────────────────────┐
  │      I want to...      │          Look at...           │
  ├────────────────────────┼───────────────────────────────┤
  │ Add an AI feature      │ src/ai/flows/                 │
  ├────────────────────────┼───────────────────────────────┤
  │ Add a page/route       │ src/app/ (Next.js App Router) │
  ├────────────────────────┼───────────────────────────────┤
  │ Add a UI component     │ src/components/ui/ (ShadCN)   │
  ├────────────────────────┼───────────────────────────────┤
  │ Change site config/nav │ src/config/site.ts            │
  ├────────────────────────┼───────────────────────────────┤
  │ Add translations       │ src/lib/translations.ts       │
  ├────────────────────────┼───────────────────────────────┤
  │ Modify auth logic      │ src/contexts/auth-context.tsx │
  ├────────────────────────┼───────────────────────────────┤
  │ Change chat behavior   │ src/contexts/chat-context.tsx │
  └────────────────────────┴───────────────────────────────┘
