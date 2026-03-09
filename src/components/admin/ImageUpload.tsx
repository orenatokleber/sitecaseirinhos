import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Crop, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { uploadImage, getPublicImageUrl } from "@/lib/supabase";
import { toast } from "sonner";
import ReactCrop, { Crop as CropType, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  aspectRatio?: number;
  recommendedSize?: string;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

async function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas is empty"));
      },
      "image/jpeg",
      0.9
    );
  });
}

const ImageUpload = ({ value, onChange, folder = "general", className, aspectRatio, recommendedSize }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const aspect = aspectRatio || 16 / 9;
      setCrop(centerAspectCrop(width, height, aspect));
    },
    [aspectRatio]
  );

  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop) {
      toast.error("Selecione uma área para cortar");
      return;
    }

    setIsUploading(true);

    try {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      const file = new File([croppedBlob], `cropped-${Date.now()}.jpg`, { type: "image/jpeg" });

      const path = await uploadImage(file, folder);
      if (path) {
        onChange(path);
        toast.success("Imagem enviada com sucesso!");
        setShowCropper(false);
        setSelectedFile(null);
      } else {
        toast.error("Erro ao enviar imagem");
      }
    } catch (error) {
      toast.error("Erro ao processar imagem");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleUploadWithoutCrop = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const response = await fetch(selectedFile);
      const blob = await response.blob();
      const file = new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });

      const path = await uploadImage(file, folder);
      if (path) {
        onChange(path);
        toast.success("Imagem enviada com sucesso!");
        setShowCropper(false);
        setSelectedFile(null);
      } else {
        toast.error("Erro ao enviar imagem");
      }
    } catch (error) {
      toast.error("Erro ao enviar imagem");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  const handleCancel = () => {
    setShowCropper(false);
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const imageUrl = value ? getPublicImageUrl(value) : null;

  return (
    <>
      <div className={`relative ${className}`}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {imageUrl ? (
          <div className="relative group">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md border border-border"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Trocar"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-full h-48 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-accent hover:text-accent transition-colors"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <>
                <Upload className="h-8 w-8" />
                <span className="text-sm">Clique para enviar imagem</span>
                {recommendedSize && (
                  <span className="text-xs opacity-70">Recomendado: {recommendedSize}</span>
                )}
              </>
            )}
          </button>
        )}
      </div>

      <Dialog open={showCropper} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Editar Imagem
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Arraste para posicionar e redimensione a área de corte.
              {recommendedSize && <span className="font-medium"> Tamanho recomendado: {recommendedSize}</span>}
            </p>

            {selectedFile && (
              <div className="flex justify-center bg-muted/30 rounded-lg p-4">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspectRatio}
                  className="max-h-[50vh]"
                >
                  <img
                    ref={imgRef}
                    src={selectedFile}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    className="max-h-[50vh] object-contain"
                  />
                </ReactCrop>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isUploading}>
                Cancelar
              </Button>
              <Button type="button" variant="secondary" onClick={handleUploadWithoutCrop} disabled={isUploading}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Usar Original
              </Button>
              <Button type="button" onClick={handleCropComplete} disabled={isUploading}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                Aplicar Corte
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUpload;
