
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Bot, User, Trash2, HistoryIcon, AlertTriangle, Search } from "lucide-react"; // Added Search
import { useState, useEffect, useMemo } from "react"; // Added useMemo
import type { ChatMessage } from "@/types/chat";
import { useChat } from "@/contexts/chat-context";
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
import { Input } from "@/components/ui/input"; // Added Input

export default function ChatHistoryPage() {
  const { messages, startNewChat, removeMessagesByIds } = useChat();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClearHistory = () => {
    startNewChat();
  };

  const handleDeleteEntry = (question: ChatMessage, answer?: ChatMessage) => {
    const idsToRemove: string[] = [question.id];
    if (answer) {
      idsToRemove.push(answer.id);
    }
    removeMessagesByIds(idsToRemove);
    toast({ title: "Entry Deleted", description: "The chat entry has been removed." });
  };
  
  const groupedHistory: Array<{ question: ChatMessage, answer?: ChatMessage }> = useMemo(() => {
    const groups: Array<{ question: ChatMessage, answer?: ChatMessage }> = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === 'user') {
        const question = messages[i];
        const answer = messages[i+1] && messages[i+1].role === 'assistant' ? messages[i+1] : undefined;
        groups.push({ question, answer });
        if (answer) i++; 
      }
    }
    return groups;
  }, [messages]);

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedHistory;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return groupedHistory.filter(({ question, answer }) => {
      const inQuestion = question.content.toLowerCase().includes(lowerCaseQuery);
      const inAnswer = answer ? answer.content.toLowerCase().includes(lowerCaseQuery) : false;
      return inQuestion || inAnswer;
    });
  }, [groupedHistory, searchQuery]);

  if (!mounted) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <HistoryIcon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="glass-card shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center text-2xl">
                <HistoryIcon className="mr-3 h-7 w-7 text-primary" /> Chat History
              </CardTitle>
              <CardDescription>Review your past conversations with Tahqeeq AI.</CardDescription>
            </div>
            {messages.length > 0 && (
               <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your chat history from this browser.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearHistory}>Yes, clear history</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          {messages.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search in history (question or answer)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-background/80"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <HistoryIcon size={48} className="mx-auto mb-4" />
              <p className="text-lg">No chat history yet.</p>
              <p>Your conversations will appear here once you start chatting.</p>
            </div>
          ) : filteredHistory.length === 0 && searchQuery ? (
            <div className="text-center py-10 text-muted-foreground">
              <Search size={48} className="mx-auto mb-4" />
              <p className="text-lg">No results found for "{searchQuery}".</p>
              <p>Try a different search term.</p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-22rem)] pr-2"> {/* Adjusted height to account for search bar */}
              <div className="space-y-6">
                {filteredHistory.map(({ question, answer }, groupIndex) => (
                  <Card key={question.id + '-' + groupIndex} className="p-4 glass-card shadow-md hover:shadow-lg transition-shadow">
                    <div className="mb-3 pb-3 border-b border-border/50">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground">You:</p>
                          <p className="text-sm text-foreground/90 whitespace-pre-wrap">{question.content}</p>
                          <Badge variant="outline" className="mt-1 text-xs">Mode: {question.mode}</Badge>
                           {question.domain && question.domain !== "general" && <Badge variant="outline" className="mt-1 ml-1 text-xs">Topic: {question.domain}</Badge>}
                        </div>
                      </div>
                    </div>

                    {answer ? (
                      <>
                        <div className="flex items-start gap-3">
                          <Bot className={`h-5 w-5 flex-shrink-0 mt-0.5 ${answer.isError ? 'text-destructive' : 'text-accent'}`} />
                          <div>
                            <p className={`font-semibold ${answer.isError ? 'text-destructive' : 'text-foreground'}`}>Tahqeeq AI:</p>
                            <div 
                              className={`text-sm ${answer.isError ? 'text-destructive/90' : 'text-foreground/90'} whitespace-pre-wrap`}
                              dangerouslySetInnerHTML={{ __html: answer.content.replace(/\n/g, '<br />') }}
                             />
                            {answer.detectedQueryLanguage && (
                                <Badge variant="outline" className="mt-1 text-xs">
                                    Language: {answer.detectedQueryLanguage}
                                </Badge>
                            )}
                          </div>
                        </div>
                         <div className="mt-2 text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                                <Trash2 className="mr-1 h-3 w-3" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will delete your question and the AI's response. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteEntry(question, answer)}>Delete Entry</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </>
                    ) : (
                       <div className="flex items-center gap-2 text-muted-foreground text-sm">
                         <AlertTriangle className="h-4 w-4 text-amber-500" />
                         <span>No response recorded for this question.</span>
                           <div className="mt-2 text-right flex-grow">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
                                  <Trash2 className="mr-1 h-3 w-3" /> Delete Question
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete this question?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will delete your question. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteEntry(question)}>Delete Question</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                       </div>
                    )}
                   
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

    