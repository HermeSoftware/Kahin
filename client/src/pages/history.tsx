import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { FloatingElements } from "@/components/floating-elements";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FORTUNE_TYPES } from "@/lib/constants";
import { 
  Heart, 
  Coffee, 
  Sun, 
  Moon, 
  Trash, 
  ArrowRight, 
  Sparkles, 
  Camera, 
  Calendar, 
  Brain 
} from "lucide-react";

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tümü' },
  { value: FORTUNE_TYPES.TAROT, label: 'Tarot' },
  { value: FORTUNE_TYPES.COFFEE, label: 'Kahve' },
  { value: FORTUNE_TYPES.HOROSCOPE, label: 'Burç' },
  { value: FORTUNE_TYPES.DREAM, label: 'Rüya' }
];

const fortuneIcons = {
  [FORTUNE_TYPES.TAROT]: Heart,
  [FORTUNE_TYPES.COFFEE]: Coffee,
  [FORTUNE_TYPES.HOROSCOPE]: Sun,
  [FORTUNE_TYPES.DREAM]: Moon
};

const fortuneGradients = {
  [FORTUNE_TYPES.TAROT]: 'from-primary to-secondary',
  [FORTUNE_TYPES.COFFEE]: 'from-accent to-primary',
  [FORTUNE_TYPES.HOROSCOPE]: 'from-secondary to-accent',
  [FORTUNE_TYPES.DREAM]: 'from-primary to-accent'
};

const fortuneBadges = {
  [FORTUNE_TYPES.TAROT]: { icon: Sparkles, text: 'AI Yorumu' },
  [FORTUNE_TYPES.COFFEE]: { icon: Camera, text: 'Görsel Analiz' },
  [FORTUNE_TYPES.HOROSCOPE]: { icon: Calendar, text: 'Günlük Yorum' },
  [FORTUNE_TYPES.DREAM]: { icon: Brain, text: 'Derin Analiz' }
};

export default function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch fortunes history
  const { data: fortunesData, isLoading } = useQuery({
    queryKey: ['/api/fortunes', activeFilter === 'all' ? undefined : activeFilter],
    queryFn: async () => {
      const url = activeFilter === 'all' ? '/api/fortunes' : `/api/fortunes?type=${activeFilter}`;
      const response = await fetch(url, { credentials: 'include' });
      if (!response.ok) throw new Error('Fal geçmişi alınamadı');
      return response.json();
    }
  });

  // Delete fortune mutation
  const deleteMutation = useMutation({
    mutationFn: async (fortuneId: string) => {
      const response = await apiRequest('DELETE', `/api/fortunes/${fortuneId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/fortunes'] });
      toast({
        title: "Fal Silindi",
        description: "Fal başarıyla kaldırıldı",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Fal silinemedi",
        variant: "destructive",
      });
    }
  });

  const handleDelete = (fortuneId: string) => {
    deleteMutation.mutate(fortuneId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <FloatingElements />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-shadow mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Geçmiş Fallarım
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Daha önce baktırdığın falları tekrar incele ve gelişimini takip et
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {FILTER_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={activeFilter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(option.value)}
                  data-testid={`filter-${option.value}`}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Loading State */}
            {isLoading && (
              <LoadingSpinner size="lg" text="Fal geçmişi yükleniyor..." />
            )}

            {/* Empty State */}
            {!isLoading && (!fortunesData?.fortunes || fortunesData.fortunes.length === 0) && (
              <Card className="glass-effect p-12 text-center">
                <CardContent className="p-0">
                  <Moon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Henüz fal bakılmamış</h3>
                  <p className="text-muted-foreground">
                    İlk falına bakarak mistik dünyaya adım at!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Fortune History List */}
            {fortunesData?.fortunes && fortunesData.fortunes.length > 0 && (
              <div className="space-y-4">
                {fortunesData.fortunes.map((fortune: any) => {
                  const Icon = fortuneIcons[fortune.type as keyof typeof fortuneIcons];
                  const gradient = fortuneGradients[fortune.type as keyof typeof fortuneGradients];
                  const badge = fortuneBadges[fortune.type as keyof typeof fortuneBadges];
                  
                  return (
                    <Card
                      key={fortune.id}
                      className="glass-effect p-6 hover:bg-muted/30 transition-colors cursor-pointer"
                      data-testid={`fortune-${fortune.id}`}
                    >
                      <CardContent className="p-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mr-3`}>
                              <Icon className="text-primary-foreground w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold" data-testid={`fortune-title-${fortune.id}`}>
                                {fortune.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {fortune.createdAt ? formatDate(fortune.createdAt) : 'Tarih bilinmiyor'}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(fortune.id)}
                            disabled={deleteMutation.isPending}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            data-testid={`button-delete-${fortune.id}`}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {truncateText(fortune.content)}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs font-medium">
                            <badge.icon className="w-3 h-3 mr-1" />
                            <span>{badge.text}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80 transition-colors"
                            data-testid={`button-view-${fortune.id}`}
                          >
                            Detayları Gör <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Load More Button (for future pagination) */}
            {fortunesData?.fortunes && fortunesData.fortunes.length >= 10 && (
              <div className="text-center mt-8">
                <Button variant="outline" data-testid="button-load-more">
                  Daha Fazla Göster
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
