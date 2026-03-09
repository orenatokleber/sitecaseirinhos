import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bold, Italic, Highlighter, Type } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InlineToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (value: string) => void;
}

const HIGHLIGHT_COLORS = [
  { label: "Amarelo", color: "#fef08a" },
  { label: "Verde", color: "#bbf7d0" },
  { label: "Azul", color: "#bfdbfe" },
  { label: "Rosa", color: "#fbcfe8" },
  { label: "Laranja", color: "#fed7aa" },
  { label: "Roxo", color: "#ddd6fe" },
];

const FONT_SIZES = [
  { label: "Pequeno", tag: "small" },
  { label: "Normal", tag: "" },
  { label: "Grande", tag: "big" },
];

function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string
): string {
  const selected = value.slice(start, end);
  // Check if already wrapped — toggle off
  const beforeText = value.slice(Math.max(0, start - before.length), start);
  const afterText = value.slice(end, end + after.length);
  if (beforeText === before && afterText === after) {
    return (
      value.slice(0, start - before.length) +
      selected +
      value.slice(end + after.length)
    );
  }
  return value.slice(0, start) + before + selected + after + value.slice(end);
}

const InlineToolbar: React.FC<InlineToolbarProps> = ({
  textareaRef,
  value,
  onChange,
}) => {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const checkSelection = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start !== end) {
      setSelection({ start, end });
      // Position toolbar above selection
      const rect = el.getBoundingClientRect();
      // Approximate position based on character position
      const lineHeight = 28;
      const charsPerLine = Math.floor(el.clientWidth / 8);
      const startLine = Math.floor(start / charsPerLine);
      setPos({
        top: rect.top - 48 + startLine * lineHeight,
        left: rect.left + (start % charsPerLine) * 4,
      });
      setShow(true);
    } else {
      setShow(false);
    }
  }, [textareaRef]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const handler = () => setTimeout(checkSelection, 10);
    el.addEventListener("mouseup", handler);
    el.addEventListener("keyup", handler);
    return () => {
      el.removeEventListener("mouseup", handler);
      el.removeEventListener("keyup", handler);
    };
  }, [textareaRef, checkSelection]);

  const applyFormat = (before: string, after: string) => {
    const result = wrapSelection(value, selection.start, selection.end, before, after);
    onChange(result);
    setShow(false);
  };

  const applyHighlight = (color: string) => {
    applyFormat(`<mark style="background:${color}">`, "</mark>");
  };

  const applySize = (tag: string) => {
    if (!tag) return;
    applyFormat(`<${tag}>`, `</${tag}>`);
  };

  if (!show) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[100] flex items-center gap-0.5 bg-popover border border-border rounded-lg shadow-lg px-1 py-1 animate-in fade-in-0 zoom-in-95"
      style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={() => applyFormat("**", "**")}
        className="p-1.5 rounded hover:bg-muted transition-colors"
        title="Negrito"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => applyFormat("*", "*")}
        className="p-1.5 rounded hover:bg-muted transition-colors"
        title="Itálico"
      >
        <Italic className="h-4 w-4" />
      </button>

      {/* Highlight color picker */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-muted transition-colors"
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

      {/* Font size */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-muted transition-colors"
            title="Tamanho da fonte"
          >
            <Type className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="center" side="top">
          <div className="flex flex-col gap-1">
            {FONT_SIZES.filter((s) => s.tag).map((s) => (
              <button
                key={s.tag}
                type="button"
                onClick={() => applySize(s.tag)}
                className="text-sm px-3 py-1 rounded hover:bg-muted transition-colors text-left"
              >
                {s.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default InlineToolbar;
