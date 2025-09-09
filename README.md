# FalBakicisi - AI-Powered Fortune Telling App 🔮

Modern web teknolojileri ile geliştirilmiş, yapay zeka destekli fal uygulaması. Tarot, kahve falı, burç yorumu ve rüya tabiri özelliklerini içerir.

## 🚀 Özellikler

- **Tarot Falı**: 20 farklı kart ile detaylı yorumlar
- **Kahve Falı**: Fotoğraf yükleyerek AI ile analiz
- **Burç Yorumu**: 12 burç için günlük yorumlar
- **Rüya Tabiri**: Rüya açıklamalarına göre yorumlar
- **Geçmiş Kayıtları**: Tüm fal geçmişini görüntüleme

## 🛠️ Teknolojiler

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Neon)
- **AI**: Google Gemini API
- **UI**: Tailwind CSS + Radix UI
- **ORM**: Drizzle ORM

## 📦 Kurulum

### Gereksinimler
- Node.js 18+
- PostgreSQL veritabanı
- Google Gemini API anahtarı

### Adımlar

1. **Projeyi klonla**
```bash
git clone <repo-url>
cd FalBakicisi
```

2. **Bağımlılıkları yükle**
```bash
npm install
cd client && npm install
```

3. **Environment variables ayarla**
```bash
cp env.example .env
```

`.env` dosyasını düzenle:
```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=development
```

4. **Veritabanını kur**
```bash
npm run db:push
```

5. **Geliştirme sunucusunu başlat**
```bash
npm run dev
```

## 🌐 Vercel'de Yayınlama

### 1. Vercel Hesabı
- [vercel.com](https://vercel.com) adresine git
- GitHub hesabınla giriş yap

### 2. Projeyi İmport Et
- "New Project" butonuna tıkla
- GitHub repo'nu seç
- "Import" butonuna tıkla

### 3. Environment Variables Ayarla
Vercel dashboard'da:
- Settings > Environment Variables
- Şu değişkenleri ekle:
  - `GEMINI_API_KEY`: Google Gemini API anahtarın
  - `DATABASE_URL`: PostgreSQL connection string'in
  - `NODE_ENV`: `production`

### 4. Veritabanı Kurulumu
**Neon (Önerilen):**
1. [neon.tech](https://neon.tech) hesap oluştur
2. Yeni database oluştur
3. Connection string'i kopyala
4. Vercel'e `DATABASE_URL` olarak ekle

**Vercel Postgres:**
1. Vercel dashboard'da Storage > Create Database
2. Postgres seç
3. Database oluştur
4. Connection string otomatik eklenir

### 5. Deploy
- "Deploy" butonuna tıkla
- Build işlemi tamamlanana kadar bekle
- URL'ni al ve test et!

## 🔧 API Endpoints

- `GET /api/tarot/cards` - Tarot kartlarını listele
- `POST /api/tarot/interpret` - Tarot yorumu yap
- `POST /api/coffee/analyze` - Kahve falı analizi
- `GET /api/horoscope/signs` - Burç listesi
- `POST /api/horoscope/daily` - Günlük burç yorumu
- `POST /api/dreams/interpret` - Rüya tabiri
- `GET /api/fortunes` - Fal geçmişi
- `DELETE /api/fortunes/:id` - Fal sil

## 📱 Kullanım

1. Ana sayfada fal türünü seç
2. Gerekli bilgileri gir (kart seçimi, fotoğraf, burç, rüya)
3. AI yorumunu bekle
4. Sonucu görüntüle ve kaydet
5. Geçmiş sekmesinden eski falları görüntüle

## 🎨 UI Bileşenleri

- Modern ve responsive tasarım
- Dark/Light mode desteği
- Animasyonlu geçişler
- Mobil uyumlu arayüz
- Accessibility standartları

## 🔒 Güvenlik

- API anahtarları environment variables'da
- File upload güvenliği (5MB limit)
- Input validation (Zod)
- CORS koruması

## 📈 Performans

- Vite ile hızlı build
- React Query ile cache
- Lazy loading
- Image optimization
- CDN desteği (Vercel)

## 🤝 Katkıda Bulunma

1. Fork yap
2. Feature branch oluştur (`git checkout -b feature/amazing-feature`)
3. Commit yap (`git commit -m 'Add amazing feature'`)
4. Push yap (`git push origin feature/amazing-feature`)
5. Pull Request oluştur

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bak.

## 🆘 Destek

Sorun yaşıyorsan:
1. GitHub Issues'da sorun bildir
2. Documentation'ı kontrol et
3. Community'den yardım iste

---

**Not**: Bu uygulama eğlence amaçlıdır. Ciddi kararlar için profesyonel danışmanlık alın.
