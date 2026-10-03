'use client';
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { LoaderCircle, Clock, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { diffWords } from "diff";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DiffViewer } from "@/components/legiflow/diff-viewer";

interface HistoryItem {
    id: string;
    type: string;
    textA?: string;
    textB?: string;
    documentText?: string;
    clauses?: string[];
    timestamp: any;
}

export default function HistoryPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!user) return;
            try {
                let data: HistoryItem[] = [];
                try {
                    // Fetch without orderBy to avoid composite index requirements
                    const q = query(
                        collection(db, "history"),
                        where("userId", "==", user.uid),
                        limit(50)
                    );
                    const querySnapshot = await getDocs(q);
                    data = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as HistoryItem[];
                } catch (e) {
                    console.error("Firestore fetch failed, relying on local storage", e);
                }

                // Fetch from local storage safely
                let localHistory: any[] = [];
                try {
                    const localHistoryRaw = JSON.parse(localStorage.getItem('legiflow_history') || '[]');
                    localHistory = localHistoryRaw.filter((item: any) => item.userId === user.uid);
                } catch (e) {
                    console.error("Failed to read or parse local history", e);
                }
                
                // Combine and deduplicate
                const combinedMap = new Map<string, HistoryItem>();
                data.forEach(item => combinedMap.set(item.id, item));
                localHistory.forEach((item: any) => {
                    if (!combinedMap.has(item.id)) {
                        combinedMap.set(item.id, item);
                    }
                });
                const combinedData = Array.from(combinedMap.values());

                // Sort client-side
                combinedData.sort((a, b) => {
                    const timeA = a.timestamp?.toMillis?.() || new Date(a.timestamp).getTime() || 0;
                    const timeB = b.timestamp?.toMillis?.() || new Date(b.timestamp).getTime() || 0;
                    return timeB - timeA;
                });

                setHistory(combinedData);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    if (!user) {
        return <div className="p-8 text-center text-muted-foreground">Please log in to view your history.</div>;
    }

    return (
        <main className="p-4 sm:p-8 max-w-6xl mx-auto">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold flex items-center gap-2">
                            <Clock className="w-8 h-8 text-primary" /> History
                        </h2>
                        <p className="text-muted-foreground mt-1">View your past document comparisons and analyses.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12">
                        <LoaderCircle className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : history.length === 0 ? (
                    <Card className="p-12 text-center border-dashed">
                        <div className="flex flex-col items-center justify-center">
                            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">No history found</h3>
                            <p className="text-muted-foreground mt-2 mb-6">You haven't saved any comparisons or analyses yet.</p>
                            <div className="flex gap-4">
                                <Link href="/compare">
                                    <Button variant="outline">Start a Comparison</Button>
                                </Link>
                                <Link href="/analyze">
                                    <Button>Analyze a Document</Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {history.map((item) => (
                            <Card
                                key={item.id}
                                className="p-4 hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center group"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="flex-1 overflow-hidden pr-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-semibold text-lg capitalize">{item.type}</h4>
                                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                                            {item.timestamp?.toDate?.()?.toLocaleString() || (item.timestamp ? new Date(item.timestamp).toLocaleString() : "Just now")}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground truncate">
                                        {item.type === "comparison" && item.textA && `Document A: ${item.textA.substring(0, 100)}...`}
                                        {item.type === "analysis" && item.documentText && `Document: ${item.documentText.substring(0, 100)}...`}
                                    </div>
                                </div>
                                <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                    <Search className="w-5 h-5" />
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* History Detail Modal */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader className="flex flex-row items-center justify-between">
                        <div>
                            <DialogTitle className="capitalize text-xl">{selectedItem?.type} Details</DialogTitle>
                            <DialogDescription>
                                Saved on {selectedItem?.timestamp?.toDate?.()?.toLocaleString() || (selectedItem?.timestamp ? new Date(selectedItem.timestamp).toLocaleString() : "recently")}
                            </DialogDescription>
                        </div>
                        <Button
    variant="outline"
    size="sm"
    className="mr-6"
    onClick={() => {
        const text = selectedItem?.type === "comparison"
            ? `Document A:\n${selectedItem.textA || ""}\n\nDocument B:\n${selectedItem.textB || ""}`
            : `Extracted Clauses:\n${selectedItem?.clauses?.join('\n\n')}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                toast({
                    title: "Copied to clipboard",
                    description: "The details have been copied to your clipboard.",
                });
            }).catch(err => {
                console.error("Failed to copy text: ", err);
                toast({
                    title: "Copy failed",
                    description: "Could not copy to clipboard.",
                    variant: "destructive",
                });
            });
        } else {
            toast({
                title: "Copy failed",
                description: "Clipboard API not supported in this browser.",
                variant: "destructive",
            });
        }
    }}
>
    Copy Details
</Button>
                        
                    </DialogHeader>

                    <div className="mt-4">
                        {selectedItem?.type === "comparison" && selectedItem.textA && selectedItem.textB && (
                            <DiffViewer differences={diffWords(selectedItem.textA, selectedItem.textB)} />
                        )}

                        {selectedItem?.type === "analysis" && selectedItem.clauses && (
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">Extracted Clauses</h3>
                                {selectedItem.clauses.map((clause, idx) => (
                                    <div key={idx} className="p-3 bg-secondary/30 rounded-md text-sm">
                                        {clause}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
}
