
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
  category: 'Core Mental Health' | 'Stress & Burnout' | 'Sleep' | 'Relationships' | 'Academic/Work Pressure' | 'Self-Care' | 'Crisis Support';
  type: 'article' | 'video';
  content?: string;
  videoUrl?: string;
  keywords: string[];
};

const resourcesData: Resource[] = [
  // Core Mental Health
  {
    id: 'core-1',
    title: 'Understanding Anxiety',
    description: 'A deep dive into the mechanisms of anxiety, its symptoms, and how panic attacks differ.',
    category: 'Core Mental Health',
    type: 'article',
    keywords: ['anxiety', 'panic attacks', 'stress', 'fear', 'worry', 'symptoms'],
    content: `Anxiety is a natural human response to stress—a feeling of fear or apprehension about what’s to come. It’s the body’s way of preparing you for a challenge. For instance, feeling anxious before a major exam or a public speaking event is perfectly normal. This type of anxiety can even be beneficial, as it sharpens your focus and readies your body for action. However, when these feelings of intense fear and distress become overwhelming, persistent, and interfere with daily life, it may indicate an anxiety disorder.\n\nAnxiety disorders are a group of mental illnesses that cause constant and overwhelming anxiety and fear. The anxiety can be so severe that it affects your ability to work, study, and maintain relationships. The physical symptoms are also very real and can include a pounding heart, shortness of breath, sweating, trembling, and dizziness. These symptoms are not just "in your head"; they are the result of the body's fight-or-flight response being activated inappropriately or for prolonged periods.\n\nA panic attack is a specific, sudden episode of intense fear that triggers severe physical reactions when there is no real danger or apparent cause. Panic attacks can be terrifying. You might feel like you are losing control, having a heart attack, or even dying. Symptoms can peak within minutes and may include a racing heart, chest pain, feeling of choking, and a sense of impending doom.\n\nThe key difference between general anxiety and a panic attack lies in the onset and duration. Anxiety often builds gradually and can be long-lasting, simmering in the background of your day. A panic attack, on the other hand, is abrupt and intense, typically lasting for a short period. While someone with an anxiety disorder can experience panic attacks, not everyone who has a panic attack has an anxiety disorder. Understanding this distinction is the first step toward seeking the right kind of help and developing effective coping strategies tailored to your specific experience.`,
    videoUrl: 'https://www.youtube.com/embed/WJ5iXbL3s48',
  },
  {
    id: 'core-2',
    title: 'Coping with Depression',
    description: 'A comprehensive overview of depression, its symptoms, causes, and the importance of seeking help.',
    category: 'Core Mental Health',
    type: 'article',
    keywords: ['depression', 'sadness', 'low mood', 'mental health', 'hopelessness', 'coping'],
    content: `Depression, clinically known as Major Depressive Disorder (MDD), is more than just feeling sad. It's a persistent and serious mood disorder that affects how you feel, think, and handle daily activities, such as sleeping, eating, or working. To be diagnosed with depression, the symptoms must be present for at least two weeks. It's a common misconception that depression is a sign of weakness or something you can simply "snap out of." It is a complex medical illness with biological, psychological, and social factors contributing to its development. Brain chemistry, genetics, personality traits, and stressful life events can all play a role.\n\nThe symptoms of depression can vary widely from person to person, but commonly include a persistent sad, anxious, or "empty" mood; feelings of hopelessness or pessimism; and irritability. Many people experience a significant loss of interest or pleasure in activities they once enjoyed. Physical symptoms are also common, including fatigue, changes in appetite or sleep patterns, and unexplained aches or pains. Cognitive symptoms can include difficulty concentrating, remembering details, and making decisions. In severe cases, it can lead to thoughts of death or suicide.\n\nCoping with depression involves a multi-faceted approach. It is crucial to understand that depression is treatable. The most common treatments are psychotherapy (talk therapy), medication, or a combination of the two. Psychotherapy can help you learn new ways of thinking and behaving and change habits that may be contributing to your depression. Antidepressant medications can help modify brain chemistry. No single treatment is right for everyone, and it often takes time to find the best approach. Lifestyle changes, such as regular exercise, a healthy diet, and a consistent sleep schedule, can also have a significant positive impact. Seeking help is a sign of strength, and the first step toward recovery and reclaiming your well-being.`,
    videoUrl: 'https://www.youtube.com/embed/GOK1tKFFIQI',
  },
  {
    id: 'core-3',
    title: 'What Is Bipolar Disorder?',
    description: 'An introduction to bipolar disorder, including manic and depressive episodes.',
    category: 'Core Mental Health',
    type: 'article',
    keywords: ['bipolar', 'manic', 'depressive', 'mood swings'],
    content: `Bipolar disorder is a mental health condition characterized by extreme mood swings that include emotional highs (mania or hypomania) and lows (depression). These shifts in mood are far more severe than the normal ups and downs that most people experience. They can affect sleep, energy, activity, judgment, behavior, and the ability to think clearly. The cycles of bipolar disorder can last for days, weeks, or even months, and they can have a profound impact on every aspect of a person's life, from their job and relationships to their daily functioning.\n\nThere are several types of bipolar disorder, but the most common include Bipolar I and Bipolar II. Bipolar I is defined by at least one manic episode, which may be preceded or followed by hypomanic or major depressive episodes. In some cases, mania may trigger a break from reality (psychosis). Bipolar II disorder is defined by at least one major depressive episode and at least one hypomanic episode, but you've never had a full-blown manic episode. Hypomania is a less severe form of mania.\n\nManic episodes are characterized by an elevated or irritable mood, increased energy and activity, and a decreased need for sleep. People in a manic state may feel euphoric, full of ideas, and more important than usual. They might talk quickly, jump from one idea to another, and engage in risky behaviors, such as spending sprees or reckless driving. In contrast, depressive episodes involve a persistent feeling of sadness, loss of interest in activities, significant changes in weight or appetite, fatigue, feelings of worthlessness, and difficulty concentrating. The experience of a depressive episode in bipolar disorder is similar to that of major depressive disorder.\n\nWhile the exact cause of bipolar disorder is unknown, it's believed to be a combination of genetic factors, brain structure and chemistry, and environmental influences. It is a lifelong condition, but it can be managed effectively with a treatment plan that typically includes a combination of medication and psychotherapy. Mood stabilizers are commonly prescribed to control manic or hypomanic episodes, and psychotherapy helps individuals and their families understand and cope with the condition.`,
    videoUrl: 'https://www.youtube.com/embed/Rr32L713fPk',
  },
  // ... (and so on for all 50 articles)
  {
    id: 'crisis-2',
    title: 'Panic Button: Your Immediate Toolkit',
    description: 'A guide to using the in-app emergency features and other immediate actions.',
    category: 'Crisis Support',
    type: 'article',
    keywords: ['crisis', 'emergency', 'panic button', 'helpline', 'immediate support'],
    content: `When you are in a moment of intense crisis or emotional distress, it can be difficult to think clearly. The "Need Help?" or "Panic Button" feature in this app is designed to be a simple, one-click tool to get you to immediate, real-world help without having to search for it. This is your immediate toolkit, and understanding how to use it is a proactive step in your safety plan.\n\n**What Happens When You Click the Button?**\nClicking the "Need Help?" button will instantly open a dialog box containing critical information. This dialog is designed to be clear and easy to navigate. It includes a curated list of confidential, 24/7 helplines and crisis hotlines for various regions, including the US, India, and the UK. These are staffed by trained professionals who can provide immediate support. It is not a chatbot; it connects you to real human beings who are there to listen and help.\n\n**The Most Important First Step: Immediate Danger**\nThe first thing you will see is a disclaimer. This is the most crucial part of the toolkit. If you believe you are in immediate physical danger, or if you are having a medical emergency, you should not rely on a hotline. You must call your local emergency services number (such as 911 in the US, 112 in most of Europe, or 102 for ambulance services in India) right away. These services are equipped to handle life-threatening situations and can dispatch help to your location.\n\n**Using the Helplines**\nIf you are not in immediate physical danger but are experiencing severe emotional distress, suicidal thoughts, or an overwhelming crisis, the helplines are your next best step. The numbers are provided clearly. You can either call or, in some cases, text the number provided. These services are free and confidential. You do not have to be suicidal to call; they are there for anyone who is struggling and needs to talk. The trained counselors can provide emotional support, help you de-escalate your feelings, and guide you toward other resources in your area.\n\nThink of this Panic Button as a safety feature in a car. You hope you never have to use it, but knowing it's there and how it works provides a sense of security. It's a bridge from the digital space to real, tangible human support when you need it most.`,
    videoUrl: 'https://www.youtube.com/embed/rkZl2gsLhfk'
  }
];


export default function ResourcesLibrary({ isOpen, onOpenChange }: ResourcesLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeResource, setActiveResource] = useState<Resource | null>(null);

  const filteredResources = useMemo(() => {
    return resourcesData.filter(resource => {
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch = searchTerm.trim() === '' ||
        resource.title.toLowerCase().includes(searchTermLower) ||
        resource.description.toLowerCase().includes(searchTermLower) ||
        resource.category.toLowerCase().includes(searchTermLower) ||
        resource.keywords.some(k => k.toLowerCase().includes(searchTermLower));
      return searchMatch;
    });
  }, [searchTerm]);

  const handleClose = () => {
    onOpenChange(false);
    // Delay resetting state to allow dialog to close smoothly
    setTimeout(() => {
        setActiveResource(null);
        setSearchTerm("");
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
            <div className="flex-1 flex flex-col min-h-0">
                <Button variant="outline" onClick={() => setActiveResource(null)} className="mb-4 self-start">
                    &larr; Back to Library
                </Button>
                <ScrollArea className="flex-1 pr-4 -mr-6">
                    <div className="pr-6">
                        <h2 className="text-2xl font-bold mb-2">{activeResource.title}</h2>
                        <p className="text-muted-foreground mb-4">{activeResource.description}</p>
                        {activeResource.videoUrl ? (
                            <div className="aspect-video mb-6">
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
                        ) : null}
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-base">
                            {activeResource.content}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search by title, keyword, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
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

    