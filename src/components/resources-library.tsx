
"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import ResourceCard from "./resource-card";
import { Library } from "lucide-react";
import { Button } from "./ui/button";

interface ResourcesLibraryProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export type Resource = {
  id: string;
  title: string;
  description: string;
  category: 'Anxiety' | 'Depression' | 'Sleep' | 'Stress' | 'Relationships';
  type: 'article' | 'video';
  content?: string;
  videoUrl?: string;
  imageUrl: string;
  keywords: string[];
};

const resourcesData: Resource[] = [
  {
    id: 'anxiety-1',
    title: 'Understanding Anxiety and Panic Attacks',
    description: 'Learn the difference between anxiety and panic attacks, and common triggers.',
    category: 'Anxiety',
    type: 'article',
    imageUrl: 'https://placehold.co/600x400.png',
    keywords: ['anxiety', 'panic attacks', 'stress', 'fear'],
    content: `Anxiety is a feeling of unease, such as worry or fear, that can be mild or severe. Everyone has feelings of anxiety at some point in their life. For example, you may feel worried and anxious about sitting an exam, or having a medical test or job interview.
    
A panic attack is a feeling of sudden and intense anxiety. Panic attacks can be very frightening. They can happen unexpectedly and for no apparent reason.`
  },
  {
    id: 'anxiety-2',
    title: 'Guided Meditation for Anxiety',
    description: 'A 10-minute guided meditation to calm your mind and release anxiety.',
    category: 'Anxiety',
    type: 'video',
    imageUrl: 'https://placehold.co/600x400.png',
    keywords: ['meditation', 'mindfulness', 'anxiety', 'calm'],
    videoUrl: 'https://www.youtube.com/embed/O-6f5wQXSu8',
  },
  {
    id: 'depression-1',
    title: 'What is Depression?',
    description: 'An overview of what depression is, its symptoms, and causes.',
    category: 'Depression',
    type: 'article',
    imageUrl: 'https://placehold.co/600x400.png',
    keywords: ['depression', 'sadness', 'low mood', 'mental health'],
    content: `Depression is a common and serious medical illness that negatively affects how you feel, the way you think and how you act. Fortunately, it is also treatable. Depression causes feelings of sadness and/or a loss of interest in activities you once enjoyed. It can lead to a variety of emotional and physical problems and can decrease your ability to function at work and at home.`
  },
  {
    id: 'sleep-1',
    title: '8 Tips for a Better Night\'s Sleep',
    description: 'Simple, actionable tips to improve your sleep hygiene and get more restful sleep.',
    category: 'Sleep',
    type: 'article',
    imageUrl: 'https://placehold.co/600x400.png',
    keywords: ['sleep', 'insomnia', 'rest', 'sleep hygiene'],
    content: `1. Stick to a sleep schedule.
2. Pay attention to what you eat and drink.
3. Create a restful environment.
4. Limit daytime naps.
5. Include physical activity in your daily routine.
6. Manage worries.
7. Know when to contact your doctor.
8. Use a comfortable mattress and pillows.`
  },
  {
    id: 'stress-1',
    title: 'How to Manage and Reduce Stress',
    description: 'Practical strategies for coping with stress in your daily life.',
    category: 'Stress',
    type: 'video',
    imageUrl: 'https://placehold.co/600x400.png',
    keywords: ['stress', 'coping', 'management', 'relaxation'],
    videoUrl: 'https://www.youtube.com/embed/hnpQrMqDoqE',
  },
  {
    id: 'relationships-1',
    title: 'Building Healthy Relationships',
    description: 'Learn the foundations of healthy communication and boundaries.',
    category: 'Relationships',
    type: 'article',
    imageUrl: 'https://placehold.co/600x400.png',
    keywords: ['relationships', 'communication', 'boundaries', 'love'],
    content: `Healthy relationships are a vital component of health and wellbeing. There is compelling evidence that strong relationships contribute to a long, healthy, and happy life. The benefits of healthy relationships are numerous. They include better physical health, greater longevity, and increased happiness.`
  },
];

const categories: Resource['category'][] = ['Anxiety', 'Depression', 'Sleep', 'Stress', 'Relationships'];

export default function ResourcesLibrary({ isOpen, onOpenChange }: ResourcesLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Resource['category'] | 'All'>('All');
  const [activeResource, setActiveResource] = useState<Resource | null>(null);

  const filteredResources = useMemo(() => {
    return resourcesData.filter(resource => {
      const categoryMatch = selectedCategory === 'All' || resource.category === selectedCategory;
      const searchMatch = searchTerm.trim() === '' ||
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));
      return categoryMatch && searchMatch;
    });
  }, [searchTerm, selectedCategory]);

  const handleClose = () => {
    onOpenChange(false);
    // Delay resetting state to allow dialog to close smoothly
    setTimeout(() => {
        setActiveResource(null);
        setSearchTerm("");
        setSelectedCategory("All");
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Library />
            Resources Library
          </DialogTitle>
          <DialogDescription>
            Explore articles, videos, and tools to support your mental well-being.
          </DialogDescription>
        </DialogHeader>
        
        {activeResource ? (
            <div className="flex-1 flex flex-col">
                <Button variant="outline" onClick={() => setActiveResource(null)} className="mb-4 self-start">
                    &larr; Back to Library
                </Button>
                <ScrollArea className="flex-1 pr-4">
                    <h2 className="text-2xl font-bold mb-2">{activeResource.title}</h2>
                    <p className="text-muted-foreground mb-4">{activeResource.description}</p>
                    {activeResource.type === 'video' && activeResource.videoUrl ? (
                        <div className="aspect-video">
                            <iframe
                                width="100%"
                                height="100%"
                                src={activeResource.videoUrl}
                                title={activeResource.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg"
                            ></iframe>
                        </div>
                    ) : (
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                            {activeResource.content}
                        </div>
                    )}
                </ScrollArea>
            </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2 overflow-x-auto pb-2">
                <Badge
                  variant={selectedCategory === 'All' ? 'default' : 'secondary'}
                  onClick={() => setSelectedCategory('All')}
                  className="cursor-pointer"
                >
                  All
                </Badge>
                {categories.map(cat => (
                  <Badge
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'secondary'}
                    onClick={() => setSelectedCategory(cat)}
                    className="cursor-pointer"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {filteredResources.length > 0 ? (
                  filteredResources.map(resource => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      onReadMore={() => setActiveResource(resource)}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground col-span-full text-center py-8">
                    No resources found. Try adjusting your search or filters.
                  </p>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
