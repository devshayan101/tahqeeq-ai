
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, History, BellRing, Info } from "lucide-react";

export default function IslamicCalendarPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <CalendarDays className="mr-3 h-8 w-8 text-primary" /> Islamic Calendar (Under Development)
          </CardTitle>
          <CardDescription>
            Stay updated with key Islamic dates, events, and prayer times, enriched with historical context.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-8 border border-border/30 rounded-lg bg-background/30">
            <CalendarDays className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">Track Important Islamic Events</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This feature will provide a comprehensive Islamic calendar. We plan to include:
            </p>
            <ul className="list-disc list-inside text-left text-muted-foreground space-y-2 max-w-lg mx-auto mb-8">
              <li className="flex items-start">
                <Info className="h-5 w-5 text-sky-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Integration with Aladhan API for accurate prayer times and Hijri dates.</span>
              </li>
              <li className="flex items-start">
                <CalendarDays className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Display of key Islamic dates (e.g., Ramadan, Eid, significant historical events).</span>
              </li>
              <li className="flex items-start">
                <History className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Historical context and significance of important Islamic events.</span>
              </li>
              <li className="flex items-start">
                <BellRing className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Reminders for important dates and prayer times.</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mr-2 mt-0.5 flex-shrink-0"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                <span>A home screen widget for quick view of Islamic date and upcoming events (conceptual for web).</span>
              </li>
            </ul>
            <p className="text-sm text-accent">
              Look forward to a feature-rich Islamic calendar experience!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
