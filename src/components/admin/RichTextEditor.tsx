import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  Bold,
  Italic,
  Highlighter,
  Link2,
  Type,
  Strikethrough,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const HIGHLIGHT_COLORS = [
  { label: "Amarelo", color: "#fef08a" },
  { label: "Verde", color: "#bbf7d0" },
  { label: "Azul", color: "#bfdbfe" },
  { label: "Rosa", color: "#fbcfe8" },
  { label: "Laranja", color: "#fed7aa" },
  { label: "Roxo", color: "#ddd6fe" },
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder = "Escreva algo...",
  className = "",
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPos, setToolbarPos] = useState({ top: 0, left: 0 });
  const isInternalChange = useRef(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  // Sync external value → contentEditable (only when value changes externally)
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const el = editorRef.current;
    if (el && el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const emitChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    isInternalChange.current = true;
    onChange(el.innerHTML);
  }, [onChange]);

  const handleInput = useCallback(() => {
    emitChange();
  }, [emitChange]);

  const checkSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !editorRef.current) {
      setShowToolbar(false);
      return;
    }

    // Check selection is within our editor
    if (!editorRef.current.contains(selection.anchorNode)) {
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    setToolbarPos({
      top: rect.top - editorRect.top - 48,
      left: rect.left - editorRect.left + rect.width / 2 - 100,
    });
    setShowToolbar(true);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", checkSelection);
    return () => document.removeEventListener("selectionchange", checkSelection);
  }, [checkSelection]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    emitChange();
    // Keep selection visible
    editorRef.current?.focus();
  };

  const applyHighlight = (color: string) => {
    document.execCommand("hiliteColor", false, color);
    emitChange();
    editorRef.current?.focus();
  };

  const isActive = (command: string) => {
    return document.queryCommandState(command);
  };

  const handleKeyDownInternal = (e: React.KeyboardEvent) => {
    // Bold: Ctrl/Cmd+B
    if ((e.metaKey || e.ctrlKey) && e.key === "b") {
      e.preventDefault();
      execCommand("bold");
      return;
    }
    // Italic: Ctrl/Cmd+I
    if ((e.metaKey || e.ctrlKey) && e.key === "i") {
      e.preventDefault();
      execCommand("italic");
      return;
    }
    // Strikethrough: Ctrl/Cmd+Shift+S
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "s") {
      e.preventDefault();
      execCommand("strikeThrough");
      return;
    }

    onKeyDown?.(e);
  };

  return (
    <div className="relative">
      {/* Floating Toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="absolute z-[100] flex items-center gap-0.5 bg-popover border border-border rounded-lg shadow-lg px-1.5 py-1 animate-in fade-in-0 zoom-in-95"
          style={{ top: `${toolbarPos.top}px`, left: `${Math.max(0, toolbarPos.left)}px` }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Block type indicator */}
          <div className="flex items-center gap-1 px-1.5 py-1 text-xs text-muted-foreground border-r border-border mr-0.5 pr-2">
            <Type className="h-3.5 w-3.5" />
            <span className="text-[11px]">¶</span>
          </div>

          <button
            type="button"
            onClick={() => execCommand("bold")}
            className={`p-1.5 rounded hover:bg-muted transition-colors ${isActive("bold") ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            title="Negrito (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("italic")}
            className={`p-1.5 rounded hover:bg-muted transition-colors ${isActive("italic") ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            title="Itálico (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => execCommand("strikeThrough")}
            className={`p-1.5 rounded hover:bg-muted transition-colors ${isActive("strikeThrough") ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            title="Riscado"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          {/* Highlight picker */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground"
                title="Destacar"
              >
                <Highlighter className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="center" side="top">
              <div className="flex gap-1.5">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.color}
                    type="button"
                    onClick={() => applyHighlight(c.color)}
                    className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform"
                    style={{ background: c.color }}
                    title={c.label}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Link */}
          <button
            type="button"
            onClick={() => {
              const url = prompt("URL do link:");
              if (url) execCommand("createLink", url);
            }}
            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground"
            title="Link"
          >
            <Link2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Content Editable Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={onFocus}
        onBlur={() => {
          // Small delay to allow toolbar clicks
          setTimeout(() => {
            const selection = window.getSelection();
            if (!editorRef.current?.contains(selection?.anchorNode || null)) {
              setShowToolbar(false);
              onBlur?.();
            }
          }, 200);
        }}
        onKeyDown={handleKeyDownInternal}
        data-placeholder={placeholder}
        className={`w-full outline-none text-base leading-7 px-4 py-3 min-h-[44px] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_s]:line-through [&_a]:text-accent [&_a]:underline ${className}`}
      />
    </div>
  );
};

export default RichTextEditor;
