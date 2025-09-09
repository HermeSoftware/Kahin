import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/loading-spinner";
import { FloatingElements } from "@/components/floating-elements";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Moon, Bookmark } from "lucide-react";

const EMOTIONS = [
  'Mutlu',
  'Korkulu', 
  'Hüzünlü',
  'Heyecanlı',
  'Kaygılı',
  'Sakin',
  'Şaşkın',
  'Öfkeli'
];

export default function DreamsPage() {
  const [dreamDescription, setDreamDescription] = useState('');
  const [emotion, setEmotion] = useState('');
  const [dreamDate, setDreamDate] = useState(new Date().toISOString().split('T')[0]);
  const [interpretation, setInterpretation] = useState('');
  const { toast } = useToast();

  // Interpret dream
  const interpretMutation = useMutation({
    mutationFn: async (data: { dreamDescription: string; emotion?: string }) => {
      const response = await apiRequest('POST', '/api/dreams/interpret', data);
      return response.json();
    },
    onSuccess: (data) => {
      setInterpretation(data.interpretation);
      toast({
        title: "Rüya Yorumu Hazır",
        description: "AI analizi tamamlandı",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Rüya yorumu oluşturulamadı",
        variant: "destructive",
      });
    }
  });

  const handleInterpret = () => {
    if (dreamDescription.trim()) {
      interpretMutation.mutate({
        dreamDescription,
        emotion: emotion || undefined
      });
    }
  };

  const resetForm = () => {
    setDreamDescription('');
    setEmotion('');
    setDreamDate(new Date().toISOString().split('T')[0]);
    setInterpretation('');
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 aurora">
        <FloatingElements />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-shadow mb-4">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Rüya Tabiri
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Gördüğün rüyayı anlat, AI ile derin anlamlarını keşfet
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Dream Input Form */}
            <Card className="glass-effect p-8 mb-8">
              <CardContent className="p-0 space-y-6">
                <div>
                  <Label htmlFor="dreamText" className="text-sm font-medium mb-2 block">
                    Rüyanı Anlat
                  </Label>
                  <Textarea
                    id="dreamText"
                    value={dreamDescription}
                    onChange={(e) => setDreamDescription(e.target.value)}
                    placeholder="Gördüğün rüyayı detaylı şekilde anlat... Ne gördün, neler hissettin, hangi renkler, kişiler veya nesneler vardı?"
                    className="min-h-32 resize-none"
                    data-testid="textarea-dream-description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Rüyadaki Duygu</Label>
                    <Select value={emotion} onValueChange={setEmotion}>
                      <SelectTrigger data-testid="select-emotion">
                        <SelectValue placeholder="Duygu seç" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMOTIONS.map((emo) => (
                          <SelectItem key={emo} value={emo.toLowerCase()}>
                            {emo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Rüya Tarihi</Label>
                    <Input
                      type="date"
                      value={dreamDate}
                      onChange={(e) => setDreamDate(e.target.value)}
                      data-testid="input-dream-date"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleInterpret}
                  disabled={!dreamDescription.trim() || interpretMutation.isPending}
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold"
                  data-testid="button-interpret-dream"
                >
                  {interpretMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Moon className="mr-2 w-4 h-4" />
                      Rüyayı Yorumla
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Dream Interpretation Result */}
            {interpretation && (
              <Card className="glass-effect p-6">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2 pulse-glow" />
                    <span className="text-sm text-muted-foreground">AI Rüya Yorumcusu</span>
                  </div>

                  <div 
                    className="text-foreground leading-relaxed whitespace-pre-line"
                    data-testid="dream-interpretation"
                  >
                    {interpretation}
                  </div>

                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={resetForm}
                      data-testid="button-new-dream"
                    >
                      Yeni Rüya
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid="button-save-dream"
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
