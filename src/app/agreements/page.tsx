import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Search } from "lucide-react";
import Link from "next/link";

export default function AgreementsPage() {
  return (
    <main>
      <Card>
        <CardHeader>
            <CardTitle>Agreements Management</CardTitle>
            <CardDescription>
              Upload, manage, and review all your legal documents - Your Legal Buddy.
            </CardDescription>
        </CardHeader>
        <CardContent>
             <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/analyze">
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Upload New Agreement
                </Button>
              </Link>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search agreements..." className="pl-10 bg-transparent" />
            </div>

            <Tabs defaultValue="saved">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="simplified">Simplified</TabsTrigger>
              </TabsList>
              <TabsContent value="saved" className="mt-4">
                 <div className="p-6 text-center text-muted-foreground border-2 border-dashed border-border/20 rounded-lg">
                    <p>You don't have any saved agreements yet.</p>
                    <p className="text-sm">Upload a new agreement to get started.</p>
                </div>
              </TabsContent>
               <TabsContent value="drafts" className="mt-4">
                 <div className="p-6 text-center text-muted-foreground border-2 border-dashed border-border/20 rounded-lg">
                    <p>No draft agreements found.</p>
                </div>
              </TabsContent>
               <TabsContent value="simplified" className="mt-4">
                 <div className="p-6 text-center text-muted-foreground border-2 border-dashed border-border/20 rounded-lg">
                    <p>No simplified agreements available.</p>
                </div>
              </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
