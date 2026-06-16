'use client';

import { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Upload, Trash2, FileText, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentInputProps {
  onParse: (text: string) => void;
  isLoading: boolean;
}

export function DocumentInput({ onParse, isLoading }: DocumentInputProps) {
  const [text, setText] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const sampleText = searchParams.get('text');
    if (sampleText) {
      setText(decodeURIComponent(sampleText));
    }
  }, [searchParams]);

  const handleSubmit = () => {
    if (text.trim()) {
      onParse(text.trim());
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        const fileText = await file.text();
        setText(fileText);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileText = await file.text();
      setText(fileText);
    }
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="space-y-4">
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed p-6 text-center rounded-xl transition-all duration-300 ${
          isDragActive 
            ? 'border-primary bg-primary/5 scale-[0.99] shadow-lg' 
            : 'border-border/30 bg-[#13131f] hover:border-primary/20'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept=".txt,.md"
          className="hidden" 
          onChange={handleFileChange}
          disabled={isLoading}
        />

        <div className="flex flex-col items-center justify-center space-y-2 mb-4">
          <div className={`p-3 rounded-full ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-card text-muted-foreground'} transition-colors duration-300`}>
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground/90">Drag & drop legal document</h3>
            <p className="text-muted-foreground text-xs mt-0.5">Supports TXT, MD, or copy-paste text below</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 border-border/50 bg-[#1e1e2e]"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <FileText className="h-3.5 w-3.5 mr-1" />
            Browse Files
          </Button>
        </div>

        <div className="relative">
          <Textarea
            placeholder="Paste the text of your legal document here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-64 text-sm bg-background/50 focus-visible:ring-1 focus-visible:ring-primary/50 font-sans my-2 pr-10 border-border/40"
            disabled={isLoading}
          />
          <AnimatePresence>
            {text && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-5"
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setText('')}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                  title="Clear document text"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground px-1 mt-2">
          <div className="flex gap-3">
            <span>Words: <strong className="text-foreground/75 tabular-nums">{wordCount}</strong></span>
            <span>Characters: <strong className="text-foreground/75 tabular-nums">{charCount}</strong></span>
          </div>
          {wordCount > 0 && (
            <span className="flex items-center text-primary/80">
              <Sparkles className="h-3 w-3 mr-0.5" /> Ready for AI
            </span>
          )}
        </div>
      </div>

      <Button 
        onClick={handleSubmit} 
        className="w-full sm:w-auto px-6 h-10 shadow-lg bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg" 
        disabled={isLoading || !text.trim()}
      >
        {isLoading ? <LoaderCircle className="animate-spin mr-2 h-4 w-4" /> : null}
        Analyze Document
      </Button>
    </div>
  );
}
