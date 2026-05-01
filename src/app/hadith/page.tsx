
"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, BookCopy, ChevronLeft, ChevronRight, Bookmark as BookmarkIcon, AlertTriangle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Define the structure for a single Hadith from the JSON files
interface HadithJsonEntry {
  hadithnumber: number;
  arabicnumber: number;
  text: {
    en?: string;
    ar: string;
    ur?: string; // Assuming Urdu translation might be present
    // Add other languages if present in JSON, e.g., id, fr, etc.
  };
  grades: Array<{ name: string; grade: string }>; // Assuming grades is an array of objects
  reference: {
    book: number | string; // Book number can be string or number
    hadith: number;
  };
  bookname_en?: string; // English book name
  bookname_ar?: string; // Arabic book name
}

// Define the structure for the entire collection JSON file (e.g., bukhari.json)
// It's an object where keys are URNs (as strings) and values are HadithJsonEntry
type HadithCollectionFile = Record<string, HadithJsonEntry>;


// Interface for our internal representation of a Hadith collection
interface HadithCollection {
  name: string; // Slug, e.g., "bukhari"
  englishTitle: string;
  arabicTitle?: string;
  totalHadiths: number;
  jsonFile: string; // Path to the JSON file, e.g., "/data/hadith/bukhari.json"
}

// Interface for our internal representation of a chapter within a collection
interface HadithChapter {
  bookNumber: string; // e.g., "1"
  englishTitle: string;
  arabicTitle?: string;
  collectionName: string; // Parent collection name/slug
  totalHadithsInBook?: number; // Optional, can be calculated
}

// Interface for our internal representation of a single Hadith for display
interface Hadith {
  urn?: number; // Can derive from JSON key if needed
  hadithNumberDisplay: string; // e.g., "1" or "1a"
  collection: string; // Slug of the collection
  bookNumber?: string;
  arabicText: string;
  englishText?: string;
  urduText?: string;
  grades: Array<{ name: string; grade: string }>;
  referenceBook: string | number;
  referenceHadith: number;
}

interface PaginatedHadiths {
  data: Hadith[];
  total: number;
  page: number;
  limit: number;
}

// Hardcoded list of collections. User needs to ensure these JSON files exist.
const AVAILABLE_COLLECTIONS: HadithCollection[] = [
  { name: "bukhari", englishTitle: "Sahih al-Bukhari", arabicTitle: "صحيح البخاري", totalHadiths: 0, jsonFile: "/data/hadith/bukhari.json" },
  { name: "muslim", englishTitle: "Sahih Muslim", arabicTitle: "صحيح مسلم", totalHadiths: 0, jsonFile: "/data/hadith/muslim.json" },
  { name: "nasai", englishTitle: "Sunan an-Nasa'i", arabicTitle: "سنن النسائي", totalHadiths: 0, jsonFile: "/data/hadith/nasai.json" },
  { name: "abudawud", englishTitle: "Sunan Abi Dawud", arabicTitle: "سنن أبي داود", totalHadiths: 0, jsonFile: "/data/hadith/abudawud.json" },
  { name: "tirmidhi", englishTitle: "Jami at-Tirmidhi", arabicTitle: "جامع الترمذي", totalHadiths: 0, jsonFile: "/data/hadith/tirmidhi.json" },
  { name: "ibnmajah", englishTitle: "Sunan Ibn Majah", arabicTitle: "سنن ابن ماجه", totalHadiths: 0, jsonFile: "/data/hadith/ibnmajah.json" },
  // Add other collections here if their JSON files are available
];

const ITEMS_PER_PAGE = 10;

export default function HadithPage() {
  const [collections, setCollections] = useState<HadithCollection[]>([]);
  const [selectedCollectionName, setSelectedCollectionName] = useState<string | null>(null);
  
  const [chapters, setChapters] = useState<HadithChapter[]>([]);
  const [selectedBookNumber, setSelectedBookNumber] = useState<string | null>(null);

  const [hadithsData, setHadithsData] = useState<PaginatedHadiths | null>(null);
  const [allHadithsInBook, setAllHadithsInBook] = useState<Hadith[]>([]); // Store all hadiths of selected book for pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [isLoadingHadiths, setIsLoadingHadiths] = useState(false);
  const [dataDirMissing, setDataDirMissing] = useState(false);

  const { toast } = useToast();

  // Simulate fetching collections (now just loading the predefined list)
  useEffect(() => {
    setIsLoadingCollections(true);
    // To make it more dynamic, we could try to fetch each JSON to get totalHadiths,
    // but for simplicity, we'll start with 0 or update later.
    // For now, just set the available collections.
    // We will also check if at least one JSON file is accessible to hint about `public/data/hadith`
    async function checkDataDirectory() {
        if (AVAILABLE_COLLECTIONS.length > 0) {
            try {
                const res = await fetch(AVAILABLE_COLLECTIONS[0].jsonFile);
                if (!res.ok && res.status === 404) {
                    setDataDirMissing(true);
                     toast({
                        title: "Hadith Data Files Missing",
                        description: `Could not find Hadith JSON files. Please ensure you have downloaded them from AhmedBaset/hadith-json and placed them in the 'public/data/hadith/' directory. Starting with ${AVAILABLE_COLLECTIONS[0].jsonFile}.`,
                        variant: "destructive",
                        duration: 10000,
                    });
                    setCollections([]);
                } else {
                    setDataDirMissing(false);
                    // Optionally, update totalHadiths here by fetching each file
                    setCollections(AVAILABLE_COLLECTIONS);
                }
            } catch (e) {
                 setDataDirMissing(true);
                 toast({
                    title: "Error Accessing Hadith Data",
                    description: "Could not access local Hadith JSON files. Check console for more details and ensure files are in 'public/data/hadith/'.",
                    variant: "destructive",
                    duration: 7000,
                });
                setCollections([]);
            }
        }
        setIsLoadingCollections(false);
    }
    checkDataDirectory();
  }, [toast]);

  // Fetch Chapters (Books) when a collection is selected
  useEffect(() => {
    async function fetchChapters() {
      const selectedCollection = collections.find(c => c.name === selectedCollectionName);
      if (!selectedCollection) {
        setChapters([]);
        setSelectedBookNumber(null);
        return;
      }
      setIsLoadingChapters(true);
      setChapters([]);
      setSelectedBookNumber(null);
      setHadithsData(null);

      try {
        const response = await fetch(selectedCollection.jsonFile);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${selectedCollection.jsonFile} - Status: ${response.status} ${response.statusText}`);
        }
        const collectionData: HadithCollectionFile = await response.json();
        
        const bookMap = new Map<string, HadithChapter>();
        Object.values(collectionData).forEach(hadithEntry => {
          const bookNumStr = hadithEntry.reference.book.toString();
          if (!bookMap.has(bookNumStr)) {
            bookMap.set(bookNumStr, {
              bookNumber: bookNumStr,
              englishTitle: hadithEntry.bookname_en || `Book ${bookNumStr}`,
              arabicTitle: hadithEntry.bookname_ar,
              collectionName: selectedCollection.name,
              totalHadithsInBook: 0 // Can be calculated later if needed
            });
          }
          // Increment count for totalHadithsInBook
          const chapter = bookMap.get(bookNumStr);
          if(chapter) chapter.totalHadithsInBook = (chapter.totalHadithsInBook || 0) + 1;
        });

        const sortedChapters = Array.from(bookMap.values()).sort((a, b) => {
            const numA = parseInt(a.bookNumber.match(/\d+/)?.[0] || '0');
            const numB = parseInt(b.bookNumber.match(/\d+/)?.[0] || '0');
            return numA - numB;
        });
        setChapters(sortedChapters);

      } catch (error: any) {
        console.error("Error in fetchChapters:", error);
        toast({ title: "Error Fetching Chapters", description: error.message, variant: "destructive" });
      } finally {
        setIsLoadingChapters(false);
      }
    }
    if (selectedCollectionName) {
        fetchChapters();
    }
  }, [selectedCollectionName, collections, toast]);

  // Load Hadiths when book/chapter and collection are selected/changed
  useEffect(() => {
    async function loadHadithsForBook() {
      const selectedCollection = collections.find(c => c.name === selectedCollectionName);
      if (!selectedCollection || !selectedBookNumber) {
        setAllHadithsInBook([]);
        setHadithsData(null);
        return;
      }
      setIsLoadingHadiths(true);
      setAllHadithsInBook([]);
      setHadithsData(null);

      try {
        const response = await fetch(selectedCollection.jsonFile);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${selectedCollection.jsonFile} for Hadiths - Status: ${response.status} ${response.statusText}`);
        }
        const collectionData: HadithCollectionFile = await response.json();
        
        const hadithsInSelectedBook: Hadith[] = Object.entries(collectionData)
          .filter(([_, hadithEntry]) => hadithEntry.reference.book.toString() === selectedBookNumber)
          .map(([urn, hadithEntry]) => ({
            urn: parseInt(urn),
            hadithNumberDisplay: hadithEntry.hadithnumber.toString(), // This might need adjustment based on how numbers are in JSON
            collection: selectedCollection.name,
            bookNumber: hadithEntry.reference.book.toString(),
            arabicText: hadithEntry.text.ar,
            englishText: hadithEntry.text.en,
            urduText: hadithEntry.text.ur,
            grades: hadithEntry.grades || [],
            referenceBook: hadithEntry.reference.book,
            referenceHadith: hadithEntry.reference.hadith,
          }))
          .sort((a,b) => a.referenceHadith - b.referenceHadith); // Sort by hadith number within book

        setAllHadithsInBook(hadithsInSelectedBook);

      } catch (error: any) {
        console.error("Error in loadHadithsForBook:", error);
        toast({ title: "Error Loading Hadiths", description: error.message, variant: "destructive" });
        setAllHadithsInBook([]);
      } finally {
        setIsLoadingHadiths(false);
      }
    }
    if (selectedCollectionName && selectedBookNumber) {
        loadHadithsForBook();
    }
  }, [selectedCollectionName, selectedBookNumber, collections, toast]);

  // Client-side pagination effect
  useEffect(() => {
    if (allHadithsInBook.length > 0) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedHadiths = allHadithsInBook.slice(startIndex, endIndex);
      setHadithsData({
        data: paginatedHadiths,
        total: allHadithsInBook.length,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
    } else {
      setHadithsData(null);
    }
  }, [allHadithsInBook, currentPage]);


  const handleCollectionChange = (collectionNameValue: string) => {
    setSelectedCollectionName(collectionNameValue);
    setSelectedBookNumber(null); 
    setHadithsData(null); 
    setCurrentPage(1); 
    setAllHadithsInBook([]);
  };
  
  const handleChapterChange = (bookNumberValue: string) => { 
    setSelectedBookNumber(bookNumberValue);
    setHadithsData(null); 
    setCurrentPage(1); 
    setAllHadithsInBook([]);
  };

  const handleBookmarkHadith = (hadithNum: string) => {
    toast({
      title: "Hadith Bookmarked (Conceptual)",
      description: `Hadith ${hadithNum} added to bookmarks. This is a conceptual feature.`,
    });
  };

  const selectedCollectionDetails = useMemo(() => {
    return collections.find(c => c.name === selectedCollectionName);
  }, [collections, selectedCollectionName]);

  const selectedChapterDetails = useMemo(() => { 
    return chapters.find(c => c.bookNumber === selectedBookNumber);
  }, [chapters, selectedBookNumber]);

  const totalPages = useMemo(() => {
    return hadithsData && hadithsData.limit > 0 ? Math.ceil(hadithsData.total / hadithsData.limit) : 0;
  }, [hadithsData]);

  return (
    <div className="container mx-auto py-6 px-4 flex flex-col space-y-4 md:space-y-6 h-full">
      <Card className="glass-card shadow-xl flex-shrink-0">
        <CardHeader>
          <CardTitle className="flex items-center text-xl sm:text-2xl font-bold">
            <BookCopy className="mr-2 h-6 w-6 sm:h-7 sm:w-7 text-primary" /> Hadith
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Explore prophetic traditions. Data sourced from local JSON files (AhmedBaset/hadith-json).
          </CardDescription>
           {dataDirMissing && (
            <Alert variant="destructive" className="mt-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Hadith Data Files Missing</AlertTitle>
              <AlertDescription>
                Could not find Hadith JSON files. Please ensure you have downloaded them from AhmedBaset/hadith-json (branch: `ca32fd7...`) and placed them in the `public/data/hadith/` directory of your project. Rename files like `sahih-bukhari.json` to `bukhari.json`.
              </AlertDescription>
            </Alert>
          )}
           <Alert variant="default" className="mt-2 bg-primary/5 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Data Source Note</AlertTitle>
              <AlertDescription>
                This section uses static JSON Hadith files. For the best experience, ensure all collection files listed in the dropdown (e.g., `bukhari.json`, `muslim.json`) are present in `public/data/hadith/`.
              </AlertDescription>
            </Alert>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              onValueChange={handleCollectionChange}
              value={selectedCollectionName || undefined}
              disabled={isLoadingCollections || collections.length === 0 || dataDirMissing}
            >
              <SelectTrigger aria-label="Select Hadith Collection">
                <SelectValue placeholder={isLoadingCollections ? "Loading Collections..." : (collections.length === 0 ? (dataDirMissing ? "Data Files Missing" : "No Collections Defined") : "Select a Collection")} />
              </SelectTrigger>
              <SelectContent>
                {collections.map((col) => (
                  <SelectItem key={col.name} value={col.name}>
                    {col.englishTitle} ({col.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={handleChapterChange}
              value={selectedBookNumber || undefined}
              disabled={isLoadingChapters || chapters.length === 0 || !selectedCollectionName || dataDirMissing}
            >
              <SelectTrigger aria-label="Select Book/Chapter">
                <SelectValue placeholder={isLoadingChapters ? "Loading Books/Chapters..." : (chapters.length === 0 && selectedCollectionName ? "No Books in Collection" : "Select a Book/Chapter")} />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {chapters.map((chap) => (
                  <SelectItem key={chap.bookNumber} value={chap.bookNumber}>
                    Book {chap.bookNumber}: {chap.englishTitle} {chap.totalHadithsInBook && chap.totalHadithsInBook > 0 ? `(${chap.totalHadithsInBook} Hadiths)`: ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {(isLoadingCollections || isLoadingChapters || isLoadingHadiths) && !dataDirMissing && (
        <div className="flex justify-center items-center py-10 flex-grow">
          <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
          <p className="ml-3 sm:ml-4 text-md sm:text-lg text-muted-foreground">
            {isLoadingCollections ? "Loading collections..." : isLoadingChapters ? "Loading books/chapters..." : "Loading Hadiths..."}
          </p>
        </div>
      )}

      {!isLoadingHadiths && hadithsData && hadithsData.data.length > 0 && selectedCollectionDetails && selectedChapterDetails && (
        <Card className="glass-card shadow-xl flex flex-col flex-grow min-h-0">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-lg sm:text-xl font-semibold">
                Book {selectedChapterDetails.bookNumber}: {selectedChapterDetails.englishTitle}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
                From: {selectedCollectionDetails.englishTitle} | Displaying {hadithsData.data.length} of {hadithsData.total} Hadiths (Page {hadithsData.page} of {totalPages})
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow min-h-0">
            <ScrollArea className="h-full pr-2 sm:pr-4">
              <div className="space-y-4 sm:space-y-6">
                {hadithsData.data.map((hadith, index) => (
                  <Card key={`${hadith.collection}-${hadith.bookNumber}-${hadith.hadithNumberDisplay}-${index}`} className="p-3 sm:p-4 shadow-md bg-background/70">
                    <CardHeader className="p-0 pb-1.5 sm:pb-2">
                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-2">
                         <CardTitle className="text-sm sm:text-base leading-tight">
                           {hadith.collection.toUpperCase()} / Book {hadith.referenceBook} / Hadith {hadith.referenceHadith} (Overall: {hadith.hadithNumberDisplay})
                         </CardTitle>
                         <div className="flex items-center gap-1 sm:gap-2 flex-wrap self-start sm:self-center">
                           {hadith.grades && hadith.grades.length > 0 && (
                              hadith.grades.map((grade, gradeIdx) => (
                                <Badge key={gradeIdx} variant="secondary" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                                  {grade.grade} ({grade.name})
                                </Badge>
                              ))
                           )}
                           <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" title="Bookmark Hadith (Conceptual)" onClick={() => handleBookmarkHadith(hadith.hadithNumberDisplay)}>
                             <BookmarkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-600 hover:text-yellow-500" />
                           </Button>
                         </div>
                       </div>
                    </CardHeader>
                    <CardContent className="p-0 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                      {hadith.arabicText && (
                        <div>
                          <p className="text-[11px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1">Arabic:</p>
                          <p className="font-arabic text-lg sm:text-xl text-right" dir="rtl">{hadith.arabicText}</p>
                        </div>
                      )}
                      {hadith.englishText && (
                        <div className="mt-1 sm:mt-1.5">
                          <p className="text-[11px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1">English:</p>
                          <p>{hadith.englishText}</p>
                        </div>
                      )}
                      {hadith.urduText && (
                        <div className="mt-1 sm:mt-1.5">
                          <p className="text-[11px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1">Urdu:</p>
                          <p className="font-urdu text-lg sm:text-xl text-right" dir="rtl">{hadith.urduText}</p>
                        </div>
                      )}
                      {!hadith.arabicText && !hadith.englishText && !hadith.urduText && <p className="text-xs sm:text-sm text-muted-foreground">No text available for this Hadith.</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          {totalPages > 1 && (
            <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 pt-3 sm:pt-4 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={hadithsData.page === 1 || isLoadingHadiths}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="mr-1 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" /> Previous
              </Button>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Page {hadithsData.page} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={hadithsData.page === totalPages || isLoadingHadiths}
                className="w-full sm:w-auto"
              >
                Next <ChevronRight className="ml-1 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" />
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
      
      {!isLoadingHadiths && selectedBookNumber && hadithsData && hadithsData.data.length === 0 && !dataDirMissing && (
         <Card className="glass-card shadow-xl flex-grow flex items-center justify-center">
            <CardContent className="p-6 text-center">
                <BookCopy className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
                <p className="text-muted-foreground text-sm sm:text-base">No Hadiths found for this book/chapter or page.</p>
            </CardContent>
        </Card>
      )}

      {!isLoadingCollections && !isLoadingChapters && !selectedCollectionName && collections.length > 0 && !dataDirMissing && (
         <Card className="glass-card shadow-xl flex-grow flex items-center justify-center">
            <CardContent className="p-6 text-center">
                <BookCopy className="h-10 w-10 sm:h-12 sm:w-12 text-primary mx-auto mb-2 sm:mb-3" />
                <p className="text-md sm:text-lg text-foreground">Please select a Hadith collection to begin.</p>
            </CardContent>
        </Card>
      )}
       {(!isLoadingCollections && collections.length === 0 && !dataDirMissing) && ( 
         <Card className="glass-card shadow-xl flex-grow flex items-center justify-center">
            <CardContent className="p-6 text-center">
                <BookCopy className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mx-auto mb-2 sm:mb-3" />
                <p className="text-md sm:text-lg text-foreground">Could not load Hadith collections.</p>
                <p className="text-muted-foreground text-sm sm:text-base">Ensure JSON files are defined and accessible.</p>
            </CardContent>
        </Card>
      )}
       {dataDirMissing && (isLoadingCollections || isLoadingChapters || isLoadingHadiths || collections.length === 0) && (
        <Card className="glass-card shadow-xl flex-grow flex items-center justify-center">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mx-auto mb-3" />
            <p className="text-md sm:text-lg text-foreground">Hadith Data Files Missing</p>
            <p className="text-muted-foreground text-sm sm:text-base">Please download Hadith JSON files from AhmedBaset/hadith-json (branch: ca32fd7...) and place them in the `public/data/hadith/` directory. Example: `bukhari.json`.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


    