import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { FloatingElements } from "@/components/floating-elements";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Bookmark, RefreshCw, Eye } from "lucide-react";

interface SelectedCard {
  name: string;
  index: number;
}

export default function TarotPage() {
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([]);
  const [interpretation, setInterpretation] = useState<string>('');
  const [cardSelectionStep, setCardSelectionStep] = useState<'intro' | 'selecting' | 'revealing' | 'completed'>('intro');
  const { toast } = useToast();

  // Fetch all tarot cards
  const { data: cardsData, isLoading: cardsLoading } = useQuery({
    queryKey: ['/api/tarot/cards'],
  });

  // Interpret tarot reading
  const interpretMutation = useMutation({
    mutationFn: async (cards: string[]) => {
      const response = await apiRequest('POST', '/api/tarot/interpret', { cards });
      return response.json();
    },
    onSuccess: (data) => {
      setInterpretation(data.interpretation);
      toast({
        title: "Tarot Yorumu Hazır",
        description: "AI tarafından oluşturulan özel yorumun aşağıda",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Tarot yorumu oluşturulamadı",
        variant: "destructive",
      });
    }
  });

  const handleCardClick = (cardName: string, index: number) => {
    if (selectedCards.some(c => c.index === index)) {
      // Remove card if already selected
      setSelectedCards(prev => prev.filter(c => c.index !== index));
    } else if (selectedCards.length < 3) {
      // Add card if less than 3 selected
      setSelectedCards(prev => [...prev, { name: cardName, index }]);
    }
  };

  const handleStartSelection = () => {
    setCardSelectionStep('selecting');
  };

  const handleRevealCards = () => {
    if (selectedCards.length === 3) {
      setCardSelectionStep('revealing');
      // Auto advance to completed after a short delay for dramatic effect
      setTimeout(() => {
        setCardSelectionStep('completed');
      }, 2000);
    }
  };

  const handleInterpret = () => {
    if (selectedCards.length === 3) {
      const cardNames = selectedCards.map(c => c.name);
      interpretMutation.mutate(cardNames);
    }
  };

  const resetReading = () => {
    setSelectedCards([]);
    setInterpretation('');
    setCardSelectionStep('intro');
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 aurora">
        <FloatingElements />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Tarot Falı
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Üç gizli kart seçerek geçmişin, şimdiki halin ve geleceğin hakkında derin içgörüler keşfet
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            {cardSelectionStep === 'intro' && (
              <div className="text-center mb-8">
                <div className="glass-effect rounded-lg p-8 mb-6">
                  <p className="text-lg text-primary-foreground mb-6">
                    Ruhuna seslenen üç kartı seç. Bu kartlar geçmişin, şimdiki halin ve geleceğin hakkında 
                    mistik bilgiler taşıyor. Kartları görmeden içgüdünle seç.
                  </p>
                  <Button
                    onClick={handleStartSelection}
                    disabled={cardsLoading}
                    className="px-8 py-3 bg-gradient-to-r from-secondary to-accent text-secondary-foreground font-semibold rounded-full pulse-glow"
                    data-testid="button-start-selection"
                  >
                    {cardsLoading ? <LoadingSpinner size="sm" /> : <>
                      <Sparkles className="mr-2 w-4 h-4" />
                      Kart Seçimine Başla
                    </>}
                  </Button>
                </div>
              </div>
            )}

            {/* Hidden Card Selection Grid */}
            {cardSelectionStep === 'selecting' && cardsData?.cards && (
              <div className="mb-8">
                <div className="text-center mb-6">
                  <p className="text-lg text-primary mb-2">
                    Seçilen kartlar: {selectedCards.length}/3
                  </p>
                  <p className="text-muted-foreground">
                    İçgüdünle hareket et, kartların gizemi seni yönlendirsin
                  </p>
                </div>
                
                <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4 mb-6">
                  {cardsData.cards.map((card: string, index: number) => {
                    const isSelected = selectedCards.some(c => c.index === index);
                    return (
                      <Button
                        key={index}
                        onClick={() => handleCardClick(card, index)}
                        variant="ghost"
                        className={`
                          h-32 w-full card-gradient rounded-lg transition-all duration-300 hover-lift relative
                          ${isSelected 
                            ? 'border-secondary bg-secondary/20 pulse-glow' 
                            : 'border-border hover:border-secondary/50'
                          }
                        `}
                        data-testid={`card-option-${index}`}
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">
                            {isSelected ? '✨' : '🔮'}
                          </div>
                          <p className="text-xs text-card-foreground">
                            {isSelected ? 'Seçildi' : 'Gizli Kart'}
                          </p>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleRevealCards}
                    disabled={selectedCards.length !== 3}
                    className="px-8 py-3 bg-gradient-to-r from-secondary to-accent text-secondary-foreground font-semibold rounded-full"
                    data-testid="button-reveal-cards"
                  >
                    <Eye className="mr-2 w-4 h-4" />
                    Kartları Açığa Çıkar
                  </Button>
                </div>
              </div>
            )}

            {/* Card Revealing Animation */}
            {cardSelectionStep === 'revealing' && (
              <div className="text-center mb-8">
                <div className="glass-effect rounded-lg p-8">
                  <div className="text-4xl mb-4 pulse-glow">🌟</div>
                  <p className="text-lg text-primary-foreground">
                    Kartların gizemi açığa çıkıyor...
                  </p>
                  <LoadingSpinner size="lg" className="mt-4" />
                </div>
              </div>
            )}

            {/* Revealed Cards Display */}
            {cardSelectionStep === 'completed' && selectedCards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {selectedCards.map((selectedCard, position) => {
                  const positions = ['Geçmiş', 'Şimdi', 'Gelecek'];
                  const icons = ['🌙', '⭐', '🔆'];
                  
                  return (
                    <div key={position} className="text-center">
                      <Card className="w-32 h-44 card-gradient mx-auto mb-3 flex items-center justify-center text-3xl hover-lift pulse-glow">
                        <CardContent className="p-0">
                          {icons[position]}
                        </CardContent>
                      </Card>
                      <h4 className="font-semibold text-lg text-primary mb-1" data-testid={`position-${position}`}>
                        {positions[position]}
                      </h4>
                      <p className="text-sm text-foreground font-medium" data-testid={`card-${position}`}>
                        {selectedCard.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Interpretation Button */}
            {cardSelectionStep === 'completed' && !interpretation && (
              <div className="text-center mb-8">
                <Button
                  onClick={handleInterpret}
                  disabled={interpretMutation.isPending}
                  className="px-8 py-3 bg-gradient-to-r from-secondary to-accent text-secondary-foreground font-semibold rounded-full pulse-glow"
                  data-testid="button-interpret"
                >
                  {interpretMutation.isPending ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Sparkles className="mr-2 w-4 h-4" />
                      Falını Yorumla
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* AI Interpretation Display */}
            {interpretation && (
              <Card className="glass-effect p-6 mb-8">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-2 pulse-glow" />
                    <span className="text-sm text-popover-foreground">AI Yorumcu</span>
                  </div>
                  <div 
                    className="text-popover-foreground leading-relaxed whitespace-pre-line"
                    data-testid="interpretation-text"
                  >
                    {interpretation}
                  </div>
                  <div className="flex justify-between mt-6">
                    <Button
                      variant="outline"
                      onClick={resetReading}
                      data-testid="button-new-reading"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
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