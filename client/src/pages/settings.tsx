import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FloatingElements } from "@/components/floating-elements";
import { useToast } from "@/hooks/use-toast";
import { ZODIAC_SIGNS } from "@/lib/constants";
import { 
  Bell, 
  User, 
  Palette, 
  Globe, 
  Shield, 
  Info, 
  Share2,
  Moon,
  Sun
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [dailyHoroscope, setDailyHoroscope] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('tr');
  const [zodiacSign, setZodiacSign] = useState('');
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "Ayarlar Kaydedildi",
      description: "Tercihleriniz başarıyla güncellendi",
    });
  };

  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Kahin - Mistik Fal Uygulaması',
        text: 'AI destekli mistik yorumlarla geleceğini keşfet!',
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast({
        title: "Link Kopyalandı",
        description: "Uygulama linki panoya kopyalandı",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <FloatingElements />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-shadow mb-4">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ayarlar
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uygulama tercihlerini düzenle ve kişiselleştir
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Settings */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 w-5 h-5" />
                  Profil Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="zodiac-select" className="text-sm font-medium mb-2 block">
                    Burç Seçimi
                  </Label>
                  <Select value={zodiacSign} onValueChange={setZodiacSign}>
                    <SelectTrigger data-testid="select-zodiac-sign">
                      <SelectValue placeholder="Burcunu seç" />
                    </SelectTrigger>
                    <SelectContent>
                      {ZODIAC_SIGNS.map((sign) => (
                        <SelectItem key={sign.name} value={sign.name}>
                          <span className="flex items-center">
                            <span className="mr-2">{sign.symbol}</span>
                            {sign.name} ({sign.dates})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Günlük burç yorumları için kullanılacak
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 w-5 h-5" />
                  Bildirim Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Bildirimleri Aç</Label>
                    <p className="text-xs text-muted-foreground">
                      Genel bildirimler ve güncellemeler
                    </p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    data-testid="switch-notifications"
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-horoscope">Günlük Burç Yorumları</Label>
                    <p className="text-xs text-muted-foreground">
                      Her sabah günlük burç yorumun hazır
                    </p>
                  </div>
                  <Switch
                    id="daily-horoscope"
                    checked={dailyHoroscope}
                    onCheckedChange={setDailyHoroscope}
                    disabled={!notifications}
                    data-testid="switch-daily-horoscope"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 w-5 h-5" />
                  Görünüm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme-select" className="text-sm font-medium mb-2 block">
                    Tema
                  </Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger data-testid="select-theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dark">
                        <span className="flex items-center">
                          <Moon className="mr-2 w-4 h-4" />
                          Koyu Tema
                        </span>
                      </SelectItem>
                      <SelectItem value="light">
                        <span className="flex items-center">
                          <Sun className="mr-2 w-4 h-4" />
                          Açık Tema
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language-select" className="text-sm font-medium mb-2 block">
                    Dil
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tr">
                        <span className="flex items-center">
                          <Globe className="mr-2 w-4 h-4" />
                          Türkçe
                        </span>
                      </SelectItem>
                      <SelectItem value="en">
                        <span className="flex items-center">
                          <Globe className="mr-2 w-4 h-4" />
                          English
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* App Actions */}
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Uygulama</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleShareApp}
                  data-testid="button-share-app"
                >
                  <Share2 className="mr-2 w-4 h-4" />
                  Uygulamayı Paylaş
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  data-testid="button-about"
                >
                  <Info className="mr-2 w-4 h-4" />
                  Uygulama Hakkında
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  data-testid="button-privacy"
                >
                  <Shield className="mr-2 w-4 h-4" />
                  Gizlilik Politikası
                </Button>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Card className="glass-effect">
              <CardContent className="pt-6">
                <Button
                  onClick={handleSaveSettings}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold"
                  data-testid="button-save-settings"
                >
                  Ayarları Kaydet
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
