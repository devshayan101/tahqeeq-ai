"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Users, Globe } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6">
            <Image
              src="https://placehold.co/150x150/16a34a/ffffff.png?text=SA" // Replace with actual Sawade Azam logo
              alt="Sawade Azam Logo"
              width={120}
              height={120}
              className="rounded-full shadow-lg border-4 border-primary/30"
              data-ai-hint="organization logo"
            />
          </div>
          <CardTitle className="flex items-center justify-center text-3xl font-bold">
            <Info className="mr-3 h-8 w-8 text-primary" /> About Sawade Azam
          </CardTitle>
          <CardDescription className="text-lg">
            Promoting the true teachings of Ahl-e-Sunnat wal Jamaat.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <ScrollArea className="h-[calc(100vh-28rem)] p-1">
            <section className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 p-4 rounded-lg bg-background/30 border border-border/30">
              <h2 className="text-2xl font-semibold text-primary flex items-center">
                <Users className="mr-2 h-6 w-6" /> Our Mission
              </h2>
              <p className="text-lg leading-relaxed">
                {/* PLEASE REPLACE THIS WITH CONTENT FROM WWW.SAWADEAZAM.ORG */}
                Welcome to Sawade Azam, an organization dedicated to upholding and propagating the pristine teachings of Islam as understood and practiced by the Ahl-e-Sunnat wal Jamaat, the largest group of Muslims, following the path of the Beloved Prophet Muhammad (peace and blessings be upon him), his noble companions, and the righteous predecessors (Salaf-e-Saliheen).
              </p>
              <p className="text-lg leading-relaxed">
                Our core mission is to provide authentic Islamic knowledge, foster spiritual growth, and serve the community in accordance with the Quran and Sunnah, as interpreted by the great Imams of Fiqh (especially Imam Abu Hanifa), Aqeedah, and Tasawwuf. We aim to counter misinterpretations and innovations while promoting unity, love, and respect within the Ummah.
              </p>
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                "The one who revives my Sunnah when my Ummah is corrupt will have the reward of a hundred martyrs." - (Mishkat al-Masabih)
              </blockquote>

              <h2 className="text-2xl font-semibold text-primary mt-8 flex items-center">
                <Globe className="mr-2 h-6 w-6" /> Our Vision
              </h2>
              <p className="text-lg leading-relaxed">
                {/* PLEASE REPLACE THIS WITH CONTENT FROM WWW.SAWADEAZAM.ORG */}
                We envision a world where the beautiful message of Islam, characterized by peace, compassion, and wisdom, shines brightly, guiding humanity towards righteousness and success in this life and the Hereafter. Through education, community service, and spiritual guidance, we strive to empower individuals to become exemplary Muslims who contribute positively to society.
              </p>
              <p className="text-lg leading-relaxed">
                Tahqeeq Assistant is a digital initiative by Sawade Azam to leverage technology for authentic Islamic research and learning, making reliable knowledge accessible to all seekers.
              </p>

              <h3 className="text-xl font-semibold text-accent mt-6">Contact & Support</h3>
              <p className="text-lg">
                For more information, to get involved, or to support our activities, please visit our official website:
                <a href="https://www.sawadeazam.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                   www.sawadeazam.org
                </a>
              </p>
               <p className="text-lg">
                To support our Dawah work and projects like Tahqeeq Assistant, please consider donating:
                <a href="https://sawadeazam.org/pe/" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline ml-1">
                   Donate Here
                </a>
              </p>
            </section>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}