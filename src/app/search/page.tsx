
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { intelligentSearch, type IntelligentSearchInput, type IntelligentSearchOutput } from "@/ai/flows/intelligent-search";
import { Loader2, SearchIcon, FileText, Library as LibraryIcon } from "lucide-react"; 
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const sampleDocuments = [
  "The concept of Tawhid (Oneness of God) is central to Islamic belief.",
  "Salah (prayer) is one of the Five Pillars of Islam, performed five times a day.",
  "The Quran is considered by Muslims to be the literal word of God revealed to Prophet Muhammad.",
  "Zakat (charity) is an obligatory act of giving a portion of one's wealth to the needy.",
  "Hajj (pilgrimage to Mecca) is a duty for Muslims who are physically and financially able to perform it.",
];

interface SearchSource {
  id: string;
  label: string;
  icon: React.ElementType;
  enabled: boolean;
  conceptual?: boolean;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IntelligentSearchOutput['results']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [searchSources, setSearchSources] = useState<SearchSource[]>([
    { id: 'local_samples', label: 'Local Samples', icon: FileText, enabled: true },
    { id: 'virtual_library', label: 'My Virtual Library (Uploaded Docs)', icon: LibraryIcon, enabled: false, conceptual: true },
  ]);

  const handleSourceToggle = (id: string) => {
    setSearchSources(prevSources =>
      prevSources.map(source =>
        source.id === id ? { ...source, enabled: !source.enabled } : source
      )
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a search term.",
        variant: "destructive",
      });
      return;
    }

    const activeSources = searchSources.filter(s => s.enabled);
    if (activeSources.length === 0) {
      toast({
        title: "No Source Selected",
        description: "Please select at least one library to search.",
        variant: "warning",
      });
      return;
    }

    setIsLoading(true);
    setResults([]);

    let documentsToSearch: string[] = [];
    let searchPerformed = false;
    let conceptualSearchMessage = "";

    if (activeSources.find(s => s.id === 'local_samples')) {
      documentsToSearch = [...documentsToSearch, ...sampleDocuments];
      searchPerformed = true; 
    }
    
    if (activeSources.find(s => s.id === 'virtual_library')) {
        documentsToSearch = [...documentsToSearch, "User uploaded PDF content about Islamic finance (placeholder)."];
        conceptualSearchMessage += "Virtual Library search is conceptual; using placeholder for uploaded document content. ";
        searchPerformed = true;
    }
    
    if (conceptualSearchMessage) {
        toast({
            title: "Conceptual Search Notice",
            description: conceptualSearchMessage.trim(),
            variant: "info",
            duration: 7000,
        });
    }

    if (!searchPerformed || documentsToSearch.length === 0) {
        toast({
            title: "Search Not Performed",
            description: "Selected sources are not yet fully implemented for direct search or returned no documents for this demo.",
            variant: "warning",
        });
        setIsLoading(false);
        return;
    }

    try {
      const input: IntelligentSearchInput = {
        query,
        documents: documentsToSearch, 
      };
      const output = await intelligentSearch(input);
      const sortedResults = output.results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      setResults(sortedResults);

      if (sortedResults.length === 0) {
        toast({
          title: "No Results",
          description: "No documents matched your query from the selected sources.",
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <SearchIcon className="mr-2 h-6 w-6 text-primary" /> Intelligent Library Search
          </CardTitle>
          <CardDescription>
            Use AI to semantically search across selected Islamic libraries and texts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <Input
              type="search"
              placeholder="Search for concepts, e.g., 'Pillars of Islam', 'Tafsir of Surah Al-Fatiha'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow text-base"
              aria-label="Search query"
            />

            <div className="space-y-3">
              <Label className="text-md font-medium">Search In:</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchSources.map(source => (
                  <div key={source.id} className="flex items-center space-x-2 p-3 rounded-md border border-border/50 bg-background/30 hover:bg-accent/10">
                    <Checkbox
                      id={`source-${source.id}`}
                      checked={source.enabled}
                      onCheckedChange={() => handleSourceToggle(source.id)}
                      aria-label={`Search in ${source.label}`}
                    />
                    <source.icon className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor={`source-${source.id}`} className="text-sm font-medium leading-none cursor-pointer">
                      {source.label}
                    </Label>
                  </div>
                ))}
              </div>
               <p className="text-xs text-muted-foreground">
                Note: Full text search for Quran, Hadith, and Virtual Library is currently conceptual and uses sample data for AI demonstration.
              </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto text-base py-3 px-6">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <SearchIcon className="mr-2 h-5 w-5" />
              )}
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Search Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index} className="glass-card shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                     <FileText className="mr-2 h-5 w-5 text-accent" /> Document Snippet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {result.document}
                  </p>
                  <p className="text-xs text-primary mt-2 font-medium">
                    Relevance: {(result.relevanceScore * 100).toFixed(0)}%
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
