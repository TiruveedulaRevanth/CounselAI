"use client";

import { personalizeTherapyStyle } from "@/ai/flows/therapy-style-personalization";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { BrainCircuit, Mic, Plus, Send, Square } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import ChatMessage from "./chat-message";
import SettingsDialog from "./settings-dialog";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "./ui/sidebar";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type Chat = {
  id: string;
  name: string;
  messages: Message[];
};

export const therapyStyles = [
  {
    name: "Empathetic Friend",
    prompt:
      "An empathetic, supportive, and non-judgmental friend who listens carefully and responds in a calm, reassuring tone. Adapt to the user's emotional state.",
  },
  {
    name: "Mindfulness Coach",
    prompt:
      "A mindfulness coach who helps the user stay present and grounded. Use techniques from Mindfulness-Based Stress Reduction (MBSR) and provide guided exercises.",
  },
  {
    name: "Cognitive Behavioral (CBT)",
    prompt:
      "A therapist using Cognitive Behavioral Therapy (CBT) techniques. Help the user identify and challenge negative thought patterns and develop healthier coping strategies.",
  },
  {
    name: "Solution-Focused",
    prompt:
      "A solution-focused therapist who concentrates on the user's strengths and helps them build solutions rather than dwelling on problems. Focus on future possibilities.",
  },
  {
    name: "Narrative Therapist",
    prompt:
      "A narrative therapist who helps the user re-author their life stories. Focus on separating the person from the problem and empowering them to see their life from a new perspective.",
  },
];

const initialMessage: Message = {
  id: "1",
  role: "assistant",
  content:
    "Hello! I'm CounselAI, your personal mental health assistant. I'm here to listen and support you. You can type a message or tap the microphone to begin.",
};


export default function EmpathAIClient() {
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userInput, setUserInput] = useState("");

  // Settings state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [therapyStyle, setTherapyStyle] = useState(therapyStyles[0].prompt);

  const speechRecognition = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSpokenInitialMessage = useRef(false);

  // Load chats from local storage on initial render
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem("counselai-chats");
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        if (Array.isArray(parsedChats) && parsedChats.length > 0) {
          setChats(parsedChats);
          setActiveChatId(parsedChats[0].id);
        } else {
          createNewChat();
        }
      } else {
        createNewChat();
      }
    } catch (error) {
      console.error("Failed to load chats from local storage:", error);
      createNewChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save chats to local storage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("counselai-chats", JSON.stringify(chats));
    }
  }, [chats]);
  
  const createNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      name: "New Chat",
      messages: [initialMessage],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }

  const activeChat = chats.find(chat => chat.id === activeChatId);

  const updateMessages = (updater: (prevMessages: Message[]) => Message[]) => {
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChatId
          ? { ...chat, messages: updater(chat.messages) }
          : chat
      )
    );
  };
  
  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  }, [selectedVoice]);

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          if (!selectedVoice) {
            const preferredVoice = availableVoices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || availableVoices[0];
            setSelectedVoice(preferredVoice);
          }
        }
      };
      const voiceInterval = setInterval(loadVoices, 200);
      loadVoices();
      
      if (!hasSpokenInitialMessage.current && activeChat?.messages.length === 1) {
         setTimeout(() => {
          speakText(activeChat.messages[0].content);
          hasSpokenInitialMessage.current = true;
        }, 500); 
      }
      return () => clearInterval(voiceInterval);
    }
  }, [activeChat, selectedVoice, speakText]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setUserInput(finalTranscript + interimTranscript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'network') {
            toast({
              variant: "destructive",
              title: "Speech Recognition Error",
              description: "Network error. Please check your connection and try again.",
            });
        } else if (event.error !== 'no-speech') {
            toast({
              variant: "destructive",
              title: "Speech Recognition Error",
              description: event.error,
            });
        }
        setIsListening(false);
      };

      speechRecognition.current = recognition;
    }
  }, [toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isLoading]);

  const handleMicClick = () => {
    handleStopSpeaking();
    if (isListening) {
      speechRecognition.current?.stop();
      if(userInput.trim()) {
        handleSend(userInput);
      }
    } else {
      speechRecognition.current?.start();
    }
    setIsListening(!isListening);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    
    updateMessages((prev) => [...prev, newUserMessage]);
    
    // Update chat name if it's the first user message
    if (activeChat && activeChat.messages.length === 1) { // 1 because it includes initial message
       setChats(prev => prev.map(chat => chat.id === activeChatId ? {...chat, name: text.substring(0, 30)} : chat))
    }

    setUserInput("");
    setIsLoading(true);
    handleStopSpeaking();
    setIsListening(false);
    if(speechRecognition.current) {
        speechRecognition.current.stop();
    }

    try {
      const result = await personalizeTherapyStyle({
        therapyStyle: therapyStyle,
        userInput: text,
      });

      if (result.response) {
        const newAssistantMessage: Message = {
          id: Date.now().toString() + "-ai",
          role: "assistant",
          content: result.response,
        };
        updateMessages((prev) => [...prev, newAssistantMessage]);
        speakText(result.response);
      } else {
        throw new Error("Received an empty response from the AI.");
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description:
          "Sorry, I encountered an error. Please try again.",
      });
      const assistantErrorMessage: Message = {
        id: Date.now().toString() + "-ai-error",
        role: "assistant",
        content: "I'm sorry, I seem to be having trouble connecting. Please try again in a moment.",
      }
      updateMessages((prev) => [...prev, assistantErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(userInput);
    }
  }

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <BrainCircuit className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold font-headline">CounselAI</h1>
              </div>
              <Button variant="ghost" size="icon" onClick={createNewChat}>
                  <Plus className="h-6 w-6"/>
                  <span className="sr-only">New Chat</span>
              </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {chats.map(chat => (
               <SidebarMenuItem key={chat.id}>
                 <SidebarMenuButton 
                  onClick={() => setActiveChatId(chat.id)}
                  isActive={chat.id === activeChatId}
                  className="truncate"
                 >
                   {chat.name}
                 </SidebarMenuButton>
               </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SettingsDialog
              voices={voices}
              selectedVoice={selectedVoice}
              setSelectedVoice={setSelectedVoice}
              therapyStyle={therapyStyle}
              setTherapyStyle={setTherapyStyle}
            />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background font-body text-foreground">
          <header className="flex md:hidden items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold font-headline">CounselAI</h1>
            </div>
          </header>

          <main className="flex-1 flex flex-col p-4 md:p-6 min-h-0">
            <Card className="flex-1 flex flex-col shadow-lg">
              <CardContent className="flex-1 p-2 md:p-4 flex">
                <ScrollArea className="flex-1 h-full">
                  <div className="space-y-4 pr-4">
                    {activeChat?.messages.map((msg) => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {isListening && userInput && (
                      <ChatMessage message={{id: 'interim', role: 'user', content: userInput}} isInterim/>
                    )}
                    {isLoading && <ChatMessage.Loading />}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </main>

          <footer className="p-4 border-t">
            <div className="flex items-start gap-2 max-w-2xl mx-auto">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message or use the microphone..."
                className="flex-1 resize-none"
                rows={1}
                disabled={isLoading || isListening || !activeChatId}
              />
              {isSpeaking ? (
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-10 w-10 shrink-0"
                  onClick={handleStopSpeaking}
                >
                  <Square className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  className={`h-10 w-10 shrink-0 ${
                    isListening ? "bg-destructive" : "bg-primary"
                  }`}
                  onClick={handleMicClick}
                  disabled={isLoading || !activeChatId}
                >
                  <Mic className="h-5 w-5" />
                </Button>
              )}
              <Button
                size="icon"
                onClick={() => handleSend(userInput)}
                disabled={!userInput.trim() || isLoading || !activeChatId}
                className="h-10 w-10 shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2 h-4">
                {isListening ? "Listening... Click the mic to send." : isSpeaking ? "Speaking..." : isLoading ? "" : activeChatId ? "Press Enter to send. Use Shift+Enter for a new line." : "Create a new chat to begin."}
            </p>
          </footer>
        </div>
       </SidebarInset>
    </>
  );
}
