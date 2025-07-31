
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Resource } from "./resources-library";
import { Video, BookOpen } from "lucide-react";

interface ResourceCardProps {
  resource: Resource;
  onReadMore: () => void;
}

export default function ResourceCard({ resource, onReadMore }: ResourceCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader>
         <div className="relative w-full h-40 mb-4">
             <Image
              src={resource.imageUrl}
              alt={resource.title}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-lg"
              data-ai-hint={`${resource.category.toLowerCase()} ${resource.keywords[0]}`}
            />
         </div>
        <Badge variant="secondary" className="w-fit">{resource.category}</Badge>
        <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button onClick={onReadMore} className="w-full">
          {resource.type === 'video' ? <Video className="mr-2 h-4 w-4"/> : <BookOpen className="mr-2 h-4 w-4"/>}
          {resource.type === 'video' ? 'Watch Video' : 'Read More'}
        </Button>
      </CardFooter>
    </Card>
  );
}
