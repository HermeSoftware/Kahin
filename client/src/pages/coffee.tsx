import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { FloatingElements } from "@/components/floating-elements";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Eye, Trash, Bookmark } from "lucide-react";

export default function CoffeePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [interpretation, setInterpretation] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Analyze coffee image
  const analyzeMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await fetch('/api/coffee/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Analiz başarısız');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setInterpretation(data.interpretation);
      toast({
        title: "Kahve Falı Hazır",
        description: "AI görsel analizi tamamlandı",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Kahve falı analizi başarısız",
        variant: "destructive",
      });
    }
  });

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setInterpretation('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      analyzeMutation.mutate(selectedImage);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setInterpretation('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 aurora">
        <FloatingElements />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-shadow mb-4">
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                Kahve Falı
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Kahve fincanının fotoğrafını yükle, AI görsel analizi ile sembolleri yorumlasın
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Image Upload Area */}
            {!selectedImage && (
              <Card className="glass-effect p-8 mb-8">
                <CardContent className="p-0">
                  <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
                    <h3 className="text-lg font-semibold mb-2">Fincan Fotoğrafını Yükle</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Kahve falı için fincanının net bir fotoğrafını seç
                    </p>
                    
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageSelect}
                      ref={fileInputRef}
                      className="hidden"
                      data-testid="input-image-upload"
                    />
                    
                    <div className="space-y-3">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full bg-primary text-primary-foreground"
                        data-testid="button-select-image"
                      >
                        <Camera className="mr-2 w-4 h-4" />
                        Fotoğraf Seç
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Selected Image Preview */}
            {selectedImage && (
              <Card className="glass-effect p-6 mb-8">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Yüklenen Fotoğraf</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeImage}
                      className="text-destructive hover:text-destructive/80"
                      data-testid="button-remove-image"
                    >
                      <Trash className="w-4 h-4 mr-1" />
                      Sil
                    </Button>
                  </div>
                  
                  <img
                    src={imagePreview}
                    alt="Coffee cup for fortune reading"
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    data-testid="image-preview"
                  />
                  
                  {!interpretation && (
                    <Button
                      onClick={handleAnalyze}
                      disabled={analyzeMutation.isPending}
                      className="w-full bg-gradient-to-r from-accent to-primary text-accent-foreground font-semibold"
                      data-testid="button-analyze"
                    >
                      {analyzeMutation.isPending ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <Eye className="mr-2 w-4 h-4" />
                          Falı Yorumla
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* AI Analysis Result */}
            {interpretation && (
              <Card className="glass-effect p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-accent rounded-full mr-2 pulse-glow" />
                    <span className="text-sm text-muted-foreground">AI Görsel Analiz</span>
                  </div>
                  
                  <div 
                    className="text-foreground leading-relaxed whitespace-pre-line"
                    data-testid="coffee-interpretation"
                  >
                    {interpretation}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={removeImage}
                      data-testid="button-new-reading"
                    >
                      Yeni Fal
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid="button-save-fortune"
                    >
                      <Bookmark className="w-4 h-4 mr-1" />
                      Kaydet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
