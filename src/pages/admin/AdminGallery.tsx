import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";

const AdminGallery = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">Galeria</h1>
        <p className="text-muted-foreground">Gerencie as imagens do site</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Em breve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            A funcionalidade de galeria de imagens está em desenvolvimento. 
            Por enquanto, você pode atualizar as imagens diretamente nas seções e produtos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGallery;
