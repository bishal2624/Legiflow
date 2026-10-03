'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, CheckCircle2, Clock, FileStack } from "lucide-react";

interface DashboardStatsProps {
    total: number;
    open: number;
    closed: number;
    pending: number;
}
export function DashboardStats({ total, open, closed, pending }: DashboardStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                    <FileStack className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{total}</div>
                    <p className="text-xs text-muted-foreground">All tracked cases</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
                    <FolderOpen className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{open}</div>
                    <p className="text-xs text-muted-foreground">Active and ongoing</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Closed Cases</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{closed}</div>
                    <p className="text-xs text-muted-foreground">Successfully resolved</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Cases section</CardTitle>
                    <Clock className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pending}</div>
                    <p className="text-xs text-muted-foreground">Awaiting next steps</p>
                </CardContent>
            </Card>
        </div>
    );
}
