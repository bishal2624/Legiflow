
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
export default function HelpPage() {
  return (
    <main>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Help & FAQs</CardTitle>
          <CardDescription>
            Find answers to common questions about LegiFlow Webapplication.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is LegiFlow?</AccordionTrigger>
              <AccordionContent>
                LegiFlow is an AI-powered tool designed to help you understand complex legal documents. You can upload contracts, agreements, and policies to get clause-by-clause summaries, risk analysis, and answers to your specific questions.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I use the document analyzer?</AccordionTrigger>
              <AccordionContent>
                Simply navigate to the Home page, paste the text of your legal document into the text area provided, and click "Analyze Document". The AI will then process the document and present the analysis in different tabs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is the analysis legally binding?</AccordionTrigger>
              <AccordionContent>
                No. The analysis provided by LegiFlow is for informational purposes only and does not constitute legal advice. It is designed to help you better understand your documents, but you should always consult with a qualified legal professional for any legally binding matters.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How is my data handled?</AccordionTrigger>
              <AccordionContent>
                We prioritize your privacy and security. The documents you upload are processed securely and are not stored permanently on our servers after the analysis is complete. Your API key for the AI service is stored locally in your browser's environment settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}
