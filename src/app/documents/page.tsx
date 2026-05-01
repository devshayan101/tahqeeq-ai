
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { summarizeDocument, type SummarizeDocumentInput } from "@/ai/flows/summarize-document";
import { FileText, Loader2, UploadCloud, NotebookText, Trash2, Eye, Library, Bookmark as BookmarkIcon, Search } from "lucide-react";
import { useState, ChangeEvent, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  contentPreview: string;
  fullContent?: string;
  uploadDate: Date;
}

export default function VirtualLibraryPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocumentForSummary, setSelectedDocumentForSummary] = useState<Document | null>(null);
  const [selectedDocumentForView, setSelectedDocumentForView] = useState<Document | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.type.startsWith("text/")) {
       toast({
        title: "Unsupported File Type",
        description: "Please upload a PDF or a plain text file (.txt, .md, .html, etc.).",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      let contentPreview = `File: ${file.name}`;
      let fullContent = "";

      if (file.type.startsWith("text/")) {
        fullContent = await file.text();
        contentPreview = fullContent.substring(0, 250) + (fullContent.length > 250 ? "..." : "");
      } else if (file.type === "application/pdf") {
        contentPreview = `PDF: ${file.name}. Summarization will be based on a conceptual text extraction.`;
        fullContent = `Simulated text content for PDF: ${file.name}. Full PDF text extraction requires a dedicated library and backend processing for OCR if the PDF is image-based. For text-based PDFs, client-side libraries can be used, but are not implemented in this demo. This content is a placeholder.`;
         toast({
          title: "PDF Uploaded (Simulated Text Extraction)",
          description: "Note: For this demo, PDF content for AI summarization is simulated. Actual text extraction is not performed.",
          variant: "info",
          duration: 7000,
        });
      }

      const newDocument: Document = {
        id: crypto.randomUUID(),
        name: file.name,
        type: file.type,
        size: file.size,
        contentPreview,
        fullContent,
        uploadDate: new Date(),
      };
      setDocuments((prev) => [newDocument, ...prev]); // Add new document to the beginning
      toast({
        title: "File Imported Successfully",
        description: `${file.name} has been added to your virtual library.`,
      });
    } catch (error) {
       toast({
        title: "Import Failed",
        description: "Could not read or process the file content.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleSummarize = async (doc: Document) => {
    if (!doc.fullContent) {
      toast({
        title: "Cannot Summarize",
        description: "Full document content is not available for summarization.",
        variant: "destructive",
      });
      return;
    }
    setSelectedDocumentForSummary(doc);
    setSummary(null);
    setIsSummarizing(true);
    try {
      const input: SummarizeDocumentInput = { documentText: doc.fullContent };
      const result = await summarizeDocument(input);
      setSummary(result.summary);
      toast({
        title: "Summary Generated",
        description: `Summary for ${doc.name} is ready.`,
      });
    } catch (error) {
      console.error("Summarization error:", error);
      toast({
        title: "Summarization Failed",
        description: "An error occurred while generating the summary.",
        variant: "destructive",
      });
      setSummary(`Failed to generate summary for ${doc.name}. Please try again.`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleDelete = (docId: string) => {
    setDocuments(docs => docs.filter(d => d.id !== docId));
    if (selectedDocumentForSummary?.id === docId) setSelectedDocumentForSummary(null);
    if (selectedDocumentForView?.id === docId) setSelectedDocumentForView(null);
    if (summary && selectedDocumentForSummary?.id === docId) setSummary(null);
    toast({
      title: "Document Deleted",
      description: "The document has been removed from your library.",
    });
  };

  const handleBookmarkDocument = (docId: string, docName: string) => {
     toast({
      title: "Document Bookmarked (Conceptual)",
      description: `Document "${docName}" added to bookmarks. This feature is conceptual.`,
    });
  };

  const filteredDocuments = useMemo(() => {
    if (!searchQuery.trim()) {
      return documents;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowerCaseQuery) ||
      doc.contentPreview.toLowerCase().includes(lowerCaseQuery) ||
      (doc.fullContent && doc.fullContent.toLowerCase().includes(lowerCaseQuery))
    );
  }, [documents, searchQuery]);

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <Card className="shadow-xl glass-card">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl sm:text-3xl">
            <Library className="mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary" /> Virtual Library
          </CardTitle>
          <CardDescription>Import, manage, search, and summarize your personal PDF and text documents for research.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="file-upload" className="sr-only">Upload Document</Label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Input id="file-upload" type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.txt,.md,.html" />
              <Button onClick={() => document.getElementById('file-upload')?.click()} disabled={isUploading} className="w-full sm:w-auto">
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                Import Document
              </Button>
              {isUploading && <p className="text-sm text-muted-foreground mt-2 sm:mt-0">Uploading document...</p>}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Supports PDF and plain text files. Summarization for PDFs uses simulated text extraction.</p>
          </div>

          {documents.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search in your library (name or content)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-background/80"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {filteredDocuments.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">Your Library Documents</h2>
          <ScrollArea className="h-[calc(100vh-28rem)] sm:h-[calc(100vh-25rem)] pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="shadow-lg hover:shadow-xl transition-shadow bg-background/70 flex flex-col glass-card">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-2 break-all">{doc.name}</CardTitle>
                        <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">.{doc.type.split('/')[1] || doc.type}</Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Size: {(doc.size / 1024).toFixed(2)} KB | Added: {doc.uploadDate.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3">{doc.contentPreview}</p>
                  </CardContent>
                  <CardFooter className="flex flex-wrap justify-end gap-2 pt-0 border-t border-border/30 mt-auto p-3">
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={!doc.fullContent} title="View Full Content">
                          <Eye className="mr-1.5 h-4 w-4" /> View
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="max-w-3xl w-[90vw] h-[80vh] flex flex-col glass-card">
                        <AlertDialogHeader className="flex-shrink-0">
                          <AlertDialogTitle className="truncate">{doc.name}</AlertDialogTitle>
                          <AlertDialogDescription>Full document content:</AlertDialogDescription>
                        </AlertDialogHeader>
                        <ScrollArea className="flex-grow my-4 rounded-md border p-4 min-h-0 bg-background/50">
                           <pre className="text-sm whitespace-pre-wrap">{doc.fullContent || "No content available."}</pre>
                        </ScrollArea>
                        <AlertDialogFooter className="flex-shrink-0">
                          <AlertDialogCancel>Close</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button variant="outline" size="sm" onClick={() => handleSummarize(doc)} disabled={isSummarizing || !doc.fullContent} title="Summarize with AI">
                      {isSummarizing && selectedDocumentForSummary?.id === doc.id ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <NotebookText className="mr-1.5 h-4 w-4" />}
                      Summarize
                    </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-yellow-400/10" title="Bookmark Document (Conceptual)" onClick={() => handleBookmarkDocument(doc.id, doc.name)}>
                        <BookmarkIcon className="h-4 w-4 text-yellow-600" />
                     </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive" title="Delete Document">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="glass-card">
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the document "{doc.name}".
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(doc.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
      
      {documents.length > 0 && filteredDocuments.length === 0 && searchQuery && (
        <div className="mt-8 text-center text-muted-foreground py-10">
          <Search size={48} className="mx-auto mb-4" />
          <p className="text-lg">No documents found matching "{searchQuery}".</p>
          <p>Try a different search term or clear the search.</p>
        </div>
      )}
      
      {documents.length === 0 && !isUploading && (
        <div className="mt-8 text-center text-muted-foreground py-10">
          <Library size={48} className="mx-auto mb-4" />
          <p className="text-lg">Your virtual library is empty.</p>
          <p>Import your first document to get started.</p>
        </div>
      )}

      {summary && selectedDocumentForSummary && (
        <Card className="mt-8 shadow-lg glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <NotebookText className="mr-2 h-5 w-5 text-accent" /> Summary for: {selectedDocumentForSummary.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] sm:h-[250px] p-1">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary}</p>
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => { setSummary(null); setSelectedDocumentForSummary(null); }}>Close Summary</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

    