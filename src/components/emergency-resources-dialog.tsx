
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Siren } from "lucide-react";

interface EmergencyResourcesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const helplines = [
    {
        region: "India",
        name: "AASRA",
        contact: "+91-9820466726",
        description: "A 24/7 helpline for those who are distressed, depressed, or suicidal."
    },
    {
        region: "United States",
        name: "National Suicide & Crisis Lifeline",
        contact: "988",
        description: "Call or text 988 anytime for free, confidential support."
    },
    {
        region: "United Kingdom",
        name: "Samaritans",
        contact: "116 123",
        description: "A 24/7 free helpline for anyone who's struggling to cope."
    },
    {
        region: "International",
        name: "Befrienders Worldwide",
        contact: "Visit befrienders.org",
        description: "A global network of emotional support centers."
    }
]

export default function EmergencyResourcesDialog({
  isOpen,
  onOpenChange,
}: EmergencyResourcesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Immediate Help & Resources</DialogTitle>
          <DialogDescription>
            Your safety is the most important thing. Please reach out.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <Alert variant="destructive">
                <Siren className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription>
                   If you are in immediate danger or having a medical emergency, please call your local emergency services (like 911, 112, etc.) right away.
                </AlertDescription>
            </Alert>
            <div className="space-y-3">
                {helplines.map((line) => (
                    <div key={line.name} className="p-3 rounded-lg border">
                        <p className="font-semibold text-sm text-muted-foreground">{line.region}</p>
                        <h4 className="font-bold text-lg">{line.name}</h4>
                        <p className="text-primary font-bold text-xl my-1">{line.contact}</p>
                        <p className="text-sm text-muted-foreground">{line.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
