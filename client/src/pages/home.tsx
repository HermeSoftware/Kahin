import { FortuneCard } from "@/components/fortune-card";
import { FloatingElements } from "@/components/floating-elements";
import { Sparkles, Camera, Calendar, Brain } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center aurora">
        <FloatingElements />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black mb-6 relative">
              <div className="absolute inset-0 text-5xl md:text-7xl font-black blur-lg opacity-30">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Kahin'e
                </span>
              </div>
              <span className="relative bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Kahin'e
              </span>
              <br />
              <span className="text-2xl md:text-4xl font-medium text-foreground">Hoş Geldin</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              İçindeki sırları keşfetmeye hazır mısın? Yapay zeka destekli mistik yorumlarla geleceğini aydınlat.
            </p>
            <div className="flex justify-center space-x-4 text-accent">
              <Sparkles className="text-2xl floating-animation" />
              <div className="text-xl floating-animation" style={{ animationDelay: '0.5s' }}>🌙</div>
              <div className="text-lg floating-animation" style={{ animationDelay: '1s' }}>⭐</div>
            </div>
          </div>

          {/* Fortune Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <FortuneCard
              type="tarot"
              title="Tarot Falı"
              description="Üç kart seç, geleceğini keşfet"
              href="/tarot"
              badge="AI Destekli"
              badgeIcon={Sparkles}
            />
            
            <FortuneCard
              type="coffee"
              title="Kahve Falı"
              description="Fincan fotoğrafını yükle"
              href="/coffee"
              badge="Görsel Analiz"
              badgeIcon={Camera}
            />
            
            <FortuneCard
              type="horoscope"
              title="Günlük Yorum"
              description="Burcuna özel yorumlar"
              href="/horoscope"
              badge="Her Gün Yeni"
              badgeIcon={Calendar}
            />
            
            <FortuneCard
              type="dream"
              title="Rüya Tabiri"
              description="Rüyalarının anlamını keşfet"
              href="/dreams"
              badge="Derin Analiz"
              badgeIcon={Brain}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background/80 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center pulse-glow">
                <div className="text-primary-foreground text-lg">🌙</div>
              </div>
              <h3 className="text-xl font-bold text-shadow">Kahin</h3>
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-8">
              Yapay zeka destekli mistik yorumlarla iç dünyanı keşfet. 
              Her fal benzersiz, her yorum kişiye özel.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-8">
              <div className="text-center">
                <h4 className="font-semibold text-primary mb-2">Hızlı Erişim</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li><a href="/tarot" className="hover:text-primary transition-colors">Tarot Falı</a></li>
                  <li><a href="/coffee" className="hover:text-primary transition-colors">Kahve Falı</a></li>
                  <li><a href="/horoscope" className="hover:text-primary transition-colors">Günlük Yorum</a></li>
                  <li><a href="/dreams" className="hover:text-primary transition-colors">Rüya Tabiri</a></li>
                </ul>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-primary mb-2">Özellikler</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>AI Destekli Yorumlar</li>
                  <li>Görsel Analiz</li>
                  <li>Kişisel Geçmiş</li>
                  <li>Günlük Güncellemeler</li>
                </ul>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-primary mb-2">Destek</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Kullanım Kılavuzu</li>
                  <li>Sıkça Sorulanlar</li>
                  <li>İletişim</li>
                  <li>Gizlilik Politikası</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center w-full max-w-4xl">
              <div className="text-xs text-muted-foreground mb-2 md:mb-0">
                © 2024 Kahin. Tüm hakları saklıdır.
              </div>
              <div className="text-xs text-muted-foreground flex items-center">
                <span className="mr-1">Developed by</span>
                <span className="font-semibold text-secondary">Hermes Software</span>
                <div className="ml-2 text-accent">⚡</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
