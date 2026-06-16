'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="icon"
                        className="h-9 w-9 rounded-lg border-border/50 bg-[#13131f] hover:bg-card hover:text-foreground hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                    >
                        <div className="relative h-5 w-5 flex items-center justify-center">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-indigo-400" />
                        </div>
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-[#1e1e2e] border-primary/20 text-white/90">
                    <p className="text-xs">Switch to {theme === 'light' ? 'dark' : 'light'} mode</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
