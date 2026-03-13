import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  Bold,
  Italic,
  Highlighter,
  Link2,
  Type,
  Strikethrough,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RemoveFormatting,
  Subscript,
  Superscript,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const isInternalChange = useRef(false);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<Range | null>(null);

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

    if (!editorRef.current.contains(selection.anchorNode)) {
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();

    setToolbarPos({
      top: rect.top - editorRect.top - 52,
      left: rect.left - editorRect.left + rect.width / 2 - 140,
    });
    setShowToolbar(true);
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", checkSelection);
    return () => document.removeEventListener("selectionchange", checkSelection);
  }, [checkSelection]);

  const execCommand = (command: string, val?: string) => {
    document.execCommand(command, false, val);
    emitChange();
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

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelection.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedSelection.current);
    }
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    restoreSelection();
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    execCommand("createLink", url);
    setShowLinkInput(false);
    setLinkUrl("");
  };

  const handleKeyDownInternal = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "b") {
      e.preventDefault(); execCommand("bold"); return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "i") {
      e.preventDefault(); execCommand("italic"); return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "u") {
      e.preventDefault(); execCommand("underline"); return;
    }
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "s") {
      e.preventDefault(); execCommand("strikeThrough"); return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      saveSelection();
      setShowLinkInput(true);
      return;
    }
    onKeyDown?.(e);
  };

  const ToolbarButton: React.FC<{
    active?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
  }> = ({ active, onClick, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded hover:bg-muted transition-colors ${active ? "bg-muted text-foreground" : "text-muted-foreground"}`}
      title={title}
    >
      {children}
    </button>
  );

  const ToolbarSeparator = () => (
    <div className="w-px h-5 bg-border mx-0.5" />
  );

  return (
    <div className="relative">
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="absolute z-[100] bg-popover border border-border rounded-lg shadow-xl px-1.5 py-1 animate-in fade-in-0 zoom-in-95"
          style={{ top: `${toolbarPos.top}px`, left: `${Math.max(0, toolbarPos.left)}px` }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {showLinkInput ? (
            <div className="flex items-center gap-1.5 px-1 py-0.5">
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://exemplo.com"
                className="h-7 text-xs w-48"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); handleInsertLink(); }
                  if (e.key === "Escape") { setShowLinkInput(false); setLinkUrl(""); }
                }}
              />
              <Button size="sm" className="h-7 px-2 text-xs" onClick={handleInsertLink}>OK</Button>
              <Button size="sm" variant="ghost" className="h-7 px-1.5 text-xs" onClick={() => { setShowLinkInput(false); setLinkUrl(""); }}>✕</Button>
            </div>
          ) : (
            <div className="flex items-center gap-0.5">
              <div className="flex items-center gap-1 px-1.5 py-1 text-xs text-muted-foreground border-r border-border mr-0.5 pr-2">
                <Type className="h-3.5 w-3.5" />
                <span className="text-[11px]">¶</span>
              </div>

              <ToolbarButton active={isActive("bold")} onClick={() => execCommand("bold")} title="Negrito (Ctrl+B)">
                <Bold className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton active={isActive("italic")} onClick={() => execCommand("italic")} title="Itálico (Ctrl+I)">
                <Italic className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton active={isActive("underline")} onClick={() => execCommand("underline")} title="Sublinhado (Ctrl+U)">
                <Underline className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton active={isActive("strikeThrough")} onClick={() => execCommand("strikeThrough")} title="Riscado">
                <Strikethrough className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSeparator />

              <ToolbarButton onClick={() => execCommand("superscript")} title="Sobrescrito" active={isActive("superscript")}>
                <Superscript className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => execCommand("subscript")} title="Subscrito" active={isActive("subscript")}>
                <Subscript className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSeparator />

              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground" title="Destacar">
                    <Highlighter className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="center" side="top">
                  <div className="flex gap-1.5">
                    {HIGHLIGHT_COLORS.map((c) => (
                      <button key={c.color} type="button" onClick={() => applyHighlight(c.color)}
                        className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform"
                        style={{ background: c.color }} title={c.label} />
                    ))}
                    <button type="button" onClick={() => execCommand("removeFormat")}
                      className="w-6 h-6 rounded-full border border-border hover:scale-110 transition-transform bg-background flex items-center justify-center"
                      title="Remover destaque">
                      <RemoveFormatting className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              <ToolbarSeparator />

              <ToolbarButton onClick={() => execCommand("justifyLeft")} title="Alinhar à esquerda">
                <AlignLeft className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => execCommand("justifyCenter")} title="Centralizar">
                <AlignCenter className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => execCommand("justifyRight")} title="Alinhar à direita">
                <AlignRight className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSeparator />

              <ToolbarButton onClick={() => { saveSelection(); setShowLinkInput(true); }} title="Link (Ctrl+K)">
                <Link2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton onClick={() => execCommand("removeFormat")} title="Limpar formatação">
                <RemoveFormatting className="h-4 w-4" />
              </ToolbarButton>
            </div>
          )}
        </div>
      )}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onFocus={onFocus}
        onBlur={() => {
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
        className={`w-full outline-none text-base leading-7 px-4 py-3 min-h-[44px] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none [&_b]:font-bold [&_strong]:font-bold [&_i]:italic [&_em]:italic [&_s]:line-through [&_u]:underline [&_a]:text-accent [&_a]:underline [&_sub]:text-[0.8em] [&_sup]:text-[0.8em] ${className}`}
      />
    </div>
  );
};

export default RichTextEditor;
