
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import { useState } from "react";
import { therapyStyles } from "./empath-ai-client";
import { Input } from "./ui/input";

interface SettingsDialogProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice | null) => void;
  therapyStyle: string;
  setTherapyStyle: (style: string) => void;
  children?: React.ReactNode;
}

export default function SettingsDialog({
  voices,
  selectedVoice,
  setSelectedVoice,
  therapyStyle,
  setTherapyStyle,
  children,
}: SettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  
  const handleVoiceChange = (value: string) => {
    const voice = voices.find(v => v.name === value) || null;
    setSelectedVoice(voice);
  };

  const handleTherapyStyleChange = (value: string) => {
    const style = therapyStyles.find(s => s.prompt === value);
    if (style) {
      setTherapyStyle(style.prompt);
    }
  };
    
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="w-full justify-start gap-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your CounselAI experience and manage your account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              placeholder="name@example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
              placeholder="(123) 456-7890"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="voice" className="text-right">
              AI Voice
            </Label>
            <Select
              onValueChange={handleVoiceChange}
              value={selectedVoice?.name}
            >
              <SelectTrigger id="voice" className="col-span-3">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.length > 0 ? voices.map((voice) => (
                  <SelectItem key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                )) : <SelectItem value="loading" disabled>Loading voices...</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="therapy-style" className="text-right">
              Therapy Style
            </Label>
            <Select
              onValueChange={handleTherapyStyleChange}
              value={therapyStyle}
            >
              <SelectTrigger id="therapy-style" className="col-span-3">
                <SelectValue placeholder="Select a style" />
              </SelectTrigger>
              <SelectContent>
                {therapyStyles.map((style) => (
                  <SelectItem key={style.name} value={style.prompt}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
           <Button onClick={() => setIsOpen(false)}>Save & Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
