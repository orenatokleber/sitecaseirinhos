import React from "react";
import { Clock, FileText, Hash, Type } from "lucide-react";

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  blockCount: number;
  readingTime: number;
  hasChanges: boolean;
  lastSaved?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  wordCount,
  charCount,
  blockCount,
  readingTime,
  hasChanges,
  lastSaved,
}) => {
  return (
    <footer className="h-8 border-t border-border bg-card flex items-center justify-between px-4 text-[11px] text-muted-foreground flex-shrink-0">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <Type className="h-3 w-3" /> {wordCount} palavras
        </span>
        <span className="flex items-center gap-1 hidden sm:flex">
          <Hash className="h-3 w-3" /> {charCount} caracteres
        </span>
        <span className="flex items-center gap-1 hidden sm:flex">
          <FileText className="h-3 w-3" /> {blockCount} blocos
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> ~{readingTime} min de leitura
        </span>
      </div>
      <div className="flex items-center gap-2">
        {hasChanges ? (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Alterações não salvas
          </span>
        ) : lastSaved ? (
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Salvo
          </span>
        ) : null}
      </div>
    </footer>
  );
};

export default StatusBar;
