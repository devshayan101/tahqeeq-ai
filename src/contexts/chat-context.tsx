
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage, ChatMode } from '@/types/chat';
import { tahqeeqChat, type TahqeeqChatInput, type TahqeeqChatOutput } from "@/ai/flows/tahqeeq-chat-flow";
import { useToast } from "@/hooks/use-toast";

interface ChatContextType {
  messages: ChatMessage[];
  currentQuery: string;
  setCurrentQuery: (query: string) => void;
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  chatMode: ChatMode;
  setChatMode: (mode: ChatMode) => void;
  isLoading: boolean;
  sendMessage: (queryToSend?: string) => Promise<void>;
  startNewChat: () => void;
  removeMessagesByIds: (idsToRemove: string[]) => void;
  domainPopoverOpen: boolean;
  setDomainPopoverOpen: (isOpen: boolean) => void;
  initialMessagesLoaded: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuery, setCurrentQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("general");
  const [chatMode, setChatMode] = useState<ChatMode>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [domainPopoverOpen, setDomainPopoverOpen] = useState(false);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("ChatProvider: useEffect for loading messages started.");
    try {
      const savedMessages = localStorage.getItem("tahqeeqChatMessages");
      console.log("ChatProvider: Attempting to load messages from localStorage. Found:", savedMessages ? "Data" : "No Data");
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages)) {
            console.log("ChatProvider: Successfully parsed messages:", parsedMessages.length, "messages found.");
            setMessages(parsedMessages);
        } else {
            console.warn("ChatProvider: Parsed messages from localStorage is not an array. Clearing invalid data.");
            localStorage.removeItem("tahqeeqChatMessages");
        }
      }
    } catch (error) {
      console.error("ChatProvider: Error parsing messages from localStorage. Clearing corrupted data.", error);
      localStorage.removeItem("tahqeeqChatMessages");
    } finally {
      setInitialMessagesLoaded(true);
      console.log("ChatProvider: initialMessagesLoaded set to true.");
    }
  }, []);

  useEffect(() => {
    // Only save to localStorage if initial loading is done, to prevent overwriting on first render
    if (initialMessagesLoaded) {
      try {
        if (messages.length > 0) {
          console.log("ChatProvider: Saving messages to localStorage:", messages.length, "messages.");
          localStorage.setItem("tahqeeqChatMessages", JSON.stringify(messages));
        } else {
          // Only remove if item exists, to avoid unnecessary operations if it was already empty/cleared
          if (localStorage.getItem("tahqeeqChatMessages")) {
            console.log("ChatProvider: Clearing messages from localStorage as messages array is empty.");
            localStorage.removeItem("tahqeeqChatMessages");
          }
        }
      } catch (error) {
        console.error("ChatProvider: Error saving messages to localStorage:", error);
      }
    }
  }, [messages, initialMessagesLoaded]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentQuery("");
    setSelectedDomain("general");
    // localStorage.removeItem("tahqeeqChatMessages"); // This will be handled by the useEffect above
    toast({
      title: "New Chat Started",
      description: "Previous conversation has been cleared.",
    });
    console.log("ChatProvider: New chat started.");
  }, [toast]);

  const removeMessagesByIds = useCallback((idsToRemove: string[]) => {
    setMessages(prevMessages => prevMessages.filter(msg => !idsToRemove.includes(msg.id)));
    console.log("ChatProvider: Messages removed by IDs:", idsToRemove);
  }, []);

  const sendMessage = useCallback(async (queryOverride?: string) => {
    const queryToProcess = queryOverride !== undefined ? queryOverride : currentQuery;
    if (!queryToProcess.trim()) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: queryToProcess,
      mode: chatMode,
      timestamp: new Date().toISOString(),
      domain: selectedDomain,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    if (queryOverride === undefined) { 
        setCurrentQuery("");
    }
    if (domainPopoverOpen) setDomainPopoverOpen(false);

    try {
      let queryLanguageHint = 'en'; 
      if (/[ء-ي]/.test(queryToProcess)) queryLanguageHint = 'ar'; 
      else if (/[\u0600-\u06FF]/.test(queryToProcess)) queryLanguageHint = 'ur'; // Broader check for Perso-Arabic scripts (Urdu, Farsi, etc.)
      // Add more specific hints if needed for Hindi etc.
      
      console.log(`ChatProvider: Sending message to AI. Query: "${queryToProcess}", Mode: ${chatMode}, Domain: ${selectedDomain}, Hint: ${queryLanguageHint}`);
      
      const input: TahqeeqChatInput = {
        query: queryToProcess,
        mode: chatMode,
        queryLanguageHint: queryLanguageHint,
      };
      const result = await tahqeeqChat(input);
      console.log("ChatProvider: AI response received:", result);

      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: result.answer,
        references: result.references,
        mode: result.modeUsed,
        timestamp: new Date().toISOString(),
        detectedQueryLanguage: result.detectedQueryLanguage,
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("ChatProvider: Chat error:", error);
      toast({
        title: "Error Getting Response",
        description: "An AI error occurred. Please try again.",
        variant: "destructive",
      });
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        mode: chatMode,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      console.log("ChatProvider: Finished processing sendMessage.");
    }
  }, [currentQuery, chatMode, selectedDomain, toast, domainPopoverOpen]);

  return (
    <ChatContext.Provider value={{
      messages,
      currentQuery,
      setCurrentQuery,
      selectedDomain,
      setSelectedDomain,
      chatMode,
      setChatMode,
      isLoading,
      sendMessage,
      startNewChat,
      removeMessagesByIds,
      domainPopoverOpen,
      setDomainPopoverOpen,
      initialMessagesLoaded
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
