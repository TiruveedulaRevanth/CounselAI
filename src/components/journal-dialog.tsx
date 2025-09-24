
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
  ChatJournalSchema,
} from '@/ai/schemas/journal-entry';
import type { UserContext, ChatJournal, UserJournalEntry } from '@/ai/schemas/journal-entry';
import { BookText, Edit, Save, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { format } from 'date-fns';

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


    if (!isEditing) {
        return (
             <ScrollArea className="h-full pr-4">
                 <Button onClick={() => setIsEditing(true)} className="absolute top-0 right-6">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <div className="space-y-4">
                    <ContextSection title="AI's Understanding of Your Personality" content={userContext.personality} />
                    <ContextSection title="AI's Understanding of Your Strengths" content={userContext.strengths} />
                    <ContextSection title="AI's Understanding of Your Problems" content={userContext.problems} />
                </div>
            </ScrollArea>
        )
    }

    return (
        <ScrollArea className="h-full pr-4">
            <p className="text-sm text-muted-foreground mb-4">This is the AI's long-term understanding of you. You can edit it to be more accurate.</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
                    <FormField control={form.control} name="personality" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Personality</FormLabel>
                            <FormControl><Textarea {...field} rows={5} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="strengths" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Strengths</FormLabel>
                            <FormControl><Textarea {...field} rows={5} /></FormControl>
                             <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="problems" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Problems</FormLabel>
                            <FormControl><Textarea {...field} rows={5} /></FormControl>
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
