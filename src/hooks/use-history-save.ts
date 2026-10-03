import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

interface SaveHistoryParams {
    type: "comparison" | "analysis";
    textA?: string;
    textB?: string;
    documentText?: string;
    clauses?: string[];
}

export function useHistorySave() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const saveToHistory = async (data: SaveHistoryParams) => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "You must be logged in to save history.",
                variant: "destructive"
            });
            return false;
        }

        setIsSaving(true);
        const historyRef = doc(collection(db, "history"));
        const historyId = historyRef.id;

        const historyData = {
            ...data,
            userId: user.uid,
            timestamp: new Date().toISOString(),
        };

        try {
            await setDoc(historyRef, {
                ...historyData,
                timestamp: serverTimestamp(),
            });

            toast({
                title: "Saved to History",
                description: `Your ${data.type} has been successfully saved to the cloud.`,
            });
            return true;
        } catch (error: any) {
            console.error("Error saving history:", error);
            
            try {
                const localHistoryStr = localStorage.getItem('legiflow_history');
                let localHistory = [];
                if (localHistoryStr) {
                    const parsed = JSON.parse(localHistoryStr);
                    if (Array.isArray(parsed)) {
                        localHistory = parsed;
                    }
                }
                localHistory.push({ ...historyData, id: historyId });
                localStorage.setItem('legiflow_history', JSON.stringify(localHistory));
                
                toast({
                    title: "Saved Locally",
                    description: "Cloud save failed or timed out. Saved to your browser's offline storage instead.",
                });
            } catch (localError) {
                console.error("Failed to save to local storage", localError);
                toast({
                    title: "Save Failed",
                    description: "Could not save to cloud or local storage. Your browser might be restricting storage.",
                    variant: "destructive"
                });
            }
            
            return true;
        } finally {
            setIsSaving(false);
        }
    };

    return { saveToHistory, isSaving };
}
