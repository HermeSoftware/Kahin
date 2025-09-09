import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export async function interpretTarotReading(cards: string[]): Promise<string> {
    const prompt = `Sen mistik bir tarot yorumcususun. Kullanıcının seçtiği kartlar şunlar: ${cards.join(', ')}. 

Bu üç kartın birleşimini dikkate alarak:
1. Geçmiş (1. kart): ${cards[0]}
2. Şimdi (2. kart): ${cards[1]}
3. Gelecek (3. kart): ${cards[2]}

Kullanıcının geçmişi, şimdiki durumu ve geleceği hakkında derin, bütüncül ve her seferinde özgün bir yorum yap. 
Yorumun umut verici ama gerçekçi olsun. Her kart için ayrı ayrı yorum yap, sonra genel bir değerlendirme ver.
Cevabını Türkçe ver ve samimi bir dille yaz.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text || "Tarot yorumu oluşturulamadı.";
}

export async function analyzeCoffeeImage(base64Image: string): Promise<string> {
    const contents = [
        {
            inlineData: {
                data: base64Image,
                mimeType: "image/jpeg",
            },
        },
        `Sen çok tecrübeli bir kahve falı yorumcususun. Sana yüklenen kahve fincanı fotoğrafındaki sembolleri, şekilleri ve yolları dikkatlice analiz et. 

Lütfen şu formatta yanıt ver:
1. TESPIT EDİLEN SEMBOLLER: Gördüğün sembolleri listele (örneğin: kuş, anahtar, dağ, yol, vs.)
2. FAL YORUMU: Bu sembollerin birleşimine dayanarak kullanıcının aşk, iş ve para durumu hakkında detaylı, kişisel ve özgün bir fal yorumu yap.

Yorumun pozitif ama gerçekçi olsun. Cevabını Türkçe ver.`,
    ];

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: contents,
    });

    return response.text || "Kahve falı yorumu oluşturulamadı.";
}

export async function generateDailyHoroscope(zodiacSign: string): Promise<string> {
    const today = new Date().toLocaleDateString('tr-TR');
    
    const prompt = `Sen uzman bir astrolog ve burç yorumcususun. ${zodiacSign} burcu için ${today} tarihli günlük burç yorumu hazırla.

Lütfen şu konuları içeren bir yorum yaz:
1. GENEL: Günün genel enerjisi ve yaklaşım
2. AŞK: İlişkiler ve romantik hayat
3. KARİYER: İş ve para durumu
4. SAĞLIK: Fiziksel ve mental sağlık

Her bölüm için 2-3 cümlelik öğüt ver. Yorumun motivasyonel ama gerçekçi olsun.
Sonunda günün şanslı sayısını (1-9 arası) belirt.
Cevabını Türkçe ver.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text || "Günlük burç yorumu oluşturulamadı.";
}

export async function interpretDream(dreamDescription: string, emotion?: string): Promise<string> {
    const prompt = `Sen uzman bir rüya tabirci ve psikologsun. Kullanıcının anlattığı rüyayı analiz et:

RÜYA: ${dreamDescription}
${emotion ? `DUYGU: ${emotion}` : ''}

Lütfen şu formatta yanıt ver:
1. RÜYANIN ANA TEMALARI: Önemli sembolleri ve temalarını listele
2. PSİKOLOJİK YORUMU: Rüyanın psikolojik anlamını açıkla
3. MİSTİK ANLAM: Rüyanın manevi ve sembolik anlamını değerlendir
4. TAVSİYELER: Bu rüyadan çıkarılacak dersler ve öneriler

Yorumun destekleyici ve içgörü verici olsun. Cevabını Türkçe ver.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
    });

    return response.text || "Rüya yorumu oluşturulamadı.";
}
