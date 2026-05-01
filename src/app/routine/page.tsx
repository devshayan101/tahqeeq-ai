
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Target, Zap, BookOpen, HeartPulse, BarChart3 } from "lucide-react";

export default function DailyRoutinePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <CalendarClock className="mr-3 h-8 w-8 text-primary" /> Daily Islamic Routine (Under Development)
          </CardTitle>
          <CardDescription>
            A personalized planner for your spiritual practices, with AI-driven suggestions and progress tracking.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-8 border border-border/30 rounded-lg bg-background/30">
            <Target className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">Cultivate Your Spiritual Habits</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              This feature aims to help you organize and enhance your daily Islamic practices. Planned functionalities include:
            </p>
            <ul className="list-disc list-inside text-left text-muted-foreground space-y-2 max-w-lg mx-auto mb-8">
              <li className="flex items-start">
                <CalendarClock className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Prayer times based on your location.</span>
              </li>
              <li className="flex items-start">
                <BookOpen className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Customizable Quran reading goals with progress tracking.</span>
              </li>
              <li className="flex items-start">
                <HeartPulse className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Dhikr (remembrance) reminders and counters.</span>
              </li>
              <li className="flex items-start">
                <Zap className="h-5 w-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>AI-suggested tasawwuf practices and reflections based on your preferences and activity.</span>
              </li>
              <li className="flex items-start">
                <BarChart3 className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Progress tracker for your spiritual goals with motivational messages.</span>
              </li>
            </ul>
            <p className="text-sm text-accent">
              We're working hard to bring you this personalized daily routine planner!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
