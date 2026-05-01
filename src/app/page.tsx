
"use client";

import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/contexts/chat-context";
import {
    Bot, User, Feather, Brain, Loader2, Send, PlusCircle, Languages, Bookmark, Share2, ThumbsUp, ThumbsDown, Copy,
    ListFilter, Info, Heart, ShieldCheck, Baseline, Repeat2, PenTool, Milestone, CalendarDays, Mic, Users as UsersIcon,
    BookOpenText, Scale, MessageSquarePlus, Users
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const staticSuggestions: Array<{ text: string; icon: React.ElementType; color: string }> = [
  { text: "What is the Hanafi ruling on missed prayers?", icon: Scale, color: "text-green-500" },
  { text: "Explain the concept of Tawassul in Islam", icon: ShieldCheck, color: "text-purple-500" },
  { text: "Teachings of Ghaus-e-Azam on Taqwa?", icon: Heart, color: "text-red-500" },
  { text: "What are the main points of Seerat un Nabi (ﷺ)?", icon: Milestone, color: "text-amber-500" },
];

const knowledgeDomains = [
  { value: "general", label: "General", icon: Info },
  { value: "quran", label: "Quran", icon: BookOpenText },
  { value: "hadith", label: "Hadith", icon: BookOpenText },
  { value: "tafsir", label: "Tafsir (Interpretation)", icon: MessageSquarePlus },
  { value: "fiqh", label: "Fiqh (Islamic Jurisprudence)", icon: Scale },
  { value: "tasawwuf", label: "Tasawwuf", icon: Heart },
  { value: "kalam", label: "Ilm-e-Kalam (Aqeedah)", icon: ShieldCheck },
  { value: "nahw", label: "Ilm-e-Nahw (Arabic Grammar)", icon: Baseline },
  { value: "sarf", label: "Ilm-e-Sarf (Arabic Morphology)", icon: Repeat2 },
  { value: "adab", label: "Adab (Islamic Etiquette/Literature)", icon: PenTool },
  { value: "seerat", label: "Seerat (Prophetic Biography)", icon: Milestone },
  { value: "tareekh", label: "Tareekh (Islamic History)", icon: CalendarDays },
];


declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function HomePage() {
  const {
    messages,
    currentQuery,
    setCurrentQuery,
    selectedDomain,
    setSelectedDomain,
    chatMode,
    setChatMode,
    isLoading,
    sendMessage,
    startNewChat, // Use this from context
    domainPopoverOpen,
    setDomainPopoverOpen,
    initialMessagesLoaded,
  } = useChat();

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isRecordingRef = useRef(isRecording); 

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);


  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = false;
        recognitionInstance.lang = 'en-US'; 
        recognitionInstance.interimResults = false;
        recognitionInstance.maxAlternatives = 1;

        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCurrentQuery(transcript);
          setIsRecording(false); // Stop recording after result
          toast({ title: "Voice input captured!"});
           if (inputRef.current) {
            inputRef.current.style.height = 'auto'; // Reset first
            const maxHeight = parseInt(getComputedStyle(inputRef.current).getPropertyValue('max-height'), 10) || 192; // 192px is max-h-48
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, maxHeight)}px`;
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          let errorMessage = "Voice recognition error.";
          if (event.error === 'no-speech') {
            errorMessage = "No speech detected. Please try again.";
          } else if (event.error === 'audio-capture') {
            errorMessage = "Microphone problem. Please check your microphone.";
          } else if (event.error === 'not-allowed') {
            errorMessage = "Permission to use microphone was denied.";
          }
          toast({ variant: "destructive", title: "Voice Input Error", description: errorMessage });
          if(isRecordingRef.current) setIsRecording(false); // Ensure recording state is reset
        };
        
        recognitionInstance.onend = () => {
          // Only set isRecording to false if it was true.
          // This prevents setting it to false if 'not-allowed' error occurred before starting.
          if (isRecordingRef.current) { 
             setIsRecording(false);
          }
        };
        recognitionRef.current = recognitionInstance;
      } else {
         console.warn("Speech Recognition API not supported in this browser.");
      }
    }
  }, [setCurrentQuery, toast]); // Removed isRecording from dependency array


  const handleSendMessage = useCallback(async (queryToSend?: string) => { 
    const finalQuery = queryToSend !== undefined ? queryToSend : currentQuery;
    if (!finalQuery.trim()) return;

    await sendMessage(finalQuery); 
    
    if (queryToSend === undefined) { 
       setCurrentQuery(""); 
    }

    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset height after sending
    }
    inputRef.current?.focus();
  }, [sendMessage, currentQuery, setCurrentQuery, chatMode, selectedDomain, domainPopoverOpen, setDomainPopoverOpen]);

  const handleSuggestionClick = useCallback(async (suggestionText: string) => { 
    setCurrentQuery(suggestionText); 
    await handleSendMessage(suggestionText); 
  }, [setCurrentQuery, handleSendMessage]);


  const getLanguageName = (code?: string) => {
    if (!code) return 'Unknown';
    const langMap: { [key: string]: string } = {
      'en': 'English', 'ur': 'Urdu', 'ar': 'Arabic', 'hi': 'Hindi', 'roman-ur': 'Roman Urdu'
    };
    return langMap[code.toLowerCase()] || code;
  }

  const getMessageClasses = (languageCode?: string) => {
    if (languageCode === 'ar') return 'font-arabic text-right';
    if (languageCode === 'ur') return 'font-urdu text-right';
    if (languageCode === 'roman-ur') return 'font-roman-urdu text-left'; 
    if (languageCode === 'hi') return 'text-left'; 
    return 'text-left';
  };

  const getMessageDir = (languageCode?: string) => {
    if (languageCode === 'ar' || languageCode === 'ur') return 'rtl';
    return 'ltr';
  };

  const handleFeedback = (messageId: string, feedbackType: 'like' | 'dislike') => {
    console.log("Feedback for message:", messageId, "Type:", feedbackType);
    toast({
      title: "Feedback Received (Conceptual)",
      description: `You ${feedbackType}d message ${messageId}. This feature is conceptual.`,
    });
  };

  const handleBookmark = (messageId: string) => {
    console.log("Bookmark message:", messageId);
    toast({
      title: "Bookmarked (Conceptual)",
      description: `Message ${messageId} bookmarked. This feature is conceptual.`,
    });
  };

  const handleCopyToClipboard = (msgContent: string) => {
    navigator.clipboard.writeText(msgContent.replace(/<strong>(.*?)<\/strong>/g, '$1')) 
      .then(() => {
        toast({ title: "Copied to clipboard!" });
      })
      .catch(err => {
        toast({ variant: "destructive", title: "Copy failed", description: "Could not copy text." });
        console.error("Copy failed", err);
      });
  };

  const handleShare = (msgContent: string) => {
     navigator.clipboard.writeText(msgContent.replace(/<strong>(.*?)<\/strong>/g, '$1'))
      .then(() => {
         toast({ title: "Content Copied (Share PDF Conceptual)", description: "Answer copied. Generating a branded PDF is a planned feature." });
      })
      .catch(err => {
        toast({ variant: "destructive", title: "Share (copy) failed", description: "Could not copy text for sharing." });
        console.error("Share (copy) failed", err);
      });
  };

  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      toast({ variant: "destructive", title: "Voice Input Not Available", description: "Speech recognition is not initialized or supported in your browser." });
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
      // onend will set isRecording to false
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          recognitionRef.current.start();
          toast({ title: "Listening...", description: "Speak now." });
        })
        .catch(err => {
          console.error("Microphone permission error:", err);
          toast({ variant: "destructive", title: "Microphone Access Denied", description: "Please allow microphone access in your browser settings."});
          if(isRecording) setIsRecording(false);
        });
    }
  };
  
  const isSendModeActive = currentQuery.trim() !== "";
  const currentDomainObject = knowledgeDomains.find(d => d.value === selectedDomain);
  const currentDomainLabel = currentDomainObject?.label || "Topic";
  const currentPlaceholder = `Ask anything${selectedDomain && selectedDomain !== "general" ? ` about ${currentDomainLabel}` : ''}...`;

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuery(e.target.value);
    if (domainPopoverOpen && e.target.value.length > 0) {
      setDomainPopoverOpen(false);
    }
    // Removed direct JS height manipulation during typing
    // const textarea = e.target;
    // textarea.style.height = 'auto'; 
    // textarea.style.height = `${textarea.scrollHeight}px`;
  };


  if (!initialMessagesLoaded) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Header Section (App title, New Chat icon) */}
      <div className="border-b border-border/30 p-3 sm:p-4 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <MessageSquarePlus className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            <div>
              <CardTitle className="text-lg sm:text-xl">
                Tahqeeq AI
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Ask in English, Urdu, Arabic, Hindi, or Roman Urdu.
              </CardDescription>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Display Area (Scrollable) */}
      <div className="flex-grow overflow-y-auto bg-background/10 pb-28">
         {messages.length > 0 || isLoading ? (
           <div className="p-3 sm:p-4"> {/* Padding for the message list itself */}
            <div className="space-y-5">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={cn(
                      "max-w-[85%] p-3 rounded-xl shadow-lg",
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-card text-card-foreground rounded-tl-none border border-border/30 backdrop-blur-sm bg-opacity-70 dark:bg-opacity-50",
                      msg.isError ? 'border-destructive' : ''
                  )}>
                    <div className="flex items-start gap-2.5">
                      {msg.role === "assistant" && <Bot className={`h-5 w-5 flex-shrink-0 mt-0.5 ${msg.isError ? 'text-destructive' : 'text-accent'}`} />}
                      <div className="flex-grow">
                        <div
                          className={cn(
                            "text-sm leading-relaxed whitespace-pre-wrap",
                            getMessageClasses(msg.detectedQueryLanguage)
                          )}
                          dir={getMessageDir(msg.detectedQueryLanguage)}
                          dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }}
                        />
                        <div className="text-[10px] text-muted-foreground/80 dark:text-muted-foreground/60 mt-2 flex flex-wrap gap-y-1 justify-between items-center">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge variant="outline" className="font-normal text-[9px] px-1.5 py-0.5 border-border/50 bg-background/30">Mode: {msg.mode}</Badge>
                              {msg.domain && msg.domain !== "general" && <Badge variant="outline" className="font-normal text-[9px] px-1.5 py-0.5 border-border/50 bg-background/30">Topic: {knowledgeDomains.find(d => d.value === msg.domain)?.label || msg.domain}</Badge>}
                              {msg.role === "assistant" && msg.detectedQueryLanguage && (
                                <Badge variant="outline" className="font-normal flex items-center text-[9px] px-1.5 py-0.5 border-border/50 bg-background/30">
                                  <Languages className="mr-1 h-2.5 w-2.5"/> {getLanguageName(msg.detectedQueryLanguage)}
                                </Badge>
                              )}
                            </div>
                            {msg.role === "assistant" && !msg.isError && (
                              <div className="flex gap-0 items-center">
                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-accent/10" title="Copy" onClick={() => handleCopyToClipboard(msg.content)}> <Copy className="h-3 w-3" /> </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-blue-500/10" title="Share (Conceptual PDF)" onClick={() => handleShare(msg.content)}> <Share2 className="h-3 w-3 text-blue-600" /> </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-yellow-500/10" title="Bookmark (Conceptual)" onClick={() => handleBookmark(msg.id)}> <Bookmark className="h-3 w-3 text-yellow-600" /> </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-green-500/10" title="Like" onClick={() => handleFeedback(msg.id, 'like')}> <ThumbsUp className="h-3 w-3 text-green-600" /> </Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-500/10" title="Dislike" onClick={() => handleFeedback(msg.id, 'dislike')}> <ThumbsDown className="h-3 w-3 text-red-600" /> </Button>
                              </div>
                            )}
                        </div>
                      </div>
                      {msg.role === "user" && <User className="h-5 w-5 flex-shrink-0 text-primary-foreground/90 ml-1.5 mt-0.5" />}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[75%] p-3 rounded-xl shadow-lg bg-card text-card-foreground rounded-tl-none border border-border/30 backdrop-blur-sm bg-opacity-70 dark:bg-opacity-50 animate-pulse">
                    <div className="flex items-center gap-2.5">
                        <Bot className="h-5 w-5 text-accent" />
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Generating response...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        ) : (
          <div className="h-full flex-grow flex flex-col items-center justify-center text-center text-muted-foreground p-4 sm:p-8">
              <MessageSquarePlus size={48} className="mb-4 text-primary opacity-70" />
              <p className="text-lg font-medium text-foreground mb-1">Start a conversation with Tahqeeq AI</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Ask about various Islamic topics. Use the filter icon in the input box to specify a topic.
              </p>
              {staticSuggestions.length > 0 && (
                  <div className="w-full max-w-lg">
                      <p className="text-xs font-semibold mb-2.5 text-foreground/70">Try these examples:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {staticSuggestions.map((suggestion) => {
                              const SuggestionIcon = suggestion.icon;
                              return (
                                  <Button
                                      key={suggestion.text}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleSuggestionClick(suggestion.text)}
                                      className={cn(
                                          "w-full text-left justify-start h-auto py-2.5 px-3 bg-background/60 hover:bg-accent/10 border-border/50 shadow-sm hover:shadow-md transition-all text-foreground/90 rounded-lg",
                                          suggestion.text.match(/[ء-ي]/) || suggestion.text.match(/[\u0600-\u06FF]/) ? 'font-urdu text-right' : (suggestion.text.match(/[\u0900-\u097F]/) ? '' : '')
                                      )}
                                      title={suggestion.text}
                                  >
                                      <SuggestionIcon className={cn("h-4 w-4 shrink-0", suggestion.color, suggestion.text.match(/[ء-ي]/) || suggestion.text.match(/[\u0600-\u06FF]/) ? 'ml-2 order-last' : 'mr-2')} />
                                      <span className="text-xs truncate">{suggestion.text}</span>
                                  </Button>
                              );
                          })}
                      </div>
                  </div>
              )}
              <div className="mt-8 w-full max-w-xs">
                <Button
                  asChild
                  variant="outline"
                  className="w-full py-3 border-primary/30 hover:bg-primary/10 text-primary hover:text-primary shadow-sm transition-all hover:shadow-md rounded-lg"
                >
                  <Link href="/community">
                    <Users className="mr-2 h-5 w-5" />
                    Join the Tahqeeq Community
                  </Link>
                </Button>
              </div>
          </div>
        )}
      </div>

      {/* Input Form Area (Page ke neeche sticky footer) */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (!isLoading && isSendModeActive && currentQuery.trim()) handleSendMessage(); }}
        className="sticky bottom-0 left-0 right-0 z-10 bg-background border-t border-border/30 p-2 sm:p-3 flex-shrink-0"
      >
        <div className="relative flex-grow w-full"> {/* Main Input container, for Textarea and all absolute controls */}
            <Textarea
                ref={inputRef}
                placeholder={currentPlaceholder}
                value={currentQuery}
                onChange={handleTextareaInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isLoading && isSendModeActive && currentQuery.trim()) { 
                    e.preventDefault(); 
                    handleSendMessage(); 
                  }
                }}
                rows={1}
                className="flex-grow resize-none bg-background/80 focus-within:bg-background text-sm sm:text-base px-3 pb-14 w-full rounded-xl border-input focus:border-primary/50 transition-colors duration-150 shadow-sm max-h-48 overflow-y-auto" 
                disabled={isLoading}
            />

            {/* Controls Bar: Absolutely positioned at the bottom INSIDE the Textarea's visual area */}
            <div className="absolute bottom-1.5 left-0 right-0 flex items-center justify-between z-10 px-2 py-1">
                {/* Left: Filter Icon */}
                <Popover open={domainPopoverOpen} onOpenChange={setDomainPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                        aria-label="Select topic filter"
                        onClick={() => !currentQuery.trim() && setDomainPopoverOpen(prev => !prev)}
                        disabled={isLoading || !!currentQuery.trim()}
                        title={isLoading ? "Loading..." : (currentQuery.trim() ? "Clear query to change topic" : (currentDomainObject?.value !== 'general' ? `Topic: ${currentDomainObject?.label}` : "Select Topic"))}
                    >
                    <ListFilter className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[calc(100vw-2rem)] sm:w-auto max-w-xs md:max-w-sm p-2 flex flex-col mb-2 max-h-[70vh]"
                    align="start" 
                    side="top"
                    sideOffset={8}
                >
                    <p className="text-xs text-muted-foreground px-2 pb-2 pt-1 flex-shrink-0">Filter by topic:</p>
                    <ScrollArea className="flex-grow min-h-0"> 
                        <ToggleGroup
                            type="single"
                            value={selectedDomain}
                            onValueChange={(value) => {
                                if (value) {
                                    setSelectedDomain(value);
                                    setDomainPopoverOpen(false); 
                                    inputRef.current?.focus();
                                }
                            }}
                            aria-label="Knowledge Domain Filter"
                            className="flex flex-col gap-1 p-1 items-stretch"
                        >
                            {knowledgeDomains.map((domain) => {
                                const DomainIcon = domain.icon;
                                return (
                                <ToggleGroupItem
                                    key={domain.value}
                                    value={domain.value}
                                    aria-label={domain.label}
                                    title={domain.label}
                                    className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground text-xs px-2.5 py-2 h-auto w-full justify-start"
                                >
                                    <DomainIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                                    {domain.label}
                                </ToggleGroupItem>
                                );
                            })}
                        </ToggleGroup>
                    </ScrollArea>
                </PopoverContent>
                </Popover>

                {/* Center: Student/Scholar Mode Toggle */}
                <ToggleGroup
                    type="single"
                    value={chatMode}
                    onValueChange={(value) => { if (value) setChatMode(value as "student" | "scholar"); }}
                    aria-label="Chat Mode"
                    className="" 
                    disabled={isLoading}
                >
                <ToggleGroupItem value="student" aria-label="Student Mode" title="Student Mode" className="text-xs px-2 py-1 h-auto data-[state=on]:bg-primary/20 data-[state=on]:text-primary hover:bg-primary/10">
                    <Feather className="mr-1.5 h-3.5 w-3.5" /> Student
                </ToggleGroupItem>
                <ToggleGroupItem value="scholar" aria-label="Scholar Mode" title="Scholar Mode" className="text-xs px-2 py-1 h-auto data-[state=on]:bg-primary/20 data-[state=on]:text-primary hover:bg-primary/10">
                    <Brain className="mr-1.5 h-3.5 w-3.5" /> Scholar
                </ToggleGroupItem>
                </ToggleGroup>

                {/* Right: Dynamic Send/Mic Button */}
                 <Button
                    type={isLoading ? "button" : isSendModeActive ? "submit" : "button"}
                    size="icon"
                    variant={!isLoading && !isSendModeActive && isRecording ? "destructive" : "default"}
                    className={cn(
                        "h-9 w-9 aspect-square transition-all duration-200 ease-in-out rounded-full shadow-md hover:shadow-lg",
                        isRecording && !isSendModeActive && !isLoading && "animate-pulse",
                        isLoading ? "bg-muted text-muted-foreground cursor-not-allowed" : 
                        isSendModeActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    )}
                    onClick={isLoading ? undefined : (isSendModeActive ? undefined : handleToggleRecording) }
                    disabled={isLoading || (isSendModeActive && !currentQuery.trim())}
                    title={
                        isLoading ? "Sending..." : 
                        isSendModeActive ? "Send" : 
                        (isRecording ? "Stop Voice Input" : "Start Voice Input")
                    }
                >
                { isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 
                  (isSendModeActive ? <Send className="h-4 w-4" /> : 
                  <Mic className="h-4 w-4" />)
                }
                </Button>
            </div>
        </div>
      </form>
    </div>
  );
}

      