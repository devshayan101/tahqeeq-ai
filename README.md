
# Tahqeeq AI

This is a NextJS application, "Tahqeeq AI", an AI-powered tool for Islamic research. It focuses on offline data presentation, intelligent search, and document management.

To get started, take a look at `src/app/page.tsx`.

## Features

-   **Dashboard**: Overview and quick navigation. (Now replaced by Chat as Home)
-   **Intelligent Search**: AI-powered semantic search through content.
-   **Document Management**: Import and summarize documents (PDFs, text).
-   **User Profile**: Basic profile customization, theme and font size settings.
-   **Authentication**: Mocked login/signup flow.
-   **AI Chat**: Multi-lingual chat with "Student" and "Scholar" modes.
-   **Chat History**: Locally stored chat history.
-   **Quran Browser**: Browse Surahs, read text, translations (Kanzul Iman default), and listen to recitations.
-   **Hadith Browser**: Explore Hadith collections with translations.
-   **Learning Modules**: Placeholder for interactive lessons.
-   **AR Quran (Conceptual)**: Placeholder demonstrating camera access for future AR features.
-   **Community Forum (Conceptual)**: Placeholder for community interaction.
-   **Daily Routine (Conceptual)**: Placeholder for personalized spiritual planning.
-   **Islamic Calendar (Conceptual)**: Placeholder for Hijri calendar and events.
-   **Virtual Library**: Manage and summarize personal digital documents.
-   **Audio Library (Conceptual)**: Placeholder for Islamic audio content.
-   **Bookmarks & Notes (Conceptual)**: UI placeholders for bookmarking content.
-   **About Page**: Information about Sawade Azam organization.
-   **Share Feature (Conceptual)**: Copy and share AI answers (PDF generation planned).

## Tech Stack

-   Next.js (App Router)
-   React
-   TypeScript
-   Tailwind CSS
-   ShadCN UI
-   Genkit for AI flows
-   Firebase (conceptual integration for auth/DB, currently mocked)

## Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Firebase project configuration and Google AI API Key:
    ```env
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id (optional, for Analytics)

    GOOGLE_API_KEY=your_google_ai_api_key
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

4.  **(Optional) Run Genkit development server (for AI flow testing/development):**
    ```bash
    npm run genkit:dev
    ```

## Project Structure

-   `src/app/`: Contains all the routes and pages.
-   `src/components/`: Reusable UI components.
    -   `src/components/layout/`: Layout specific components (Sidebar, Header, etc.).
    -   `src/components/auth/`: Authentication related components.
    -   `src/components/ui/`: ShadCN UI components.
-   `src/ai/`: Genkit AI flows and configuration.
    -   `src/ai/flows/`: Pre-implemented AI functionalities.
-   `src/contexts/`: React context providers (e.g., AuthContext, ThemeProvider).
-   `src/config/`: Site-wide configurations (e.g., navigation items).
-   `src/lib/`: Utility functions and Firebase setup.
-   `src/types/`: TypeScript type definitions.
-   `public/`: Static assets (including fonts).

## Future Enhancements (Conceptual / Planned)
-   Full PWA support with robust offline access to core texts, cached answers, chat history, audio library, and learning modules.
-   Cloud synchronization (e.g., using Firebase Firestore) for chat history, bookmarks, notes, and user preferences.
-   Advanced, AI-driven personalized notifications for reminders and content suggestions.
-   Direct integration and search capabilities for external libraries like Islamhouse, Open Library, Shamela.ws, Internet Archive, and Dawat-e-Islami (requires APIs or complex data ingestion).
-   AI-powered content summarization for specific non-uploaded books (requires RAG).
-   TensorFlow Lite integration for local AI model fine-tuning (highly complex).
-   Voice interaction (web-based speech APIs).
-   Full AR Quran experience (web-based AR).
-   Comprehensive 3D Virtual Islamic Library Tour (web-based 3D rendering).
-   Share-to-PDF feature with Sawade Azam branding.
