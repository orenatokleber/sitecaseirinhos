import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Image, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { useGalleryImages, useCreateGalleryImage, useUpdateGalleryImage, useDeleteGalleryImage } from "@/hooks/useGallery";

interface FormData {
  image_url: string;
  title: string;
  alt_text: string;
  category: string;
  is_active: boolean;
}

const defaultForm: FormData = {
  image_url: "",
  title: "",
  alt_text: "",
  category: "",
  is_active: true,
};

const AdminGallery = () => {
  const { data: images, isLoading } = useGalleryImages(false);
  const createImage = useCreateGalleryImage();
  const updateImage = useUpdateGalleryImage();
  const deleteImage = useDeleteGalleryImage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultForm);

  const handleCreate = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setIsDialogOpen(true);
  };

  const handleEdit = (img: any) => {
    setEditingId(img.id);
    setFormData({
      image_url: img.image_url || "",
      title: img.title || "",
      alt_text: img.alt_text || "",
      category: img.category || "",
      is_active: img.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.image_url) return;

    if (editingId) {
      updateImage.mutate({ id: editingId, updates: formData }, { onSuccess: () => setIsDialogOpen(false) });
    } else {
      createImage.mutate(formData, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Excluir esta imagem?")) deleteImage.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Galeria</h1>
          <p className="text-muted-foreground">Gerencie as imagens do portfólio</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar Imagem
        </Button>
      </div>

      {images && images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <Card key={img.id} className={`overflow-hidden ${!img.is_active ? "opacity-50" : ""}`}>
              <div className="aspect-square relative group">
                <img src={img.image_url} alt={img.alt_text || img.title || ""} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="icon" variant="secondary" onClick={() => handleEdit(img)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(img.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {(img.title || img.category) && (
                <CardContent className="p-3">
                  {img.title && <p className="text-sm font-medium truncate">{img.title}</p>}
                  {img.category && <p className="text-xs text-muted-foreground">{img.category}</p>}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Image className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">Nenhuma imagem na galeria ainda.</p>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Primeira Imagem
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Imagem" : "Nova Imagem"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <ImageUpload
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              folder="gallery"
              aspectRatio={1}
              recommendedSize="800x800"
            />
            <div>
              <Label>Título (opcional)</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Ex: Bolo de casamento" />
            </div>
            <div>
              <Label>Texto alternativo (opcional)</Label>
              <Input value={formData.alt_text} onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })} placeholder="Descrição para acessibilidade" />
            </div>
            <div>
              <Label>Categoria (opcional)</Label>
              <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Ex: Bolos, Doces Finos" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.is_active} onCheckedChange={(v) => setFormData({ ...formData, is_active: v })} />
              <Label>Ativa</Label>
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={!formData.image_url || createImage.isPending || updateImage.isPending}>
              {(createImage.isPending || updateImage.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId ? "Salvar" : "Adicionar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminGallery;
