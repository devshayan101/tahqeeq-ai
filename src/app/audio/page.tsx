
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Music2, Download, PlayCircle, Podcast, Waves, Clock } from "lucide-react";
import Image from "next/image";

interface AudioItem {
  id: string;
  title: string;
  speakerOrReciter: string;
  category: "Quran Recitation" | "Hadith Lecture" | "Tasawwuf Lecture" | "Naat/Nasheed";
  duration: string; // e.g., "45:30"
  imageUrl?: string; // Optional image for the audio
  source: string; // e.g., "Al Quran Cloud", "Mock Data"
  description?: string;
}

const mockAudioLibrary: AudioItem[] = [
  {
    id: "quran_kanzul_iman_001",
    title: "Surah Al-Fatiha (Kanzul Iman Recitation)",
    speakerOrReciter: "Qari MockReciter",
    category: "Quran Recitation",
    duration: "01:30",
    imageUrl: "https://placehold.co/150x150/1abc9c/ffffff.png?text=Quran",
    dataAiHint: "holy quran",
    source: "Al Quran Cloud (Conceptual)",
    description: "Beautiful recitation of Surah Al-Fatiha with Kanzul Iman."
  },
  {
    id: "hadith_bukhari_ch1",
    title: "Introduction to Sahih Bukhari",
    speakerOrReciter: "Scholar MockName",
    category: "Hadith Lecture",
    duration: "55:20",
    imageUrl: "https://placehold.co/150x150/3498db/ffffff.png?text=Hadith",
    dataAiHint: "islamic teaching",
    source: "Mock Data",
    description: "An introductory lecture on the compilation and significance of Sahih Bukhari."
  },
  {
    id: "tasawwuf_sirr_asrar_01",
    title: "Exploring Sirr-ul-Asrar - Part 1",
    speakerOrReciter: "Sheikh MockSufi",
    category: "Tasawwuf Lecture",
    duration: "1:10:45",
    imageUrl: "https://placehold.co/150x150/9b59b6/ffffff.png?text=Tasawwuf",
    dataAiHint: "spiritual meditation",
    source: "Mock Data",
    description: "Deep dive into the secrets of spirituality from Sirr-ul-Asrar."
  },
  {
    id: "naat_nabi_ka_jashan",
    title: "Nabi Ka Jashan Aaya",
    speakerOrReciter: "NaatKhwan MockArtist",
    category: "Naat/Nasheed",
    duration: "07:15",
    imageUrl: "https://placehold.co/150x150/e67e22/ffffff.png?text=Naat",
    dataAiHint: "islamic praise",
    source: "Mock Data",
    description: "A melodious Naat celebrating the Prophet (ﷺ)."
  }
];


export default function AudioLibraryPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl font-bold">
            <Podcast className="mr-3 h-8 w-8 text-primary" /> Audio Library
          </CardTitle>
          <CardDescription>
            Listen to Quran recitations, Hadith lectures, Tasawwuf discussions, and Naats. Offline listening and playback controls are planned.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            This section will host a rich collection of Islamic audio content. Features like downloading for offline access, variable playback speeds, and creating playlists are planned for future updates.
          </p>
          {mockAudioLibrary.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <Music2 size={48} className="mx-auto mb-4" />
              <p className="text-lg">Audio library is currently empty.</p>
              <p>Content will be added soon.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {mockAudioLibrary.length > 0 && (
        <ScrollArea className="h-[calc(100vh-22rem)]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockAudioLibrary.map((item) => (
              <Card key={item.id} className="glass-card shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                <CardHeader className="relative p-0">
                  {item.imageUrl && (
                     <Image
                        src={item.imageUrl}
                        alt={item.title}
                        width={300}
                        height={200}
                        className="w-full h-40 object-cover rounded-t-lg"
                        data-ai-hint={item.dataAiHint || "audio cover"}
                      />
                  )}
                  <div className={`absolute bottom-0 left-0 right-0 p-4 rounded-b-lg bg-gradient-to-t from-black/80 to-transparent ${item.imageUrl ? '' : 'static bg-muted rounded-t-lg'}`}>
                     <CardTitle className={`text-lg truncate ${item.imageUrl ? 'text-primary-foreground' : 'text-foreground'}`}>{item.title}</CardTitle>
                     <CardDescription className={`text-xs truncate ${item.imageUrl ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {item.speakerOrReciter} - {item.category}
                     </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-4">
                  {item.description && <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{item.description}</p>}
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{item.duration}</span>
                    <span className="mx-1">·</span>
                    <Waves className="h-3.5 w-3.5" />
                    <span>{item.source}</span>
                  </div>
                </CardContent>
                <CardFooter className="gap-2">
                  <Button variant="default" size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <PlayCircle className="mr-2 h-4 w-4" /> Play
                  </Button>
                  <Button variant="outline" size="sm" title="Download (Planned)">
                    <Download className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

