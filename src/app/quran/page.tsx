
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpenText, Volume2, ListFilter, Bookmark as BookmarkIcon, BookText, BookOpen, Eye, EyeOff, MessageSquareTextIcon, Search as SearchIconLucide, X } from "lucide-react"; 
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch"; // Keep Switch for general settings if needed elsewhere, but not used here anymore
import { Input } from "@/components/ui/input"; 
import { cn } from "@/lib/utils";

// API base for AlQuran.cloud
const ALQURAN_CLOUD_API_BASE = "https://api.alquran.cloud/v1";

interface SurahInfoFromMeta {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  revelationType: "Meccan" | "Medinan";
  numberOfAyahs: number;
  sajda?: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

interface EditionInfo {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: "text" | "audio";
  type: "quran" | "translation" | "tafsir" | "versebyverse";
  direction?: "ltr" | "rtl";
  conceptual?: boolean; // For Tafsir editions not from API
}

interface Ayah {
  number: number; // Overall number in Quran
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; obligatory: boolean; recommended?: boolean }; // Sajda can be boolean or object from API
  audio?: string; // For AlQuran.cloud audio Ayah
  audioSecondary?: string[]; // For AlQuran.cloud audio Ayah
}

interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: "Meccan" | "Medinan";
  numberOfAyahs: number;
  ayahs: Ayah[];
  edition: EditionInfo;
}

const textEditions: EditionInfo[] = [
  { identifier: "quran-uthmani", name: "Uthmani", englishName: "Uthmani", language: "ar", format: "text", type: "quran", direction: "rtl" },
  { identifier: "quran-simple-enhanced", name: "Simple Enhanced", englishName: "Simple Enhanced", language: "ar", format: "text", type: "quran", direction: "rtl"},
];

const translationEditions: EditionInfo[] = [
  { identifier: "ur.kanzuliman", name: "Kanzul Iman", englishName: "Kanzul Iman (Urdu) - Ahmed Raza Khan", language: "ur", format: "text", type: "translation", direction: "rtl" },
  { identifier: "en.ahmedraza", name: "Kanzul Iman (Eng)", englishName: "Kanzul Iman (English) - Ahmed Raza Khan", language: "en", format: "text", type: "translation", direction: "ltr" },
];

const tafsirEditions: Array<EditionInfo> = [
  { identifier: "none", name: "None", englishName: "No Tafsir", language: "none", format: "text", type: "tafsir" },
  { identifier: "ar.jalalayn", name: "Tafsir Al-Jalalain", englishName: "Tafsir Al-Jalalain (AR)", language: "ar", format: "text", type: "tafsir", direction: "rtl" },
  { identifier: "en.maarifulquran", name: "Maariful Quran", englishName: "Maariful Quran (EN)", language: "en", format: "text", type: "tafsir", direction: "ltr" },
  { identifier: "khazainul_irfan", name: "Khazain-ul-Irfan", englishName: "Khazain-ul-Irfan (Conceptual)", language: "ur", format: "text", type: "tafsir", conceptual: true, direction: "rtl" },
  { identifier: "roohul_bayan", name: "Rooh-ul-Bayan", englishName: "Rooh-ul-Bayan (Conceptual)", language: "ar", format: "text", type: "tafsir", conceptual: true, direction: "rtl" },
  { identifier: "tafsir_e_naeemi", name: "Tafsir-e-Naeemi", englishName: "Tafsir-e-Naeemi (Conceptual)", language: "ur", format: "text", type: "tafsir", conceptual: true, direction: "rtl" },
];


const reciters = [
    { identifier: "ar.abdulbasitmurattal", name: "Abdul Basit Murattal" },
    { identifier: "ar.abdullahbasfar", name: "Abdullah Basfar" },
    { identifier: "ar.alafasy", name: "Mishary Rashid Alafasy" },
    { identifier: "ar.hudhaify", name: "Ali Abdur-Rahman al-Hudhaify" },
    { identifier: "ar.saoodshuraym", name: "Saood bin Ibraaheem Ash-Shuraym" },
];

export default function QuranPage() {
  const [surahs, setSurahs] = useState<SurahInfoFromMeta[]>([]);
  const [selectedSurahNumber, setSelectedSurahNumber] = useState<string | null>(null);
  
  const [selectedTextEdition, setSelectedTextEdition] = useState<string>(textEditions[0].identifier);
  const [selectedTranslationEdition, setSelectedTranslationEdition] = useState<string>(translationEditions[0].identifier);
  const [selectedTafsirEdition, setSelectedTafsirEdition] = useState<string>(tafsirEditions[0].identifier);
  const [selectedReciter, setSelectedReciter] = useState<string>(reciters[0].identifier);
  
  const [currentSurahData, setCurrentSurahData] = useState<SurahDetail | null>(null);
  const [currentTranslationData, setCurrentTranslationData] = useState<SurahDetail | null>(null);
  const [currentTafsirData, setCurrentTafsirData] = useState<SurahDetail | null>(null);
  const [currentAudioAyah, setCurrentAudioAyah] = useState<string | null>(null);

  const [isLoadingSurahs, setIsLoadingSurahs] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [isLoadingTafsir, setIsLoadingTafsir] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [quranViewMode, setQuranViewMode] = useState<'translation' | 'tilawat'>('translation');
  const [searchQuery, setSearchQuery] = useState<string>(""); 

  const { toast } = useToast();

  useEffect(() => {
    async function fetchSurahList() {
      setIsLoadingSurahs(true);
      setSurahs([]);
      try {
        const response = await fetch(`${ALQURAN_CLOUD_API_BASE}/meta`);
        if (!response.ok) {
          throw new Error(`Failed to fetch Surah list from AlQuran.cloud/meta - Status: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.code === 200 && data.data && data.data.surahs && data.data.surahs.references) {
          setSurahs(data.data.surahs.references);
        } else {
          console.warn("Unexpected Surah list data format from AlQuran.cloud/meta:", data);
          throw new Error("Invalid Surah list data format from AlQuran.cloud/meta.");
        }
      } catch (error) {
        console.error("Error fetching Surah list:", error);
        toast({ title: "Error Loading Surahs", description: (error as Error).message, variant: "destructive" });
      } finally {
        setIsLoadingSurahs(false);
      }
    }
    fetchSurahList();
  }, [toast]);

  useEffect(() => {
    async function fetchSurahContent() {
      if (!selectedSurahNumber) {
        setCurrentSurahData(null);
        setCurrentTranslationData(null);
        return;
      }
      setIsLoadingContent(true);
      setCurrentSurahData(null);
      setCurrentTranslationData(null);
      setCurrentAudioAyah(null); 

      try {
        const textRes = await fetch(`${ALQURAN_CLOUD_API_BASE}/surah/${selectedSurahNumber}/${selectedTextEdition}`);
        if (!textRes.ok) throw new Error(`Failed to fetch Arabic text for Surah ${selectedSurahNumber} (Edition: ${selectedTextEdition}) - Status: ${textRes.status} ${textRes.statusText}`);
        const textData = await textRes.json();
        if (textData.code === 200 && textData.data) {
          setCurrentSurahData(textData.data as SurahDetail);
        } else {
          throw new Error(`Invalid Arabic text data for Surah ${selectedSurahNumber} (Edition: ${selectedTextEdition}) - API Code: ${textData.code}`);
        }

        const transRes = await fetch(`${ALQURAN_CLOUD_API_BASE}/surah/${selectedSurahNumber}/${selectedTranslationEdition}`);
        if (!transRes.ok) throw new Error(`Failed to fetch translation for Surah ${selectedSurahNumber} (Edition: ${selectedTranslationEdition}) - Status: ${transRes.status} ${transRes.statusText}`);
        const transData = await transRes.json();
         if (transData.code === 200 && transData.data) {
          setCurrentTranslationData(transData.data as SurahDetail);
        } else {
          throw new Error(`Invalid translation data for Surah ${selectedSurahNumber} (Edition: ${selectedTranslationEdition}) - API Code: ${transData.code}`);
        }

      } catch (error) {
        console.error("Error fetching Surah content:", error);
        toast({ title: "Error Loading Surah Content", description: (error as Error).message, variant: "destructive" });
        setCurrentSurahData(null); 
        setCurrentTranslationData(null);
      } finally {
        setIsLoadingContent(false);
      }
    }
    fetchSurahContent();
  }, [selectedSurahNumber, selectedTextEdition, selectedTranslationEdition, toast]);

  useEffect(() => {
    async function fetchTafsirContent() {
      if (!selectedSurahNumber || !selectedTafsirEdition || selectedTafsirEdition === 'none') {
        setCurrentTafsirData(null);
        return;
      }

      const tafsirInfo = tafsirEditions.find(t => t.identifier === selectedTafsirEdition);
      if (tafsirInfo && tafsirInfo.conceptual) {
        setCurrentTafsirData(null);
        setIsLoadingTafsir(false);
        return;
      }
      
      if (tafsirInfo) {
        setIsLoadingTafsir(true);
        setCurrentTafsirData(null);
        try {
          const tafsirRes = await fetch(`${ALQURAN_CLOUD_API_BASE}/surah/${selectedSurahNumber}/${selectedTafsirEdition}`);
          if (!tafsirRes.ok) throw new Error(`Failed to fetch Tafsir for Surah ${selectedSurahNumber} (Edition: ${selectedTafsirEdition}) - Status: ${tafsirRes.status} ${tafsirRes.statusText}`);
          const tafsirData = await tafsirRes.json();
          if (tafsirData.code === 200 && tafsirData.data) {
            setCurrentTafsirData(tafsirData.data as SurahDetail);
          } else {
            throw new Error(`Invalid Tafsir data for Surah ${selectedSurahNumber} (Edition: ${selectedTafsirEdition}) - API Code: ${tafsirData.code}`);
          }
        } catch (error) {
          console.error("Error fetching Tafsir content:", error);
          toast({ title: "Error Loading Tafsir", description: (error as Error).message, variant: "destructive" });
          setCurrentTafsirData(null);
        } finally {
          setIsLoadingTafsir(false);
        }
      }
    }
    if (selectedSurahNumber) { 
        fetchTafsirContent();
    }
  }, [selectedSurahNumber, selectedTafsirEdition, toast]);


  const playAudio = (surahNumber: number, ayahNumberInSurah: number) => {
    const audioAyahIdentifier = `${surahNumber}:${ayahNumberInSurah}`;
    const audioSrc = `${ALQURAN_CLOUD_API_BASE}/ayah/${audioAyahIdentifier}/${selectedReciter}`; 
    setCurrentAudioAyah(audioSrc);
  };

  const handleBookmarkAyah = (surahNum: number, ayahNumInSurah: number) => {
    toast({
      title: "Ayah Bookmarked (Conceptual)",
      description: `Ayah ${surahNum}:${ayahNumInSurah} added to bookmarks. This is a conceptual feature.`,
    });
  };
  
  const combinedAyahs = useMemo(() => {
    if (!currentSurahData || !currentSurahData.ayahs ) return [];
    
    if (quranViewMode === 'tilawat') {
        return currentSurahData.ayahs.map(arabicAyah => ({ arabic: arabicAyah }));
    }
    
    return currentSurahData.ayahs.map(arabicAyah => {
      const translationAyah = (currentTranslationData && currentTranslationData.ayahs)
        ? currentTranslationData.ayahs.find((tAyah) => tAyah.numberInSurah === arabicAyah.numberInSurah)
        : undefined;
      
      const tafsirAyah = (selectedTafsirEdition && selectedTafsirEdition !== 'none' && currentTafsirData && currentTafsirData.ayahs)
        ? currentTafsirData.ayahs.find((tfAyah) => tfAyah.numberInSurah === arabicAyah.numberInSurah)
        : undefined;
        
      return { 
        arabic: arabicAyah, 
        translation: translationAyah,
        tafsir: tafsirAyah,
      };
    });
  }, [currentSurahData, currentTranslationData, currentTafsirData, selectedTafsirEdition, quranViewMode]);

  const displayedAyahs = useMemo(() => {
    if (searchQuery.trim() === "") {
      return combinedAyahs;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return combinedAyahs.filter(({ arabic, translation, tafsir }) => {
      const inArabic = arabic?.text?.toLowerCase().includes(lowerCaseQuery);
      const inTranslation = translation?.text?.toLowerCase().includes(lowerCaseQuery) || false;
      const inTafsir = tafsir?.text?.toLowerCase().includes(lowerCaseQuery) || false;
      return inArabic || inTranslation || inTafsir;
    });
  }, [combinedAyahs, searchQuery]);


  const currentSurahInfoFromMeta = useMemo(() => {
    return surahs.find(s => s.number.toString() === selectedSurahNumber);
  }, [surahs, selectedSurahNumber]);

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col h-full">
      <Card className="glass-card shadow-xl sticky top-[calc(theme(spacing.16)_+theme(spacing.4))] md:top-[calc(theme(spacing.16)_+theme(spacing.6))] z-20 mb-4">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="w-full sm:flex-grow">
              <Label htmlFor="surah-select" className="sr-only">Select Surah</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedSurahNumber(value);
                  setSearchQuery(""); 
                }}
                value={selectedSurahNumber || undefined}
                disabled={isLoadingSurahs || surahs.length === 0}
              >
                <SelectTrigger id="surah-select" aria-label="Select Surah" className="w-full">
                  <SelectValue placeholder={isLoadingSurahs ? "Loading Surahs..." : (surahs.length === 0 ? "No Surahs found" : "Select a Surah")} />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  {surahs.map((surah) => (
                    <SelectItem key={surah.number} value={surah.number.toString()}>
                      {surah.number}. {surah.englishName} ({surah.name}) - {surah.numberOfAyahs} Ayahs
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             <div className="relative w-full sm:w-auto sm:max-w-xs flex-grow md:flex-grow-0">
              <Input
                type="search"
                placeholder="Search in current Surah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 w-full bg-background/80"
                disabled={!selectedSurahNumber || isLoadingContent}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full sm:w-auto flex-shrink-0">
              <ListFilter className="mr-2 h-4 w-4" /> {showFilters ? "Hide" : "Show"} Options
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="pt-0 pb-4">
            <Card className="p-4 bg-background/50 border-border/30 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="text-edition" className="text-sm font-medium mb-1 block">Arabic Text Edition</Label>
                  <Select value={selectedTextEdition} onValueChange={setSelectedTextEdition}>
                    <SelectTrigger id="text-edition"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {textEditions.map(ed => <SelectItem key={ed.identifier} value={ed.identifier}>{ed.englishName}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="translation-edition" className="text-sm font-medium mb-1 block">Translation Edition</Label>
                  <Select value={selectedTranslationEdition} onValueChange={setSelectedTranslationEdition}>
                    <SelectTrigger id="translation-edition"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {translationEditions.map(ed => <SelectItem key={ed.identifier} value={ed.identifier}>{ed.name} ({ed.language.toUpperCase()})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tafsir-edition" className="text-sm font-medium mb-1 block">Tafsir Edition</Label>
                  <Select value={selectedTafsirEdition || 'none'} onValueChange={setSelectedTafsirEdition}>
                    <SelectTrigger id="tafsir-edition"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {tafsirEditions.map(ed => <SelectItem key={ed.identifier} value={ed.identifier}>{ed.name} {ed.conceptual ? '(Conceptual)' : `(${ed.language.toUpperCase()})`}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label htmlFor="reciter-selection" className="text-sm font-medium mb-1 block">Reciter</Label>
                  <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                    <SelectTrigger id="reciter-selection"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {reciters.map(r => <SelectItem key={r.identifier} value={r.identifier}>{r.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </CardContent>
        )}
      </Card>

      {(isLoadingContent || (isLoadingTafsir && selectedTafsirEdition !== 'none' && !tafsirEditions.find(t => t.identifier === selectedTafsirEdition)?.conceptual)) && (
        <div className="flex justify-center items-center py-20 flex-grow">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">
            {isLoadingContent ? "Loading Surah content..." : "Loading Tafsir..."}
          </p>
        </div>
      )}

      {!isLoadingContent && currentSurahData && displayedAyahs.length > 0 && (
        <div className={cn(
            "bg-background/30 rounded-lg shadow-lg glass-card flex flex-col flex-grow",
            quranViewMode === 'tilawat' 
              ? 'mt-2 p-1 md:p-2' 
              : 'mt-6 p-4 md:p-6'
        )}>
          <div className={cn(
            "pb-4 border-b border-border/50",
            quranViewMode === 'tilawat' ? 'mb-2' : 'mb-6'
          )}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h2 className="text-3xl font-semibold font-arabic text-primary">
                    {currentSurahData.name} ({currentSurahData.englishName})
                    </h2>
                    <p className="text-muted-foreground">
                    {currentSurahData.englishNameTranslation} - {currentSurahData.revelationType} - {currentSurahData.numberOfAyahs} Ayahs
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1">
                      Arabic: {currentSurahData.edition.englishName} 
                      {quranViewMode === 'translation' && currentTranslationData && ` | Translation: ${currentTranslationData.edition.name} (${currentTranslationData.edition.language.toUpperCase()})`}
                      {quranViewMode === 'translation' && selectedTafsirEdition && selectedTafsirEdition !== 'none' && ` | Tafsir: ${tafsirEditions.find(t => t.identifier === selectedTafsirEdition)?.name}`}
                    </p>
                    {(currentSurahInfoFromMeta?.sajda === true || (typeof currentSurahInfoFromMeta?.sajda === 'object' && currentSurahInfoFromMeta.sajda.obligatory)) && (
                        <Badge variant="secondary" className="mt-2 w-fit">
                           Contains Sajda Ayah(s)
                        </Badge>
                    )}
                </div>
                <ToggleGroup
                    type="single"
                    value={quranViewMode}
                    onValueChange={(value) => {
                        if (value) setQuranViewMode(value as 'translation' | 'tilawat');
                    }}
                    aria-label="Quran View Mode"
                    className="mt-2 sm:mt-0"
                >
                    <ToggleGroupItem value="translation" aria-label="Translation & Tafsir Mode" size="sm">
                        <BookText className="mr-2 h-4 w-4" /> Translation & Tafsir
                    </ToggleGroupItem>
                    <ToggleGroupItem value="tilawat" aria-label="Tilawat Mode" size="sm">
                        <BookOpen className="mr-2 h-4 w-4" /> Tilawat
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
          </div>
            
          {quranViewMode === 'translation' && currentAudioAyah && (
            <div className="my-4 sticky top-[calc(theme(spacing.16)_+theme(spacing.4)_+theme(spacing.28)_+theme(spacing.8)_+2rem)] md:top-[calc(theme(spacing.16)_+theme(spacing.6)_+theme(spacing.28)_+theme(spacing.8)_+2rem)] z-10 bg-background/90 backdrop-blur-sm p-2 rounded-md shadow-lg border border-border/30">
                <audio controls autoPlay src={currentAudioAyah} key={currentAudioAyah} className="w-full h-10">
                    Your browser does not support the audio element.
                </audio>
            </div>
          )}

          <ScrollArea className={cn( "pr-3 flex-grow min-h-0" )}>
            <div className="space-y-1">
              {displayedAyahs.map(({ arabic, translation, tafsir }, index) => (
                <div 
                    key={arabic?.numberInSurah || index} // Use index as fallback key if arabic is undefined (e.g. only translation data)
                    className={cn(
                        quranViewMode === 'tilawat' 
                          ? 'py-1 md:py-1.5' 
                          : 'py-4'
                    )}
                >
                  {quranViewMode === 'translation' && arabic && (
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-base font-medium text-primary">
                        {currentSurahData.number}:{arabic.numberInSurah}
                      </span>
                       <div className="flex items-center gap-1">
                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => playAudio(currentSurahData.number, arabic.numberInSurah)} title="Play Ayah">
                           <Volume2 className="h-5 w-5 text-accent hover:text-accent/80" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8" title="Bookmark Ayah (Conceptual)" onClick={() => handleBookmarkAyah(currentSurahData.number, arabic.numberInSurah)}>
                            <BookmarkIcon className="h-5 w-5 text-yellow-600 hover:text-yellow-500" />
                         </Button>
                       </div>
                    </div>
                  )}

                  {arabic && (
                    <p className={cn(
                        "text-right font-arabic",
                        quranViewMode === 'tilawat' 
                          ? "text-2xl sm:text-3xl lg:text-4xl leading-relaxed sm:leading-loose" 
                          : "text-2xl md:text-3xl leading-relaxed mb-3"
                    )} dir="rtl">
                      {arabic.text}
                      {quranViewMode === 'tilawat' && (
                        <span className="text-base text-muted-foreground/80 font-sans mx-1 select-none">﴿{arabic.numberInSurah.toLocaleString('ar-EG')}﴾</span>
                      )}
                    </p>
                  )}

                  {quranViewMode === 'translation' && translation && (
                    <p 
                        className={cn(
                            "text-base leading-relaxed mb-3",
                            currentTranslationData && currentTranslationData.edition.language === 'ur' ? 'font-urdu text-right' : 'text-left'
                        )} 
                        dir={currentTranslationData && currentTranslationData.edition.direction || (currentTranslationData && currentTranslationData.edition.language === 'ur' ? 'rtl' : 'ltr')}
                    >
                      {translation.text}
                    </p>
                  )}

                  {quranViewMode === 'translation' && selectedTafsirEdition && selectedTafsirEdition !== 'none' && arabic && (
                    <div className="mt-2 pt-2 border-t border-border/30">
                      <div className="flex items-center gap-2 mb-1.5">
                        <MessageSquareTextIcon className="h-4 w-4 text-accent"/>
                        <p className="text-sm font-semibold text-accent">
                          Tafsir ({tafsirEditions.find(t => t.identifier === selectedTafsirEdition)?.name || selectedTafsirEdition})
                        </p>
                      </div>
                      {isLoadingTafsir && <div className="flex items-center text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin mr-1.5"/>Loading Tafsir...</div>}
                      {!isLoadingTafsir && tafsir && currentTafsirData && (
                        <p 
                          className={cn(
                            "text-sm leading-relaxed",
                            currentTafsirData.edition.language === 'ur' ? 'font-urdu text-right' : (currentTafsirData.edition.language === 'ar' ? 'font-arabic text-right' : 'text-left')
                          )}
                          dir={currentTafsirData.edition.direction || (currentTafsirData.edition.language === 'ur' || currentTafsirData.edition.language === 'ar' ? 'rtl' : 'ltr')}
                        >
                          {tafsir.text}
                        </p>
                      )}
                      {!isLoadingTafsir && !tafsir && tafsirEditions.find(t => t.identifier === selectedTafsirEdition) && !tafsirEditions.find(t => t.identifier === selectedTafsirEdition)?.conceptual && (
                        <p className="text-xs text-muted-foreground italic">Tafsir for this Ayah is not available in the selected edition.</p>
                      )}
                      {!isLoadingTafsir && tafsirEditions.find(t => t.identifier === selectedTafsirEdition)?.conceptual && (
                        <p className="text-sm italic text-muted-foreground">
                          Conceptual Tafsir for {tafsirEditions.find(t => t.identifier === selectedTafsirEdition)?.name} would be displayed here for Ayah {currentSurahData.number}:{arabic.numberInSurah}.
                        </p>
                      )}
                    </div>
                  )}

                  {quranViewMode === 'translation' && arabic && (
                    <>
                      {(typeof arabic.sajda === 'object' && arabic.sajda.obligatory) && ( 
                         <Badge variant={arabic.sajda.obligatory ? 'destructive' : 'secondary'} className="mt-2">
                           Sajda {arabic.sajda.obligatory ? '(Obligatory)' : arabic.sajda.recommended ? '(Recommended)' : ''}
                         </Badge>
                      )}
                       {(typeof arabic.sajda === 'boolean' && arabic.sajda === true) && ( 
                         <Badge variant="secondary" className="mt-2">Sajda</Badge>
                      )}
                      <div className="mt-3 space-x-2 text-xs text-muted-foreground">
                          {arabic.juz && <span>Juz: {arabic.juz}</span>}
                          {arabic.page && <span>Page: {arabic.page}</span>}
                          {arabic.manzil && <span>Manzil: {arabic.manzil}</span>}
                          {arabic.ruku && <span>Ruku: {arabic.ruku}</span>}
                          {arabic.hizbQuarter && <span>Hizb ¼: {arabic.hizbQuarter}</span>}
                      </div>
                    </>
                  )}
                  {quranViewMode === 'translation' && index < displayedAyahs.length - 1 && <Separator className="mt-6 bg-border/50" />}
                </div>
              ))}
            </div>
          </ScrollArea>
          {!isLoadingContent && currentSurahData && searchQuery && displayedAyahs.length === 0 && (
            <div className="text-center py-10 text-muted-foreground flex-grow flex flex-col items-center justify-center">
              <SearchIconLucide className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-lg">No results found for "{searchQuery}" in this Surah.</p>
            </div>
          )}
        </div>
      )}
      
      {!isLoadingContent && selectedSurahNumber && (!currentSurahData || combinedAyahs.length === 0) && !searchQuery && (
         <Card className="glass-card shadow-xl mt-6 flex-grow flex flex-col">
            <CardContent className="p-10 text-center flex flex-col items-center justify-center h-full">
                <BookOpenText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No content loaded for the selected Surah and editions.</p>
                <p className="text-xs text-muted-foreground">This could be due to an API issue, or the selected editions might not cover this Surah. Please try different editions or check your internet connection.</p>
            </CardContent>
        </Card>
      )}
      
      {!selectedSurahNumber && !isLoadingSurahs && surahs.length > 0 && (
        <Card className="glass-card shadow-xl mt-6 flex-grow flex flex-col">
            <CardContent className="p-10 text-center flex flex-col items-center justify-center h-full">
                <BookOpenText className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-xl text-foreground">Please select a Surah to display its content.</p>
            </CardContent>
        </Card>
      )}
       {!isLoadingSurahs && surahs.length === 0 && (
        <Card className="glass-card shadow-xl mt-6 flex-grow flex flex-col">
            <CardContent className="p-10 text-center flex flex-col items-center justify-center h-full">
                <BookOpenText className="h-16 w-16 text-destructive mx-auto mb-4" />
                <p className="text-xl text-foreground">Could not load Surah list.</p>
                <p className="text-muted-foreground">Please check your internet connection or try again later.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
    
