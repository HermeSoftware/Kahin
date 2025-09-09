import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFortuneSchema, FORTUNE_TYPES, ZODIAC_SIGNS } from "@shared/schema";
import { 
  interpretTarotReading, 
  analyzeCoffeeImage, 
  generateDailyHoroscope, 
  interpretDream 
} from "./services/gemini";
import multer from 'multer';
import type { Request } from 'express';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Tarot cards data - 20 cards
  const TAROT_CARDS = [
    "Budala", "Büyücü", "Yüksek Rahibe", "İmparatoriçe", "İmparator", 
    "Hierophant", "Aşıklar", "Araba", "Güç", "Ermit", "Kader Çarkı", 
    "Adalet", "Asılan Adam", "Ölüm", "Ölçülülük", "Şeytan", "Kule", 
    "Yıldız", "Ay", "Güneş"
  ];

  // Get all tarot cards for selection
  app.get("/api/tarot/cards", (req, res) => {
    res.json({ cards: TAROT_CARDS });
  });

  // Get random tarot cards (legacy endpoint)
  app.get("/api/tarot/cards/random", (req, res) => {
    const shuffled = [...TAROT_CARDS].sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 3);
    res.json({ cards: selectedCards });
  });

  // Interpret tarot reading
  app.post("/api/tarot/interpret", async (req, res) => {
    try {
      const { cards, userId } = req.body;
      
      if (!cards || cards.length !== 3) {
        return res.status(400).json({ error: "3 kart seçilmelidir" });
      }

      const interpretation = await interpretTarotReading(cards);
      
      // Save fortune to storage
      if (userId) {
        await storage.createFortune({
          userId,
          type: FORTUNE_TYPES.TAROT,
          title: `Tarot Falı - ${cards.join(', ')}`,
          content: interpretation,
          data: { cards }
        });
      }

      res.json({ interpretation, cards });
    } catch (error) {
      console.error('Tarot interpretation error:', error);
      res.status(500).json({ error: "Tarot yorumu oluşturulamadı" });
    }
  });

  // Coffee fortune image analysis
  app.post("/api/coffee/analyze", upload.single('image'), async (req: MulterRequest, res) => {
    try {
      const { userId } = req.body;
      
      if (!req.file) {
        return res.status(400).json({ error: "Fotoğraf yüklenmedi" });
      }

      const base64Image = req.file.buffer.toString('base64');
      const interpretation = await analyzeCoffeeImage(base64Image);
      
      // Save fortune to storage
      if (userId) {
        await storage.createFortune({
          userId,
          type: FORTUNE_TYPES.COFFEE,
          title: "Kahve Falı",
          content: interpretation,
          data: { imageSize: req.file.size, imageType: req.file.mimetype }
        });
      }

      res.json({ interpretation });
    } catch (error) {
      console.error('Coffee analysis error:', error);
      res.status(500).json({ error: "Kahve falı yorumu oluşturulamadı" });
    }
  });

  // Get zodiac signs
  app.get("/api/horoscope/signs", (req, res) => {
    res.json({ signs: ZODIAC_SIGNS });
  });

  // Generate daily horoscope
  app.post("/api/horoscope/daily", async (req, res) => {
    try {
      const { zodiacSign, userId } = req.body;
      
      if (!zodiacSign) {
        return res.status(400).json({ error: "Burç seçilmelidir" });
      }

      const interpretation = await generateDailyHoroscope(zodiacSign);
      
      // Save fortune to storage
      if (userId) {
        await storage.createFortune({
          userId,
          type: FORTUNE_TYPES.HOROSCOPE,
          title: `Günlük ${zodiacSign} Yorumu`,
          content: interpretation,
          data: { zodiacSign, date: new Date().toISOString().split('T')[0] }
        });
      }

      res.json({ interpretation, zodiacSign });
    } catch (error) {
      console.error('Horoscope generation error:', error);
      res.status(500).json({ error: "Burç yorumu oluşturulamadı" });
    }
  });

  // Dream interpretation
  app.post("/api/dreams/interpret", async (req, res) => {
    try {
      const { dreamDescription, emotion, userId } = req.body;
      
      if (!dreamDescription) {
        return res.status(400).json({ error: "Rüya açıklaması girilmelidir" });
      }

      const interpretation = await interpretDream(dreamDescription, emotion);
      
      // Save fortune to storage
      if (userId) {
        await storage.createFortune({
          userId,
          type: FORTUNE_TYPES.DREAM,
          title: "Rüya Tabiri",
          content: interpretation,
          data: { dreamDescription, emotion }
        });
      }

      res.json({ interpretation });
    } catch (error) {
      console.error('Dream interpretation error:', error);
      res.status(500).json({ error: "Rüya yorumu oluşturulamadı" });
    }
  });

  // Get fortunes history
  app.get("/api/fortunes", async (req, res) => {
    try {
      const { userId, type } = req.query;
      const fortunes = await storage.getFortunes(userId as string);
      
      let filteredFortunes = fortunes;
      if (type && type !== 'all') {
        filteredFortunes = fortunes.filter(f => f.type === type);
      }
      
      res.json({ fortunes: filteredFortunes });
    } catch (error) {
      console.error('Get fortunes error:', error);
      res.status(500).json({ error: "Fal geçmişi alınamadı" });
    }
  });

  // Get single fortune
  app.get("/api/fortunes/:id", async (req, res) => {
    try {
      const fortune = await storage.getFortune(req.params.id);
      if (!fortune) {
        return res.status(404).json({ error: "Fal bulunamadı" });
      }
      res.json({ fortune });
    } catch (error) {
      console.error('Get fortune error:', error);
      res.status(500).json({ error: "Fal detayları alınamadı" });
    }
  });

  // Delete fortune
  app.delete("/api/fortunes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFortune(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Fal bulunamadı" });
      }
      res.json({ message: "Fal silindi" });
    } catch (error) {
      console.error('Delete fortune error:', error);
      res.status(500).json({ error: "Fal silinemedi" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
