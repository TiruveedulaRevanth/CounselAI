
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { therapyStyles, supportedLanguages } from "./empath-ai-client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";
import Image from 'next/image';
import { Textarea } from "./ui/textarea";

interface SettingsDialogProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  therapyStyle: string;
  setTherapyStyle: (style: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  activePersona: typeof therapyStyles[0] | { name: string };
  setActivePersona: (persona: typeof therapyStyles[0] | { name: string, prompt: string, mascot: string, mascotHint: string }) => void;
}

export default function SettingsDialog({
  selectedLanguage,
  setSelectedLanguage,
  therapyStyle,
  setTherapyStyle,
  isSettingsOpen,
  setIsSettingsOpen,
  activePersona,
  setActivePersona,
}: SettingsDialogProps) {
  
  const [customPrompt, setCustomPrompt] = useState("");
  const isCustomMode = activePersona.name === 'Custom';

  useEffect(() => {
    if (isCustomMode) {
      setCustomPrompt(therapyStyle);
    } else {
        const persona = therapyStyles.find(p => p.name === activePersona.name);
        setCustomPrompt(persona?.prompt || "");
    }
  }, [activePersona, therapyStyle, isCustomMode]);


  const handlePersonaSelect = (persona: typeof therapyStyles[0]) => {
    setActivePersona(persona);
    setTherapyStyle(persona.prompt);
  };

  const handleCustomSelect = () => {
    setActivePersona({
        name: 'Custom',
        prompt: customPrompt || "Be a helpful and supportive AI assistant.",
        mascot: '', // No mascot for custom
        mascotHint: ''
    });
    setTherapyStyle(customPrompt || "Be a helpful and supportive AI assistant.");
  }
  
  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setCustomPrompt(newPrompt);
    if (isCustomMode) {
        setTherapyStyle(newPrompt);
    }
  }

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Choose your AI persona and manage other preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div>
            <Label className="text-base font-semibold">Choose Your AI Persona</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
              {therapyStyles.map((persona) => (
                <Card
                  key={persona.name}
                  onClick={() => handlePersonaSelect(persona)}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
                    activePersona.name === persona.name && "ring-2 ring-primary shadow-lg"
                  )}
                >
                  <CardHeader className="items-center text-center p-4">
                    <Image src={persona.mascot} alt={`${persona.name} Mascot`} width={60} height={60} className="rounded-full mb-2" data-ai-hint={persona.mascotHint} />
                    <h3 className="font-semibold">{persona.name}</h3>
                    <p className="text-xs text-muted-foreground">{persona.description}</p>
                  </CardHeader>
                </Card>
              ))}
               <Card
                  onClick={handleCustomSelect}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 flex flex-col items-center justify-center text-center p-4",
                     isCustomMode && "ring-2 ring-primary shadow-lg"
                  )}
                >
                    <h3 className="font-semibold">Custom Personality</h3>
                    <p className="text-xs text-muted-foreground mt-2">Define your own ideal therapist personality.</p>
                </Card>
            </div>
          </div>
          
          {isCustomMode && (
            <div className="space-y-2">
              <Label htmlFor="custom-prompt" className="font-semibold">Your Custom Persona Prompt</Label>
              <Textarea
                id="custom-prompt"
                placeholder="Describe your ideal therapist... e.g., 'A therapist who is direct, uses humor, and gives me homework.'"
                value={customPrompt}
                onChange={handleCustomPromptChange}
                rows={4}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="language-select" className="font-semibold">Spoken Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This sets the language for both voice recognition and the AI's spoken responses.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
