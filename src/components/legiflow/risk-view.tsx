'use client';
import { useState, useEffect, useTransition } from 'react';
import { highlightContractRisks, HighlightContractRisksOutput } from '@/ai/flows/highlight-contract-risks';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldAlert, ShieldCheck, ShieldHalf, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RiskViewProps {
  documentText: string;
}

const riskLevelConfig = {
    High: {
        icon: ShieldAlert,
        badgeVariant: 'destructive' as const,
        badgeClass: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    Medium: {
        icon: ShieldHalf,
        badgeVariant: 'default' as const, 
        badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30',
    },
    Safe: {
        icon: ShieldCheck,
        badgeVariant: 'secondary' as const,
        badgeClass: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
    }
}

export function RiskView({ documentText }: RiskViewProps) {
  const [riskData, setRiskData] = useState<HighlightContractRisksOutput | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'High' | 'Medium' | 'Safe'>('All');
  const [isLoading, startLoading] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (!documentText || riskData) return;
    startLoading(async () => {
      try {
        const result = await highlightContractRisks({ legalDocument: documentText });
        if (result?.riskAssessment) {
          setRiskData(result);
        } else {
            throw new Error('Invalid response from risk analysis');
        }
      } catch (error) {
        console.error('Risk Analysis Error:', error);
        toast({
          variant: 'destructive',
          title: 'Risk Analysis Failed',
          description: 'Could not analyze document risks. Please try again later.',
        });
      }
    });
  }, [documentText, toast, riskData]);

  if (isLoading) {
    return (
        <Card className="border-border/50 bg-[#13131f]">
            <CardHeader>
                <CardTitle>Risk &amp; Obligation Analysis</CardTitle>
                <CardDescription>Potential risks and obligations identified in your document.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 border border-border/50 rounded-lg space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
  }

  if (!riskData) {
    return <p className="text-muted-foreground text-center py-8">Click 'Analyze Risks' to begin.</p>;
  }

  const filteredAssessment = riskData.riskAssessment.filter(item => {
    if (activeFilter === 'All') return true;
    return item.riskLevel === activeFilter;
  });

  return (
    <Card className="border border-border/50 bg-[#13131f]">
      <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 pb-6 border-b border-border/40">
        <div>
          <CardTitle className="text-lg font-bold">Risk &amp; Obligation Analysis</CardTitle>
          <CardDescription className="text-xs">Potential risks and obligations identified in your document.</CardDescription>
        </div>
        <div className="flex items-center gap-2 bg-[#1c1c2e] p-1 rounded-lg border border-border/50">
          <Filter className="h-3.5 w-3.5 text-muted-foreground ml-2" />
          <div className="flex gap-1">
            {(['All', 'High', 'Medium', 'Safe'] as const).map((filterOpt) => (
              <button
                key={filterOpt}
                onClick={() => setActiveFilter(filterOpt)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  activeFilter === filterOpt
                    ? 'bg-[#2a2a40] text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {filterOpt}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {filteredAssessment.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No {activeFilter.toLowerCase()} risk clauses found in this document.
          </div>
        ) : (
          <Accordion type="multiple" className="w-full space-y-2">
            <AnimatePresence initial={false}>
              {filteredAssessment.map((item, index) => {
                 const config = riskLevelConfig[item.riskLevel] || riskLevelConfig.Safe;
                 const Icon = config.icon;
                 return (
                   <motion.div
                     key={`${item.riskLevel}-${index}`}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.2 }}
                   >
                     <AccordionItem value={`risk-${index}`} className="border border-border/40 rounded-lg overflow-hidden px-4 bg-background/30 hover:bg-background/50 transition-colors">
                       <AccordionTrigger className="hover:no-underline py-3.5">
                         <div className="flex justify-between items-start w-full pr-4 gap-4">
                             <p className="flex-1 text-left text-sm font-medium text-foreground/80 leading-relaxed">
                               {item.clause}
                             </p>
                             <Badge variant={config.badgeVariant} className={`${config.badgeClass} flex-shrink-0 font-medium px-2 py-0.5 border`}>
                               <Icon className="h-3.5 w-3.5 mr-1" />
                               {item.riskLevel}
                             </Badge>
                         </div>
                       </AccordionTrigger>
                       <AccordionContent className="space-y-4 pb-4 pt-2 text-sm leading-relaxed border-t border-border/20 mt-1">
                           <div className="bg-[#1c1c2e]/40 p-3 rounded-lg border border-border/30">
                               <h4 className="font-semibold text-foreground/90 mb-1">Explanation</h4>
                               <p className="text-muted-foreground">{item.explanation}</p>
                           </div>
                           {item.obligation && item.obligation.trim() && (
                                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                   <h4 className="font-semibold text-primary/95 mb-1">Obligation</h4>
                                   <p className="text-muted-foreground">{item.obligation}</p>
                               </div>
                           )}
                       </AccordionContent>
                     </AccordionItem>
                   </motion.div>
                 );
              })}
            </AnimatePresence>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
