
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Edit3, Info } from "lucide-react";

export default function BookmarksAndNotesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <Bookmark className="mr-3 h-8 w-8 text-primary" /> Bookmarks & Notes (Under Development)
          </CardTitle>
          <CardDescription>
            Manage your bookmarked references and personal notes from across Tahqeeq Assistant.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-8 border border-border/30 rounded-lg bg-background/30">
            <div className="flex justify-center items-center gap-4 mb-6">
                <Bookmark className="h-20 w-20 text-muted-foreground" />
                <Edit3 className="h-16 w-16 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-3">Your Personal Study Hub</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This section will allow you to easily access and organize all your saved content and thoughts. Planned features include:
            </p>
            <ul className="list-disc list-inside text-left text-muted-foreground space-y-2 max-w-lg mx-auto mb-8">
              <li className="flex items-start">
                <Bookmark className="h-5 w-5 text-sky-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>View all bookmarked Quran ayahs, Hadith, chat messages, and library documents.</span>
              </li>
              <li className="flex items-start">
                <Edit3 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Create, edit, and manage personal notes, potentially linked to specific references.</span>
              </li>
              <li className="flex items-start">
                <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Filter and search through your bookmarks and notes.</span>
              </li>
               <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mr-2 mt-0.5 flex-shrink-0">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>
                </svg>
                <span>Local storage with cloud synchronization (Firebase Firestore) for persistence across devices.</span>
              </li>
            </ul>
            <p className="text-sm text-accent">
              Keep an eye out for this powerful organizational tool!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
