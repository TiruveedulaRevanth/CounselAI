
'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import {
  ShortTermContextSchema,
  LongTermContextSchema,
} from '@/ai/schemas/journal-entry';
import type { ShortTermContext, LongTermContext, JournalEntry } from '@/ai/schemas/journal-entry';
import { generateJournalReflection } from '@/ai/flows/journal-reflection-flow';
import { BookText, Edit, Loader2, Save, Sparkles, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { format } from 'date-fns';
import { Separator } from './ui/separator';

interface JournalPageProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  entries: JournalEntry[];
  setEntries: (entries: JournalEntry[]) => void;
  longTermContext: LongTermContext;
  setLongTermContext: (context: LongTermContext) => void;
}

export default function JournalPage({
  isOpen,
  onOpenChange,
  entries,
  setEntries,
  longTermContext,
  setLongTermContext,
}: JournalPageProps) {
  const [view, setView] = useState<'list' | 'new' | 'entry'>('list');
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingLongTerm, setIsEditingLongTerm] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset view when closing
      setTimeout(() => {
        setView('list');
        setActiveEntry(null);
        setIsEditingLongTerm(false);
      }, 300);
    }
    onOpenChange(open);
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setActiveEntry(entry);
    setView('entry');
  };

  const sortedEntries = [...entries].sort((a, b) => b.date - a.date);

  const renderContent = () => {
    switch (view) {
      case 'new':
        return (
          <NewEntryForm
            setIsLoading={setIsLoading}
            isLoading={isLoading}
            longTermContext={longTermContext}
            onNewEntry={(newEntry, updatedContext) => {
              setEntries([newEntry, ...entries]);
              setLongTermContext(updatedContext);
              handleSelectEntry(newEntry);
            }}
          />
        );
      case 'entry':
        return (
          <EntryDetail
            entry={activeEntry!}
            onBack={() => {
              setActiveEntry(null);
              setView('list');
            }}
          />
        );
      case 'list':
      default:
        return (
          <EntryList
            entries={sortedEntries}
            onSelectEntry={handleSelectEntry}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookText />
            My Journal
          </DialogTitle>
          <DialogDescription>
            A space to reflect on your thoughts and feelings, with personalized
            insights from your AI therapist.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="entries" className="flex-1 flex flex-col min-h-0">
          <div className="flex justify-between items-center pr-1">
            <TabsList>
              <TabsTrigger value="entries">My Entries</TabsTrigger>
              <TabsTrigger value="context">Long-Term Context</TabsTrigger>
            </TabsList>
            {view === 'list' && (
              <Button onClick={() => setView('new')}>New Entry</Button>
            )}
          </div>

          <TabsContent
            value="entries"
            className="flex-1 flex flex-col min-h-0 mt-4"
          >
            {renderContent()}
          </TabsContent>
          <TabsContent
            value="context"
            className="flex-1 flex flex-col min-h-0 mt-4"
          >
            <LongTermContextEditor
                isEditing={isEditingLongTerm}
                setIsEditing={setIsEditingLongTerm}
                longTermContext={longTermContext}
                setLongTermContext={setLongTermContext}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Sub-components for different views

const NewEntryForm = ({
  setIsLoading,
  isLoading,
  longTermContext,
  onNewEntry,
}: {
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  longTermContext: LongTermContext;
  onNewEntry: (entry: JournalEntry, context: LongTermContext) => void;
}) => {
  const form = useForm<ShortTermContext>({
    resolver: zodResolver(ShortTermContextSchema),
    defaultValues: {
      mood: '',
      events: '',
      concerns: '',
      copingAttempts: '',
    },
  });

  const onSubmit = async (data: ShortTermContext) => {
    setIsLoading(true);
    try {
      const result = await generateJournalReflection({
        shortTermContext: data,
        longTermContext: longTermContext,
      });

      const newEntry: JournalEntry = {
        id: `entry-${Date.now()}`,
        date: Date.now(),
        shortTermContext: data,
        reflection: result.reflection,
      };

      onNewEntry(newEntry, result.updatedLongTermContext);
    } catch (error) {
      console.error('Failed to generate reflection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollArea className="h-full pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How are you feeling today?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Anxious and overwhelmed, but a little hopeful."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="events"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What happened today? (Events or Triggers)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Had a stressful meeting with my boss, then talked to a friend."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="concerns"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What's on your mind? (Concerns)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Worried about the project deadline and if I said the right thing in the meeting."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="copingAttempts"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you try to cope?</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., I went for a short walk which helped a bit, but then I just scrolled on my phone."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Reflection...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Save & Reflect
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </ScrollArea>
  );
};

const EntryList = ({
  entries,
  onSelectEntry,
}: {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
}) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <p>You haven't written any journal entries yet.</p>
        <p className="text-sm">Click "New Entry" to get started.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 pr-4">
        {entries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelectEntry(entry)}
            className="w-full text-left p-4 border rounded-lg hover:bg-muted transition-colors"
          >
            <p className="font-semibold">
              {format(new Date(entry.date), 'MMMM d, yyyy')}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {entry.shortTermContext.mood}
            </p>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

const EntryDetail = ({
  entry,
  onBack,
}: {
  entry: JournalEntry;
  onBack: () => void;
}) => (
  <div className="flex-1 flex flex-col min-h-0">
     <Button variant="outline" onClick={onBack} className="mb-4 self-start">
        &larr; Back to List
      </Button>
    <ScrollArea className="h-full pr-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-primary">Your Entry - {format(new Date(entry.date), 'MMMM d, yyyy')}</h3>
          <div className="mt-2 space-y-3 text-sm border-l-2 pl-4 py-2">
            <p><strong>Feeling:</strong> {entry.shortTermContext.mood}</p>
            <p><strong>Events:</strong> {entry.shortTermContext.events}</p>
            <p><strong>Concerns:</strong> {entry.shortTermContext.concerns}</p>
            <p><strong>Coping:</strong> {entry.shortTermContext.copingAttempts}</p>
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Sparkles size={20} />
            AI Reflection
          </h3>
          {entry.reflection ? (
            <div className="mt-2 space-y-4 text-sm bg-muted/50 p-4 rounded-md">
              <div>
                <h4 className="font-semibold">Summary</h4>
                <p>{entry.reflection.summary}</p>
              </div>
              <div>
                <h4 className="font-semibold">Connection to Your Journey</h4>
                <p>{entry.reflection.connection}</p>
              </div>
              <div>
                <h4 className="font-semibold">Insight</h4>
                <p>{entry.reflection.insight}</p>
              </div>
              <div>
                <h4 className="font-semibold">Suggestions for Tomorrow</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {entry.reflection.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground mt-2">No reflection available for this entry.</p>
          )}
        </div>
      </div>
    </ScrollArea>
  </div>
);

const LongTermContextEditor = ({
    isEditing,
    setIsEditing,
    longTermContext,
    setLongTermContext,
}: {
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;
    longTermContext: LongTermContext;
    setLongTermContext: (context: LongTermContext) => void;
}) => {
    const form = useForm<LongTermContext>({
        resolver: zodResolver(LongTermContextSchema),
        defaultValues: longTermContext,
    });
    
    const watchedValues = useWatch({ control: form.control });

    const onSave = (data: LongTermContext) => {
        setLongTermContext(data);
        setIsEditing(false);
    };

    const onCancel = () => {
        form.reset(longTermContext); // Reset form to original values
        setIsEditing(false);
    };

    const hasChanges = JSON.stringify(watchedValues) !== JSON.stringify(longTermContext);


    if (!isEditing) {
        return (
             <ScrollArea className="h-full pr-4">
                 <Button onClick={() => setIsEditing(true)} className="absolute top-0 right-6">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <div className="space-y-4">
                    <ContextSection title="Core Themes / Life Domains" content={longTermContext.coreThemes} />
                    <ContextSection title="Personality Traits / Tendencies" content={longTermContext.personalityTraits} />
                    <ContextSection title="Recurring Problems / Stressors" content={longTermContext.recurringProblems} />
                    <ContextSection title="Values / Goals" content={longTermContext.values} />
                    <ContextSection title="Mood & Milestone History" content={longTermContext.moodHistory} />
                </div>
            </ScrollArea>
        )
    }

    return (
        <ScrollArea className="h-full pr-4">
            <p className="text-sm text-muted-foreground mb-4">This is the AI's understanding of you over time. You can edit it to be more accurate.</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                    <FormField control={form.control} name="coreThemes" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Core Themes / Life Domains</FormLabel>
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="personalityTraits" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Personality Traits / Tendencies</FormLabel>
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="recurringProblems" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Recurring Problems / Stressors</FormLabel>
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="values" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Values / Goals</FormLabel>
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="moodHistory" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mood & Milestone History</FormLabel>
                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <DialogFooter className="pt-4 sticky bottom-0 bg-background py-4">
                        <Button type="button" variant="ghost" onClick={onCancel}><X className="mr-2 h-4 w-4"/>Cancel</Button>
                        <Button type="submit" disabled={!hasChanges}><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
                    </DialogFooter>
                </form>
            </Form>
        </ScrollArea>
    )
}

const ContextSection = ({ title, content }: { title: string; content: string }) => (
  <div className="space-y-1">
    <h4 className="font-semibold">{title}</h4>
    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
  </div>
);
