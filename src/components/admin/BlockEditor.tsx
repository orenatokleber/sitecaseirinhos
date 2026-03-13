import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  AlertTriangle,
  Info,
  CheckCircle2,
  Lightbulb,
  Youtube,
  Copy,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  RefreshCw,
  Columns,
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

export interface Block {
  id: string;
  type: "paragraph" | "heading" | "heading2" | "heading3" | "image" | "quote" | "list" | "ordered-list" | "divider" | "code" | "spacer" | "callout" | "embed" | "columns";
  content: string;
  imageUrl?: string;
  imageCaption?: string;
  calloutType?: "info" | "warning" | "success" | "tip";
  embedUrl?: string;
  columnContent?: string; // second column content for columns block
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

const BLOCK_CATEGORIES = [
  {
    name: "Texto",
    blocks: [
      { type: "paragraph" as const, icon: Type, label: "Parágrafo", description: "Texto com formatação rica" },
      { type: "heading" as const, icon: Heading1, label: "Título 1", description: "Título principal" },
      { type: "heading2" as const, icon: Heading2, label: "Título 2", description: "Título de seção" },
      { type: "heading3" as const, icon: Heading3, label: "Título 3", description: "Subtítulo" },
      { type: "quote" as const, icon: Quote, label: "Citação", description: "Destaque de texto" },
      { type: "code" as const, icon: Code, label: "Código", description: "Bloco de código" },
      { type: "callout" as const, icon: Info, label: "Callout", description: "Nota, aviso ou dica" },
    ],
  },
  {
    name: "Mídia",
    blocks: [
      { type: "image" as const, icon: ImageIcon, label: "Imagem", description: "Upload de imagem" },
      { type: "embed" as const, icon: Youtube, label: "Embed", description: "YouTube, Vimeo, etc." },
    ],
  },
  {
    name: "Layout",
    blocks: [
      { type: "list" as const, icon: List, label: "Lista", description: "Lista com marcadores" },
      { type: "ordered-list" as const, icon: ListOrdered, label: "Lista Numerada", description: "Lista ordenada" },
      { type: "columns" as const, icon: Columns, label: "2 Colunas", description: "Texto lado a lado" },
      { type: "divider" as const, icon: Minus, label: "Divisor", description: "Linha horizontal" },
      { type: "spacer" as const, icon: AlignLeft, label: "Espaçador", description: "Espaço em branco" },
    ],
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

const BLOCK_ICON_MAP: Record<string, any> = {
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
  callout: Info,
  embed: Youtube,
  columns: Columns,
};

function BlockTypeIcon({ type }: { type: Block["type"] }) {
  const Icon = BLOCK_ICON_MAP[type] || Type;
  return <Icon className="h-4 w-4" />;
}

const CALLOUT_STYLES: Record<string, { icon: any; borderColor: string; bgColor: string; label: string }> = {
  info: { icon: Info, borderColor: "border-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950/30", label: "Informação" },
  warning: { icon: AlertTriangle, borderColor: "border-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950/30", label: "Aviso" },
  success: { icon: CheckCircle2, borderColor: "border-green-400", bgColor: "bg-green-50 dark:bg-green-950/30", label: "Sucesso" },
  tip: { icon: Lightbulb, borderColor: "border-purple-400", bgColor: "bg-purple-50 dark:bg-purple-950/30", label: "Dica" },
};

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

function extractEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}

const CONVERTIBLE_TYPES: { type: Block["type"]; label: string }[] = [
  { type: "paragraph", label: "Parágrafo" },
  { type: "heading", label: "Título 1" },
  { type: "heading2", label: "Título 2" },
  { type: "heading3", label: "Título 3" },
  { type: "quote", label: "Citação" },
  { type: "code", label: "Código" },
  { type: "callout", label: "Callout" },
];

const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange }) => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const addBlock = (type: Block["type"], afterIndex: number) => {
    const newBlock: Block = {
      id: generateId(), type, content: "",
      ...(type === "callout" ? { calloutType: "info" } : {}),
    };
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

  const duplicateBlock = (index: number) => {
    const block = blocks[index];
    const dup: Block = { ...block, id: generateId() };
    const updated = [...blocks];
    updated.splice(index + 1, 0, dup);
    onChange(updated);
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
    setFocusedIndex(newIndex);
  };

  const convertBlock = (index: number, newType: Block["type"]) => {
    const block = blocks[index];
    const stripped = block.content.replace(/<[^>]*>/g, "");
    updateBlock(index, {
      type: newType,
      content: ["heading", "heading2", "heading3"].includes(newType) ? stripped : block.content,
      ...(newType === "callout" ? { calloutType: block.calloutType || "info" } : {}),
    });
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

                {/* Left controls: drag + type icon */}
                <div
                  className={`absolute -left-14 top-0 flex items-center gap-0.5 transition-opacity ${
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

                {/* Right controls: more menu */}
                <div
                  className={`absolute -right-12 top-0 transition-opacity ${
                    hoveredIndex === index || focusedIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="p-1.5 rounded hover:bg-muted text-muted-foreground">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => moveBlock(index, "up")} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4 mr-2" /> Mover para cima
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => moveBlock(index, "down")} disabled={index === blocks.length - 1}>
                        <ArrowDown className="h-4 w-4 mr-2" /> Mover para baixo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateBlock(index)}>
                        <Copy className="h-4 w-4 mr-2" /> Duplicar bloco
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <RefreshCw className="h-4 w-4 mr-2" /> Converter para...
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {CONVERTIBLE_TYPES.filter((t) => t.type !== block.type).map((t) => (
                            <DropdownMenuItem key={t.type} onClick={() => convertBlock(index, t.type)}>
                              <BlockTypeIcon type={t.type} /> <span className="ml-2">{t.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => removeBlock(index)} className="text-destructive focus:text-destructive" disabled={blocks.length <= 1}>
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir bloco
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`relative rounded-lg transition-all ${
                    focusedIndex === index ? "bg-muted/30 ring-2 ring-accent/20" : ""
                  }`}
                >
                  {block.type === "paragraph" && (
                    <ParagraphBlock block={block} index={index} onUpdate={updateBlock}
                      onFocus={setFocusedIndex} onBlur={() => setFocusedIndex(null)} onKeyDown={handleKeyDown} />
                  )}

                  {block.type === "heading" && (
                    <Input value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })}
                      onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}
                      placeholder="Título" className="w-full border-none shadow-none bg-transparent text-3xl font-heading font-bold focus-visible:ring-0 px-4 py-3 h-auto" />
                  )}

                  {block.type === "heading2" && (
                    <Input value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })}
                      onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}
                      placeholder="Título de seção" className="w-full border-none shadow-none bg-transparent text-2xl font-heading font-semibold focus-visible:ring-0 px-4 py-2 h-auto" />
                  )}

                  {block.type === "heading3" && (
                    <Input value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })}
                      onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}
                      placeholder="Subtítulo" className="w-full border-none shadow-none bg-transparent text-xl font-heading font-medium focus-visible:ring-0 px-4 py-2 h-auto" />
                  )}

                  {block.type === "image" && (
                    <div className="px-4 py-4">
                      <ImageUpload value={block.imageUrl || ""} onChange={(url) => updateBlock(index, { imageUrl: url })}
                        folder="blog" aspectRatio={16 / 9} recommendedSize="1200x675" />
                      {block.imageUrl && (
                        <Input value={block.imageCaption || ""} onChange={(e) => updateBlock(index, { imageCaption: e.target.value })}
                          placeholder="Adicionar legenda..." className="mt-2 text-sm text-center border-dashed bg-transparent" />
                      )}
                    </div>
                  )}

                  {block.type === "quote" && (
                    <div className="px-4 py-3">
                      <div className="border-l-4 border-accent pl-4">
                        <Textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })}
                          onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}
                          placeholder="Escreva uma citação..." className="w-full border-none shadow-none resize-none bg-transparent text-lg italic focus-visible:ring-0 min-h-[44px] p-0"
                          onInput={(e) => autoResize(e.target as HTMLTextAreaElement)} />
                      </div>
                    </div>
                  )}

                  {(block.type === "list" || block.type === "ordered-list") && (
                    <div className="px-4 py-3">
                      <Textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })}
                        onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}
                        placeholder="Um item por linha..." className="w-full border-none shadow-none resize-none bg-transparent text-base leading-7 focus-visible:ring-0 min-h-[80px] p-0"
                        onInput={(e) => autoResize(e.target as HTMLTextAreaElement)} />
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
                      <Textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })}
                        onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}
                        placeholder="// Escreva seu código aqui..." className="w-full border-none shadow-none resize-none bg-muted/50 rounded-lg font-mono text-sm focus-visible:ring-0 min-h-[100px] p-4"
                        onInput={(e) => autoResize(e.target as HTMLTextAreaElement)} />
                    </div>
                  )}

                  {block.type === "spacer" && (
                    <div className="px-4 py-8 flex items-center justify-center">
                      <div className="h-8 border-2 border-dashed border-muted rounded w-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Espaçador</span>
                      </div>
                    </div>
                  )}

                  {block.type === "callout" && (() => {
                    const style = CALLOUT_STYLES[block.calloutType || "info"];
                    const CalloutIcon = style.icon;
                    return (
                      <div className={`mx-4 my-3 rounded-lg border-l-4 ${style.borderColor} ${style.bgColor} p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <CalloutIcon className="h-4 w-4 flex-shrink-0" />
                          <div className="flex gap-1">
                            {Object.entries(CALLOUT_STYLES).map(([key, s]) => (
                              <button key={key} type="button" onClick={() => updateBlock(index, { calloutType: key as Block["calloutType"] })}
                                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${block.calloutType === key ? "bg-foreground/10 border-foreground/20 font-medium" : "border-transparent hover:bg-foreground/5"}`}>
                                {s.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <Textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })}
                          onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}
                          placeholder="Escreva uma nota..." className="w-full border-none shadow-none resize-none bg-transparent text-sm focus-visible:ring-0 min-h-[40px] p-0"
                          onInput={(e) => autoResize(e.target as HTMLTextAreaElement)} />
                      </div>
                    );
                  })()}

                  {block.type === "embed" && (
                    <div className="px-4 py-4 space-y-3">
                      <div className="flex gap-2">
                        <Input value={block.embedUrl || ""} onChange={(e) => updateBlock(index, { embedUrl: e.target.value })}
                          placeholder="Cole a URL do YouTube, Vimeo..." className="text-sm" />
                      </div>
                      {block.embedUrl && extractEmbedUrl(block.embedUrl) && (
                        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                          <iframe src={extractEmbedUrl(block.embedUrl)!} className="w-full h-full" allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                        </div>
                      )}
                      <Input value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })}
                        placeholder="Legenda do vídeo (opcional)" className="text-sm border-dashed" />
                    </div>
                  )}

                  {block.type === "columns" && (
                    <div className="px-4 py-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Coluna 1</p>
                          <Textarea value={block.content} onChange={(e) => updateBlock(index, { content: e.target.value })}
                            onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}
                            placeholder="Conteúdo da coluna 1..." className="w-full border shadow-none resize-none bg-transparent text-sm focus-visible:ring-accent/30 min-h-[80px] rounded-lg"
                            onInput={(e) => autoResize(e.target as HTMLTextAreaElement)} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Coluna 2</p>
                          <Textarea value={block.columnContent || ""} onChange={(e) => updateBlock(index, { columnContent: e.target.value })}
                            onFocus={() => setFocusedIndex(index)} onBlur={() => setFocusedIndex(null)}
                            placeholder="Conteúdo da coluna 2..." className="w-full border shadow-none resize-none bg-transparent text-sm focus-visible:ring-accent/30 min-h-[80px] rounded-lg"
                            onInput={(e) => autoResize(e.target as HTMLTextAreaElement)} />
                        </div>
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

export function calculateReadingTime(blocks: Block[]): number {
  const wordsPerMinute = 200;
  let totalWords = 0;
  
  blocks.forEach((block) => {
    if (block.content) {
      const clean = block.content.replace(/<[^>]*>/g, "");
      totalWords += clean.split(/\s+/).filter(Boolean).length;
    }
    if (block.type === "image" && block.imageUrl) totalWords += 40;
    if (block.type === "embed" && block.embedUrl) totalWords += 100;
  });

  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}

export function getWordCount(blocks: Block[]): number {
  let total = 0;
  blocks.forEach((block) => {
    if (block.content) {
      const clean = block.content.replace(/<[^>]*>/g, "");
      total += clean.split(/\s+/).filter(Boolean).length;
    }
    if (block.columnContent) {
      const clean = block.columnContent.replace(/<[^>]*>/g, "");
      total += clean.split(/\s+/).filter(Boolean).length;
    }
  });
  return total;
}

export function getCharCount(blocks: Block[]): number {
  let total = 0;
  blocks.forEach((block) => {
    if (block.content) {
      total += block.content.replace(/<[^>]*>/g, "").length;
    }
    if (block.columnContent) {
      total += block.columnContent.replace(/<[^>]*>/g, "").length;
    }
  });
  return total;
}

export default BlockEditor;
