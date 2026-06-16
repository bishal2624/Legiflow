'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, CheckCircle2, Clock, FileStack } from "lucide-react";

interface DashboardStatsProps {
    total: number;
    open: number;
    closed: number;
    pending: number;
}
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export function DashboardStats({ total, open, closed, pending }: DashboardStatsProps) {
    const stats = [
        { title: "Total Cases", value: total, desc: "All tracked cases", icon: FileStack, colorClass: "text-muted-foreground" },
        { title: "Open Cases", value: open, desc: "Active and ongoing", icon: FolderOpen, colorClass: "text-blue-500" },
        { title: "Closed Cases", value: closed, desc: "Successfully resolved", icon: CheckCircle2, colorClass: "text-green-500" },
        { title: "Pending Cases", value: pending, desc: "Awaiting next steps", icon: Clock, colorClass: "text-amber-500" },
    ];

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="transition-all duration-300"
                    >
                        <Card className="border border-border/50 bg-[#13131f] shadow-lg hover:shadow-primary/5 hover:border-primary/20 overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <Icon className={`h-4 w-4 ${stat.colorClass}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
