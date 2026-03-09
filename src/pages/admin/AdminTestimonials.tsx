import { useState } from "react";
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/hooks/useSiteContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";

interface TestimonialFormData {
  name: string;
  content: string;
  stars: number;
  is_active: boolean;
}

const defaultFormData: TestimonialFormData = {
  name: "",
  content: "",
  stars: 5,
  is_active: true
};

const AdminTestimonials = () => {
  const { data: testimonials, isLoading } = useTestimonials(false);
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>(defaultFormData);

  const handleEdit = (testimonial: any) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      content: testimonial.content,
      stars: testimonial.stars,
      is_active: testimonial.is_active
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingId) {
      updateTestimonial.mutate({ id: editingId, updates: formData }, {
        onSuccess: () => setIsDialogOpen(false)
      });
    } else {
      createTestimonial.mutate(formData, {
        onSuccess: () => setIsDialogOpen(false)
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este depoimento?")) {
      deleteTestimonial.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Depoimentos</h1>
          <p className="text-muted-foreground">Gerencie avaliações de clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Depoimento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Depoimento" : "Novo Depoimento"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Cliente</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Maria Silva"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Depoimento</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="O que o cliente disse..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Avaliação</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, stars: star })}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        className={star <= formData.stars ? "fill-gold text-gold" : "text-border"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Ativo (visível no site)</Label>
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={createTestimonial.isPending || updateTestimonial.isPending}
              >
                {(createTestimonial.isPending || updateTestimonial.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingId ? "Salvar Alterações" : "Criar Depoimento"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials?.map((testimonial: any) => (
          <Card key={testimonial.id} className={!testimonial.is_active ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <div className="flex gap-0.5">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic mb-4">
                "{testimonial.content}"
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)}>
                  <Pencil className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDelete(testimonial.id)}
                  disabled={deleteTestimonial.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {testimonials?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Nenhum depoimento cadastrado.</p>
          <Button className="mt-4" onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Primeiro Depoimento
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
