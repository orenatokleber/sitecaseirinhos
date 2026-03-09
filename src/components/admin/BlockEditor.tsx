import React, { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  Type,
  Heading1,
  Heading2,
  ImageIcon,
  Quote,
  List,
  ListOrdered,
  Minus,
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Code,
} from "lucide-react";

export interface Block {
  id: string;
  type: "paragraph" | "heading" | "subheading" | "image" | "quote" | "list" | "ordered-list" | "divider" | "code";
  content: string;
  /** For images */
  imageUrl?: string;
  imageCaption?: string;
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

const BLOCK_TYPES = [
  { type: "paragraph" as const, icon: Type, label: "Parágrafo" },
  { type: "heading" as const, icon: Heading1, label: "Título" },
  { type: "subheading" as const, icon: Heading2, label: "Subtítulo" },
  { type: "image" as const, icon: ImageIcon, label: "Imagem" },
  { type: "quote" as const, icon: Quote, label: "Citação" },
  { type: "list" as const, icon: List, label: "Lista" },
  { type: "ordered-list" as const, icon: ListOrdered, label: "Lista Numerada" },
  { type: "divider" as const, icon: Minus, label: "Divisor" },
  { type: "code" as const, icon: Code, label: "Código" },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange }) => {
  const [showToolbar, setShowToolbar] = useState<number | null>(null);

  const addBlock = (type: Block["type"], afterIndex: number) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: "",
    };
    const updated = [...blocks];
    updated.splice(afterIndex + 1, 0, newBlock);
    onChange(updated);
    setShowToolbar(null);
  };

  const updateBlock = (index: number, updates: Partial<Block>) => {
    const updated = blocks.map((b, i) => (i === index ? { ...b, ...updates } : b));
    onChange(updated);
  };

  const removeBlock = (index: number) => {
    if (blocks.length <= 1) return;
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" && !e.shiftKey && blocks[index].type === "paragraph") {
      e.preventDefault();
      addBlock("paragraph", index);
    }
    if (e.key === "Backspace" && blocks[index].content === "" && blocks.length > 1) {
      e.preventDefault();
      removeBlock(index);
    }
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/50 flex-wrap">
        {BLOCK_TYPES.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs gap-1"
            onClick={() => addBlock(type, blocks.length - 1)}
            title={label}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{label}</span>
          </Button>
        ))}
      </div>

      {/* Blocks */}
      <div className="p-4 space-y-1 min-h-[300px]">
        {blocks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-3">Clique nos botões acima para adicionar blocos de conteúdo</p>
            <Button variant="outline" size="sm" onClick={() => addBlock("paragraph", -1)}>
              <Plus className="h-4 w-4 mr-1" /> Adicionar Parágrafo
            </Button>
          </div>
        )}

        {blocks.map((block, index) => (
          <div
            key={block.id}
            className="group relative flex gap-1 items-start"
          >
            {/* Side controls */}
            <div className="flex flex-col items-center gap-0.5 pt-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex-shrink-0">
              <button
                type="button"
                onClick={() => moveBlock(index, -1)}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                disabled={index === 0}
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
              <button
                type="button"
                onClick={() => moveBlock(index, 1)}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                disabled={index === blocks.length - 1}
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Block content */}
            <div className="flex-1 min-w-0">
              {block.type === "paragraph" && (
                <Textarea
                  value={block.content}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  placeholder="Escreva aqui..."
                  className="border-none shadow-none resize-none bg-transparent text-base focus-visible:ring-0 min-h-[40px] p-2"
                  rows={1}
                  style={{ height: "auto" }}
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = "auto";
                    t.style.height = t.scrollHeight + "px";
                  }}
                />
              )}

              {block.type === "heading" && (
                <Input
                  value={block.content}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  placeholder="Título da seção"
                  className="border-none shadow-none bg-transparent text-2xl font-heading font-bold focus-visible:ring-0 p-2 h-auto"
                />
              )}

              {block.type === "subheading" && (
                <Input
                  value={block.content}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  placeholder="Subtítulo"
                  className="border-none shadow-none bg-transparent text-xl font-heading font-semibold focus-visible:ring-0 p-2 h-auto"
                />
              )}

              {block.type === "image" && (
                <div className="p-2 space-y-2">
                  <ImageUpload
                    value={block.imageUrl || ""}
                    onChange={(url) => updateBlock(index, { imageUrl: url })}
                    folder="blog"
                    aspectRatio={16 / 9}
                    recommendedSize="1200x675"
                  />
                  <Input
                    value={block.imageCaption || ""}
                    onChange={(e) => updateBlock(index, { imageCaption: e.target.value })}
                    placeholder="Legenda da imagem (opcional)"
                    className="text-sm text-center border-dashed"
                  />
                </div>
              )}

              {block.type === "quote" && (
                <div className="border-l-4 border-accent pl-4 py-1">
                  <Textarea
                    value={block.content}
                    onChange={(e) => updateBlock(index, { content: e.target.value })}
                    placeholder="Escreva a citação..."
                    className="border-none shadow-none resize-none bg-transparent text-base italic focus-visible:ring-0 min-h-[40px] p-1"
                    rows={1}
                    onInput={(e) => {
                      const t = e.target as HTMLTextAreaElement;
                      t.style.height = "auto";
                      t.style.height = t.scrollHeight + "px";
                    }}
                  />
                </div>
              )}

              {(block.type === "list" || block.type === "ordered-list") && (
                <Textarea
                  value={block.content}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  placeholder="Um item por linha..."
                  className="border-none shadow-none resize-none bg-transparent text-base focus-visible:ring-0 min-h-[60px] p-2"
                  rows={3}
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = "auto";
                    t.style.height = t.scrollHeight + "px";
                  }}
                />
              )}

              {block.type === "divider" && (
                <div className="py-4 px-2">
                  <hr className="border-border" />
                </div>
              )}

              {block.type === "code" && (
                <Textarea
                  value={block.content}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  placeholder="Código..."
                  className="border-none shadow-none resize-none bg-muted rounded-md font-mono text-sm focus-visible:ring-0 min-h-[60px] p-3"
                  rows={3}
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = "auto";
                    t.style.height = t.scrollHeight + "px";
                  }}
                />
              )}
            </div>

            {/* Delete button */}
            <button
              type="button"
              onClick={() => removeBlock(index)}
              className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex-shrink-0 mt-2"
              title="Remover bloco"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {/* Add block button at bottom */}
        {blocks.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs gap-1 border-dashed"
              onClick={() => setShowToolbar(showToolbar === -1 ? null : -1)}
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar bloco
            </Button>
          </div>
        )}

        {showToolbar === -1 && (
          <div className="flex flex-wrap gap-1 justify-center p-2 bg-muted/50 rounded-lg">
            {BLOCK_TYPES.map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs gap-1"
                onClick={() => addBlock(type, blocks.length - 1)}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/** Serialize blocks to JSON string for storage */
export function serializeBlocks(blocks: Block[]): string {
  return JSON.stringify(blocks);
}

/** Deserialize JSON string to blocks, with fallback for plain text */
export function deserializeBlocks(content: string): Block[] {
  if (!content) return [{ id: generateId(), type: "paragraph", content: "" }];

  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
      return parsed;
    }
  } catch {
    // Fallback: convert plain text to paragraph blocks
  }

  // Convert plain text content into blocks
  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);
  if (paragraphs.length === 0) return [{ id: generateId(), type: "paragraph", content: "" }];

  return paragraphs.map((p) => ({
    id: generateId(),
    type: "paragraph" as const,
    content: p.trim(),
  }));
}

export default BlockEditor;
