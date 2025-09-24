
'use client'

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
  UserContextSchema,
} from '@/ai/schemas/journal-entry';
import type { UserContext, ChatJournal, UserJournalEntry } from '@/ai/schemas/journal-entry';
import { BookText, Edit, Save, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface JournalDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  userContext: UserContext;
  setUserContext: (context: UserContext) => void;
  chatJournal: ChatJournal;
  userJournalEntries: UserJournalEntry[];
}

export default function JournalDialog({
  isOpen,
  onOpenChange,
  userContext,
  setUserContext,
  chatJournal,
  userJournalEntries
}: JournalDialogProps) {
    
  const [isEditingUserContext, setIsEditingUserContext] = useState(false);

  const sortedEntries = [...userJournalEntries].sort((a, b) => b.date - a.date);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookText />
            My Journal
          </DialogTitle>
          <DialogDescription>
            A space to track your journey, review insights, and see your progress over time.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="user-context" className="flex-1 flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="user-context">Long-Term Context</TabsTrigger>
            <TabsTrigger value="chat-journal">Current Chat</TabsTrigger>
            <TabsTrigger value="my-entries">My Entries</TabsTrigger>
          </TabsList>
          <TabsContent value="user-context" className="flex-1 flex flex-col min-h-0 mt-4">
             <UserContextEditor 
                isEditing={isEditingUserContext}
                setIsEditing={setIsEditingUserContext}
                userContext={userContext}
                setUserContext={setUserContext}
             />
          </TabsContent>
          <TabsContent value="chat-journal" className="flex-1 min-h-0 mt-4">
            <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                    <ContextSection title="Suggested Solutions & Tools" content={chatJournal.suggestedSolutions} />
                    <ContextSection title="Progress in This Chat" content={chatJournal.progressSummary} />
                </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="my-entries" className="flex-1 min-h-0 mt-4">
            <ScrollArea className="h-full pr-4">
                {sortedEntries.length > 0 ? (
                    <div className="space-y-3">
                        {sortedEntries.map(entry => (
                            <div key={entry.id} className="p-4 border rounded-lg">
                                <p className="text-sm font-semibold text-muted-foreground">{format(new Date(entry.date), "MMMM d, yyyy - h:mm a")}</p>
                                <p className="mt-1">{entry.summary}</p>
                            </div>
                        ))}
                    </div>
                ): (
                    <p className="text-muted-foreground text-center py-8">Your summarized journal entries will appear here after you chat with the AI.</p>
                )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

const UserContextEditor = ({
    isEditing,
    setIsEditing,
    userContext,
    setUserContext
}: {
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;
    userContext: UserContext;
    setUserContext: (context: UserContext) => void;
}) => {
    const form = useForm<UserContext>({
        resolver: zodResolver(UserContextSchema),
        defaultValues: userContext,
    });
    
    const watchedValues = useWatch({ control: form.control });

    const onSave = (data: UserContext) => {
        setUserContext(data);
        setIsEditing(false);
    };

    const onCancel = () => {
        form.reset(userContext); // Reset form to original values
        setIsEditing(false);
    };

    const hasChanges = JSON.stringify(watchedValues) !== JSON.stringify(userContext);
    
    const safeLifeDomains = userContext.lifeDomains || { business: '', relationships: '', family: '', health: '', finances: '', personalGrowth: '' };

    if (!isEditing) {
        return (
             <ScrollArea className="h-full pr-4">
                 <Button onClick={() => setIsEditing(true)} className="absolute top-0 right-6">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <div className="space-y-4">
                    <ContextSection title="Core Themes" content={userContext.coreThemes} />
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Life Domains</AccordionTrigger>
                            <AccordionContent className="pl-4 space-y-3">
                                <ContextSection title="Business" content={safeLifeDomains.business} />
                                <ContextSection title="Relationships" content={safeLifeDomains.relationships} />
                                <ContextSection title="Family" content={safeLifeDomains.family} />
                                <ContextSection title="Health" content={safeLifeDomains.health} />
                                <ContextSection title="Finances" content={safeLifeDomains.finances} />
                                <ContextSection title="Personal Growth" content={safeLifeDomains.personalGrowth} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <ContextSection title="Personality Traits" content={userContext.personalityTraits} />
                    <ContextSection title="Recurring Problems / Stressors" content={userContext.recurringProblems} />
                    <ContextSection title="Values & Goals" content={userContext.values} />
                    <ContextSection title="Mood & Milestone History" content={userContext.moodHistory} />
                </div>
            </ScrollArea>
        )
    }

    return (
        <ScrollArea className="h-full pr-4">
            <p className="text-sm text-muted-foreground mb-4">This is the AI's long-term understanding of you. You can edit it to be more accurate.</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                    <FormField control={form.control} name="coreThemes" render={({ field }) => (
                        <FormItem><FormLabel>Core Themes</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    <Accordion type="single" collapsible className="w-full border rounded-md px-4">
                        <AccordionItem value="item-1" className="border-b-0">
                            <AccordionTrigger>Life Domains</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <FormField control={form.control} name="lifeDomains.business" render={({ field }) => (
                                    <FormItem><FormLabel>Business</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="lifeDomains.relationships" render={({ field }) => (
                                    <FormItem><FormLabel>Relationships</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="lifeDomains.family" render={({ field }) => (
                                    <FormItem><FormLabel>Family</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="lifeDomains.health" render={({ field }) => (
                                    <FormItem><FormLabel>Health</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="lifeDomains.finances" render={({ field }) => (
                                    <FormItem><FormLabel>Finances</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="lifeDomains.personalGrowth" render={({ field }) => (
                                    <FormItem><FormLabel>Personal Growth</FormLabel><FormControl><Textarea {...field} rows={2} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <FormField control={form.control} name="personalityTraits" render={({ field }) => (
                        <FormItem><FormLabel>Personality Traits</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="recurringProblems" render={({ field }) => (
                        <FormItem><FormLabel>Recurring Problems / Stressors</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="values" render={({ field }) => (
                        <FormItem><FormLabel>Values & Goals</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="moodHistory" render={({ field }) => (
                        <FormItem><FormLabel>Mood & Milestone History</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
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
    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content || 'Not yet analyzed.'}</p>
  </div>
);
