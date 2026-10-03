
'use client';
import { useState, useTransition } from 'react';
import { DocumentInput } from '@/components/legiflow/document-input';
import { AnalysisTabs } from '@/components/legiflow/analysis-tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { parseUploadedDocument } from '@/ai/flows/parse-uploaded-document';
import { Upload } from 'lucide-react';

export default function AnalyzePage() {
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [clauses, setClauses] = useState<string[] | null>(null);
  const [isLoading, startParsing] = useTransition();
  const { toast } = useToast();

  const handleParseDocument = (text: string) => {
    setDocumentText(text);
    startParsing(async () => {
      try {
        const result = await parseUploadedDocument({ documentText: text });
        if (result.clauses && result.clauses.length > 0) {
          setClauses(result.clauses);
        } else {
          toast({
            variant: 'destructive',
            title: 'Parsing Failed',
            description: 'Could not find any clauses in the document.',
          });
          setDocumentText(null);
        }
      } catch (error) {
        console.error('Parsing Error:', error);
        toast({
          variant: 'destructive',
          title: 'Parsing Failed',
          description: 'An unexpected error occurred. Please try again.',
        });
        setDocumentText(null);
      }
    });
  };

  const handleReset = () => {
    setDocumentText(null);
    setClauses(null);
  };

  return (
    <main>
        {documentText && clauses ? (
            <AnalysisTabs documentText={documentText} clauses={clauses} onReset={handleReset} />
        ) : (
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Upload /> Upload Document</CardTitle>
                    <CardDescription>
                        Paste your document text below to get started. All the doc formats are supported.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DocumentInput onParse={handleParseDocument} isLoading={isLoading} />
                </CardContent>
            </Card>
        )}
    </main>
  );
}
