import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { FloatingElements } from "@/components/floating-elements";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ZODIAC_SIGNS } from "@/lib/constants";
import { RefreshCw, Bookmark } from "lucide-react";

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string>('');
  const [interpretation, setInterpretation] = useState<string>('');
  const { toast } = useToast();

  // Generate daily horoscope
  const horoscopeMutation = useMutation({
    mutationFn: async (zodiacSign: string) => {
      const response = await apiRequest('POST', '/api/horoscope/daily', { zodiacSign });
      return response.json();
    },
    onSuccess: (data) => {
      setInterpretation(data.interpretation);
      toast({
        title: "Günlük Yorumun Hazır",
        description: `${selectedSign} için özel yorum oluşturuldu`,
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Burç yorumu oluşturulamadı",
        variant: "destructive",
      });
    }
  });

  const handleSignSelect = (signName: string) => {
    setSelectedSign(signName);
    setInterpretation('');
    horoscopeMutation.mutate(signName);
  };

  const refreshHoroscope = () => {
    if (selectedSign) {
      horoscopeMutation.mutate(selectedSign);
    }
  };

  const currentDate = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const selectedSignData = ZODIAC_SIGNS.find(sign => sign.name === selectedSign);

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <FloatingElements />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-shadow mb-4">
              <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Günlük Burç Yorumları
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Her gün burcuna özel, AI tarafından oluşturulan benzersiz yorumlar
            </p>
          </div>

          {/* Zodiac Signs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            {ZODIAC_SIGNS.map((sign) => (
              <Button
                key={sign.name}
                onClick={() => handleSignSelect(sign.name)}
                variant={selectedSign === sign.name ? "default" : "outline"}
                className="group relative card-gradient p-4 border border-border hover-lift transition-all duration-300 text-center h-auto flex-col"
                disabled={horoscopeMutation.isPending}
                data-testid={`button-sign-${sign.name.toLowerCase()}`}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {sign.symbol}
                </div>
                <span className="text-sm font-medium">{sign.name}</span>
                <span className="text-xs text-muted-foreground mt-1">{sign.dates}</span>
              </Button>
            ))}
          </div>

          {/* Loading State */}
          {horoscopeMutation.isPending && (
            <div className="text-center mb-8">
              <LoadingSpinner size="lg" text="Günlük yorumun hazırlanıyor..." />
            </div>
          )}

          {/* Selected Horoscope Display */}
          {interpretation && selectedSignData && (
            <div className="max-w-3xl mx-auto">
              <Card className="glass-effect p-8">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <span className="text-4xl mr-4" data-testid="selected-sign-symbol">
                        {selectedSignData.symbol}
                      </span>
                      <div>
                        <h3 className="text-2xl font-bold" data-testid="selected-sign-name">
                          {selectedSignData.name}
                        </h3>
                        <p className="text-sm text-muted-foreground" data-testid="current-date">
                          {currentDate}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={refreshHoroscope}
                      disabled={horoscopeMutation.isPending}
                      data-testid="button-refresh-horoscope"
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Yenile
                    </Button>
                  </div>

                  <div 
                    className="text-foreground leading-relaxed whitespace-pre-line"
                    data-testid="horoscope-content"
                  >
                    {interpretation}
                  </div>

                  <div className="flex justify-end mt-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid="button-save-horoscope"
                    >
                      <Bookmark className="w-4 h-4 mr-1" />
                      Kaydet
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
