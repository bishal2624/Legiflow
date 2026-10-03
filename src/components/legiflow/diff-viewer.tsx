import { Change } from "diff";

interface DiffViewerProps {
    differences: Change[];
    className?: string;
}

export function DiffViewer({ differences, className = "" }: DiffViewerProps) {
    return (
        <div className={`p-4 bg-background rounded-md border whitespace-pre-wrap font-mono text-sm leading-relaxed overflow-x-auto ${className}`}>
            {differences.map((part, index) => {
                const colorClass = part.added 
                    ? "bg-green-500/20 text-green-700 dark:text-green-300 px-0.5 rounded-sm" 
                    : part.removed 
                        ? "bg-red-500/20 text-red-700 dark:text-red-300 line-through px-0.5 rounded-sm" 
                        : "text-foreground";
                return (
                    <span key={index} className={colorClass}>
                        {part.value}
                    </span>
                );
            })}
        </div>
    );
}
