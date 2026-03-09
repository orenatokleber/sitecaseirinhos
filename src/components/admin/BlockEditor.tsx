import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ImageUpload from "@/components/admin/ImageUpload";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Quote,
  List,
  ListOrdered,
  Minus,
  Plus,
  Trash2,
  GripVertical,
  Code,
  AlignLeft,
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export interface Block {
  id: string;
  type: "paragraph" | "heading" | "heading2" | "heading3" | "image" | "quote" | "list" | "ordered-list" | "divider" | "code" | "spacer";
  content: string;
  imageUrl?: string;
  imageCaption?: string;
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

const BLOCK_CATEGORIES = [
  {
    name: "Texto",
    blocks: [
      { type: "paragraph" as const, icon: Type, label: "Parágrafo", description: "Texto simples" },
      { type: "heading" as const, icon: Heading1, label: "Título 1", description: "Título principal" },
      { type: "heading2" as const, icon: Heading2, label: "Título 2", description: "Título de seção" },
      { type: "heading3" as const, icon: Heading3, label: "Título 3", description: "Subtítulo" },
      { type: "quote" as const, icon: Quote, label: "Citação", description: "Destaque de texto" },
      { type: "code" as const, icon: Code, label: "Código", description: "Bloco de código" },
    ],
  },
  {
    name: "Mídia",
    blocks: [
      { type: "image" as const, icon: ImageIcon, label: "Imagem", description: "Upload de imagem" },
    ],
  },
  {
    name: "Layout",
    blocks: [
      { type: "list" as const, icon: List, label: "Lista", description: "Lista com marcadores" },
      { type: "ordered-list" as const, icon: ListOrdered, label: "Lista Numerada", description: "Lista ordenada" },
      { type: "divider" as const, icon: Minus, label: "Divisor", description: "Linha horizontal" },
      { type: "spacer" as const, icon: AlignLeft, label: "Espaçador", description: "Espaço em branco" },
    ],
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function BlockTypeIcon({ type }: { type: Block["type"] }) {
  const icons: Record<string, any> = {
    paragraph: Type,
    heading: Heading1,
    heading2: Heading2,
    heading3: Heading3,
    image: ImageIcon,
    quote: Quote,
    list: List,
    "ordered-list": ListOrdered,
    divider: Minus,
    code: Code,
    spacer: AlignLeft,
  };
  const Icon = icons[type] || Type;
  return <Icon className="h-4 w-4" />;
}

const BlockInserter: React.FC<{
  onSelect: (type: Block["type"]) => void;
  trigger?: React.ReactNode;
}> = ({ onSelect, trigger }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCategories = BLOCK_CATEGORIES.map((cat) => ({
    ...cat,
    blocks: cat.blocks.filter(
      (b) =>
        b.label.toLowerCase().includes(search.toLowerCase()) ||
        b.description.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.blocks.length > 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <button
            type="button"
            className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center hover:scale-110 transition-transform shadow-md"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-2 border-b border-border">
          <Input
            placeholder="Pesquisar blocos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 text-sm"
            autoFocus
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCategories.map((category) => (
            <div key={category.name} className="mb-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1">
                {category.name}
              </p>
              <div className="space-y-0.5">
                {category.blocks.map((block) => (
                  <button
                    key={block.type}
                    type="button"
                    onClick={() => {
                      onSelect(block.type);
                      setOpen(false);
                      setSearch("");
                    }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                      <block.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{block.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{block.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum bloco encontrado</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

/** Paragraph block with rich text editing */
const ParagraphBlock: React.FC<{
  block: Block;
  index: number;
  onUpdate: (index: number, updates: Partial<Block>) => void;
  onFocus: (index: number) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
}> = ({ block, index, onUpdate, onFocus, onBlur, onKeyDown }) => {
  return (
    <RichTextEditor
      value={block.content}
      onChange={(v) => onUpdate(index, { content: v })}
      onFocus={() => onFocus(index)}
      onBlur={() => onBlur()}
      onKeyDown={(e) => onKeyDown(e, index)}
      placeholder="Escreva algo, ou pressione / para comandos..."
    />
  );
};

const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange }) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const addBlock = (type: Block["type"], afterIndex: number) => {
    const newBlock: Block = { id: generateId(), type, content: "" };
    const updated = [...blocks];
    updated.splice(afterIndex + 1, 0, newBlock);
    onChange(updated);
    setTimeout(() => setFocusedIndex(afterIndex + 1), 50);
  };

  const updateBlock = (index: number, updates: Partial<Block>) => {
    onChange(blocks.map((b, i) => (i === index ? { ...b, ...updates } : b)));
  };

  const removeBlock = (index: number) => {
    if (blocks.length <= 1) return;
    onChange(blocks.filter((_, i) => i !== index));
    setFocusedIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const block = blocks[index];
    if (e.key === "Enter" && !e.shiftKey && block.type === "paragraph") {
      e.preventDefault();
      addBlock("paragraph", index);
    }
    const isEmpty = !block.content || block.content === "" || block.content === "<br>" || block.content.replace(/<[^>]*>/g, "").trim() === "";
    if (e.key === "Backspace" && isEmpty && blocks.length > 1) {
      e.preventDefault();
      removeBlock(index);
    }
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  return (
    <div className="min-h-[500px] bg-background">
      {blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Type className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4">Comece a escrever seu post</p>
          <BlockInserter
            onSelect={(type) => addBlock(type, -1)}
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Adicionar bloco
              </Button>
            }
          />
        </div>
      )}

      <Reorder.Group axis="y" values={blocks} onReorder={onChange} className="space-y-0">
        <AnimatePresence>
          {blocks.map((block, index) => (
            <Reorder.Item
              key={block.id}
              value={block}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative group">
                {hoveredIndex === index && index > 0 && (
                  <div className="absolute -top-3 left-0 right-0 flex items-center justify-center z-10">
                    <div className="h-0.5 bg-accent/30 flex-1" />
                    <BlockInserter onSelect={(type) => addBlock(type, index - 1)} />
                    <div className="h-0.5 bg-accent/30 flex-1" />
                  </div>
                )}

                <div
                  className={`absolute -left-12 top-0 flex items-center gap-1 transition-opacity ${
                    hoveredIndex === index || focusedIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="p-1 rounded hover:bg-muted text-muted-foreground">
                    <BlockTypeIcon type={block.type} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className={`absolute -right-10 top-1 p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all ${
                    hoveredIndex === index || focusedIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`relative rounded-lg transition-all ${
                    focusedIndex === index ? "bg-muted/30 ring-2 ring-accent/20" : ""
                  }`}
                >
                  {/* Paragraph with inline toolbar */}
                  {block.type === "paragraph" && (
                    <ParagraphBlock
                      block={block}
                      index={index}
                      onUpdate={updateBlock}
                      onFocus={setFocusedIndex}
                      onBlur={() => setFocusedIndex(null)}
                      onKeyDown={handleKeyDown}
                    />
                  )}

                  {block.type === "heading" && (
                    <Input
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      placeholder="Título"
                      className="w-full border-none shadow-none bg-transparent text-3xl font-heading font-bold focus-visible:ring-0 px-4 py-3 h-auto"
                    />
                  )}

                  {block.type === "heading2" && (
                    <Input
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      placeholder="Título de seção"
                      className="w-full border-none shadow-none bg-transparent text-2xl font-heading font-semibold focus-visible:ring-0 px-4 py-2 h-auto"
                    />
                  )}

                  {block.type === "heading3" && (
                    <Input
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      placeholder="Subtítulo"
                      className="w-full border-none shadow-none bg-transparent text-xl font-heading font-medium focus-visible:ring-0 px-4 py-2 h-auto"
                    />
                  )}

                  {block.type === "image" && (
                    <div className="px-4 py-4">
                      <ImageUpload
                        value={block.imageUrl || ""}
                        onChange={(url) => updateBlock(index, { imageUrl: url })}
                        folder="blog"
                        aspectRatio={16 / 9}
                        recommendedSize="1200x675"
                      />
                      {block.imageUrl && (
                        <Input
                          value={block.imageCaption || ""}
                          onChange={(e) => updateBlock(index, { imageCaption: e.target.value })}
                          placeholder="Adicionar legenda..."
                          className="mt-2 text-sm text-center border-dashed bg-transparent"
                        />
                      )}
                    </div>
                  )}

                  {block.type === "quote" && (
                    <div className="px-4 py-3">
                      <div className="border-l-4 border-accent pl-4">
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(index, { content: e.target.value })}
                          onFocus={() => setFocusedIndex(index)}
                          onBlur={() => setFocusedIndex(null)}
                          placeholder="Escreva uma citação..."
                          className="w-full border-none shadow-none resize-none bg-transparent text-lg italic focus-visible:ring-0 min-h-[44px] p-0"
                          onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                        />
                      </div>
                    </div>
                  )}

                  {(block.type === "list" || block.type === "ordered-list") && (
                    <div className="px-4 py-3">
                      <Textarea
                        value={block.content}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                        placeholder="Um item por linha..."
                        className="w-full border-none shadow-none resize-none bg-transparent text-base leading-7 focus-visible:ring-0 min-h-[80px] p-0"
                        onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {block.type === "list" ? "• " : "1. "}Cada linha será um item da lista
                      </p>
                    </div>
                  )}

                  {block.type === "divider" && (
                    <div className="px-4 py-6">
                      <hr className="border-border" />
                    </div>
                  )}

                  {block.type === "code" && (
                    <div className="px-4 py-3">
                      <Textarea
                        value={block.content}
                        onChange={(e) => updateBlock(index, { content: e.target.value })}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                        placeholder="// Escreva seu código aqui..."
                        className="w-full border-none shadow-none resize-none bg-muted/50 rounded-lg font-mono text-sm focus-visible:ring-0 min-h-[100px] p-4"
                        onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
                      />
                    </div>
                  )}

                  {block.type === "spacer" && (
                    <div className="px-4 py-8 flex items-center justify-center">
                      <div className="h-8 border-2 border-dashed border-muted rounded w-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Espaçador</span>
                      </div>
                    </div>
                  )}
                </motion.div>

                {index === blocks.length - 1 && (
                  <div className="flex items-center justify-center py-6">
                    <BlockInserter
                      onSelect={(type) => addBlock(type, index)}
                      trigger={
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
                          <Plus className="h-4 w-4" /> Adicionar bloco
                        </Button>
                      }
                    />
                  </div>
                )}
              </div>
            </Reorder.Item>
          ))}
        </AnimatePresence>
      </Reorder.Group>
    </div>
  );
};

export function serializeBlocks(blocks: Block[]): string {
  return JSON.stringify(blocks);
}

export function deserializeBlocks(content: string): Block[] {
  if (!content) return [{ id: generateId(), type: "paragraph", content: "" }];

  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
      return parsed.map((b: any) => ({
        ...b,
        type: b.type === "subheading" ? "heading2" : b.type,
      }));
    }
  } catch {}

  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);
  if (paragraphs.length === 0) return [{ id: generateId(), type: "paragraph", content: "" }];

  return paragraphs.map((p) => ({ id: generateId(), type: "paragraph" as const, content: p.trim() }));
}

/** Calculate reading time based on word count */
export function calculateReadingTime(blocks: Block[]): number {
  const wordsPerMinute = 200;
  let totalWords = 0;
  
  blocks.forEach((block) => {
    if (block.content) {
      // Strip HTML tags for counting
      const clean = block.content.replace(/<[^>]*>/g, "");
      totalWords += clean.split(/\s+/).filter(Boolean).length;
    }
    // Images add ~12 seconds each
    if (block.type === "image" && block.imageUrl) {
      totalWords += 40; // ~12s equivalent
    }
  });

  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}

export default BlockEditor;
