
'use client';
import { useState, useTransition } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { summarizeLegalDocument } from '@/ai/flows/summarize-legal-document';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
interface ClauseItemProps {
  clause: string;
  index: number;
}
export function ClauseItem({ clause, index }: ClauseItemProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSimplifying, startSimplifying] = useTransition();
  const { toast } = useToast();

  const handleSimplify = () => {
    if (summary || isSimplifying) return;

    startSimplifying(async () => {
      try {
        const result = await summarizeLegalDocument({ legalDocument: clause });
        if (result?.summary) {
          setSummary(result.summary);
        } else {
            throw new Error('No summary returned');
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: 'destructive',
          title: 'Simplification Failed',
          description: `Could not simplify clause ${index + 1}.`,
        });
      }
    });
  };

  return (
    <AccordionItem value={`item-${index}`} className="border-border/50">
      <AccordionTrigger onClick={handleSimplify} className="text-left hover:no-underline">
        <div className="flex gap-4 items-start w-full">
            <span className="text-accent font-bold">{index + 1}.</span>
            <p className="flex-1 text-muted-foreground">
                {clause.length > 150 ? `${clause.substring(0, 150)}...` : clause}
            </p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-2">
        <Tabs defaultValue="simplified" className="w-full">
          <TabsList>
            <TabsTrigger value="simplified">Simplified Version</TabsTrigger>
            <TabsTrigger value="legal">Original Legal Text</TabsTrigger>
          </TabsList>
          <TabsContent value="simplified" className="mt-4 p-4 bg-primary/5 rounded-md border border-primary/20">
            {isSimplifying ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : summary ? (
              <p className="text-foreground whitespace-pre-wrap">{summary}</p>
            ) : (
                <div className="text-center py-4 text-muted-foreground">
                    <p>Click the clause header to generate a simplified summary.</p>
                </div>
            )}
          </TabsContent>
          <TabsContent value="legal" className="mt-4 p-4 bg-muted/50 rounded-md border">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{clause}</p>
          </TabsContent>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
}
