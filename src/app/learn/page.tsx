
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookCheck, Brain, Award, Lightbulb, Milestone } from "lucide-react";
import Link from "next/link";

interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  tags: string[];
  status: "not_started" | "in_progress" | "completed";
  badgeToEarn?: string;
  lessonsCount: number;
}

const modules: LearningModule[] = [
  {
    id: "hanafi-fiqh-basics",
    title: "Basics of Hanafi Fiqh",
    description: "Understand the fundamental principles and rulings of Hanafi jurisprudence. Covers topics like Taharah, Salah, and Sawm.",
    icon: BookCheck,
    tags: ["Fiqh", "Hanafi", "Beginner"],
    status: "not_started",
    badgeToEarn: "Fiqh Fundamentals Badge",
    lessonsCount: 12,
  },
  {
    id: "understanding-tasawwuf",
    title: "Introduction to Tasawwuf",
    description: "Explore the core concepts of Islamic spirituality, including the purification of the heart and the path to Ihsan.",
    icon: Brain, // Using Brain as a proxy for spiritual intellect
    tags: ["Tasawwuf", "Spirituality", "Introductory"],
    status: "in_progress",
    badgeToEarn: "Sufi Explorer Badge",
    lessonsCount: 8,
  },
  {
    id: "arabic-grammar-essentials",
    title: "Learning Arabic Grammar (Nahw & Sarf)",
    description: "Grasp the essentials of Arabic grammar to better understand the Quran and Hadith. Covers basic Nahw (syntax) and Sarf (morphology).",
    icon: Lightbulb, // Represents learning/understanding
    tags: ["Arabic", "Grammar", "Language"],
    status: "not_started",
    badgeToEarn: "Arabic Grammarian Badge",
    lessonsCount: 20,
  },
   {
    id: "seerat-prophet-muhammad",
    title: "The Life of Prophet Muhammad (ﷺ)",
    description: "A comprehensive study of the Seerah, covering key events, teachings, and the exemplary character of the Prophet.",
    icon: Milestone, // Represents life journey/milestones
    tags: ["Seerat", "Prophetic Biography", "History"],
    status: "completed",
    badgeToEarn: "Seerah Scholar Badge",
    lessonsCount: 15,
  }
];

export default function LearningModulesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <Award className="mr-3 h-8 w-8 text-primary" /> Learning Modules
          </CardTitle>
          <CardDescription>
            Interactive lessons, quizzes, and badges to enhance your Islamic knowledge. Personalized by AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Dive into structured learning paths. AI will suggest modules based on your chat history and progress. (Personalization coming soon!)
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id} className="glass-card shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <module.icon className="h-10 w-10 text-accent" />
                {module.status === "completed" && <Badge variant="default">Completed</Badge>}
                {module.status === "in_progress" && <Badge variant="secondary">In Progress</Badge>}
                {module.status === "not_started" && <Badge variant="outline">Not Started</Badge>}
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription className="text-sm line-clamp-3 h-[3.75rem]">{module.description}</CardDescription> {/* Approx 3 lines */}
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2 mb-3">
                {module.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
              </div>
              <p className="text-xs text-muted-foreground">Lessons: {module.lessonsCount}</p>
              {module.badgeToEarn && <p className="text-xs text-muted-foreground">Earn: <Award className="inline h-3 w-3 mr-1 text-yellow-500"/>{module.badgeToEarn}</p>}
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                {/* This link would ideally go to a specific module page e.g., /learn/[moduleId] */}
                <Link href={`/learn/#${module.id}`}> 
                  {module.status === "completed" ? "Review Module" : (module.status === "in_progress" ? "Continue Learning" : "Start Module")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Card className="glass-card shadow-xl mt-8">
        <CardHeader>
            <CardTitle className="text-xl">More Coming Soon!</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                We are continuously developing new learning modules covering a wide range of Islamic sciences. Stay tuned for updates on topics like advanced Fiqh, Usul al-Hadith, Tafsir principles, and more.
                Quizzes and detailed progress tracking are also under development.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
