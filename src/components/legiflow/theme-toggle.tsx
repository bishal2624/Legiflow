'use client';
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <Button 
            variant="outline" 
            className="w-full justify-center"
            onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <>
                <Moon className="w-5 h-5" />
                <span className="group-data-[collapsible=icon]:hidden ml-2">Dark Mode</span>
            </>
          ) : (
            <>
                <Sun className="w-5 h-5" />
                <span className="group-data-[collapsible=icon]:hidden ml-2">Light Mode</span>
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
