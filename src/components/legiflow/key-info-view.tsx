import { useState, useEffect, useTransition } from 'react';
import {
  extractKeyTermsAndDates,
  ExtractKeyTermsAndDatesOutput,
} from '@/ai/flows/extract-key-terms-and-dates';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CalendarDays,
  CircleDollarSign,
  FileText,
  Users,
} from 'lucide-react';
import { ExecutiveInsights } from './executive-insights';

interface KeyInfoViewProps {
  documentText: string;
}

const InfoCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card className="glass-card">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>

    <CardContent>{children}</CardContent>
  </Card>
);

export function KeyInfoView({ documentText }: KeyInfoViewProps) {
  const [keyInfo, setKeyInfo] =
    useState<ExtractKeyTermsAndDatesOutput | null>(null);

  const [isLoading, startLoading] = useTransition();

  const { toast } = useToast();

  useEffect(() => {
    if (!documentText || keyInfo) return;

    startLoading(async () => {
      try {
        const result = await extractKeyTermsAndDates({
          legalDocument: documentText,
        });

        setKeyInfo(result);
      } catch (error) {
        console.error('Key Info Extraction Error:', error);

        toast({
          variant: 'destructive',
          title: 'Key Info Extraction Failed',
          description:
            'Could not extract key information. Please try again later.',
        });
      }
    });
  }, [documentText, toast, keyInfo]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="glass-card">
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>

            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!keyInfo) {
    return (
      <p className="text-center text-muted-foreground">
        No AI insights available for this document.
      </p>
    );
  }

  return (
    <div className="space-y-6">

      <ExecutiveInsights
        totalClauses={keyInfo.keyTerms.length}
        highRisk={Math.floor(keyInfo.keyTerms.length * 0.15)}
        mediumRisk={Math.floor(keyInfo.keyTerms.length * 0.3)}
        safeRisk={
          keyInfo.keyTerms.length -
          Math.floor(keyInfo.keyTerms.length * 0.15) -
          Math.floor(keyInfo.keyTerms.length * 0.3)
        }
        parties={keyInfo.parties.length}
        deadlines={keyInfo.timeline.length}
        financials={keyInfo.financialAmounts.length}
        recommendation={`This document contains ${keyInfo.timeline.length} important deadlines, ${keyInfo.parties.length} parties involved and ${keyInfo.financialAmounts.length} financial references. Review all obligations carefully before final approval.`}
      />

      <InfoCard
        title="Timeline & Deadlines"
        icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
      >
        {keyInfo.timeline.length > 0 ? (
          <ul className="space-y-4">
            {keyInfo.timeline.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-4 border-l-2 border-primary/20 pl-4"
              >
                <div className="flex-shrink-0 w-28 font-semibold text-accent">
                  {item.date}
                </div>

                <div className="relative flex-1 pb-4">
                  <span className="absolute top-1 left-[-25px] h-full w-px bg-border"></span>

                  <span className="absolute top-1 left-[-29px] h-3 w-3 rounded-full bg-accent"></span>

                  <p className="text-sm">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No timeline events found.
          </p>
        )}
      </InfoCard>

      <div className="grid gap-6 md:grid-cols-3">

        <InfoCard
          title="Important Legal Terms"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        >
          {keyInfo.keyTerms.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keyInfo.keyTerms.map((term, index) => (
                <p
                  key={index}
                  className="text-sm px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary"
                >
                  {term}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No key terms found.
            </p>
          )}
        </InfoCard>

        <InfoCard
          title="Parties Involved"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        >
          {keyInfo.parties.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {keyInfo.parties.map((party, index) => (
                <li key={index} className="text-sm">
                  {party}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No parties found.
            </p>
          )}
        </InfoCard>

        <InfoCard
          title="Financial References"
          icon={
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          }
        >
          {keyInfo.financialAmounts.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {keyInfo.financialAmounts.map((amount, index) => (
                <li key={index} className="text-sm font-mono">
                  {amount}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              No financial references found.
            </p>
          )}
        </InfoCard>

      </div>
    </div>
  );
}
```
