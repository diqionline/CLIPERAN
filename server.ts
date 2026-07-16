import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Lazy-loaded GoogleGenAI client helper
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured. Please add your key in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: "50mb" })); // Support large frame payloads

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Cliperan Express Backend is running!" });
  });

  // AI Video Scene Analysis Endpoint
  app.post("/api/analyze-video", async (req, res) => {
    try {
      const { frames, duration, description, category } = req.body;

      if (!frames || !Array.isArray(frames) || frames.length === 0) {
        return res.status(400).json({
          error: "No video frames provided for analysis.",
        });
      }

      const activeCategory = category || "Umum";

      // Check if API key is present, if not, provide a beautiful Indonesian mock fallback
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("GEMINI_API_KEY not configured. Returning rich mock response with custom category and subtitles.");
        // Mock analysis tailored to the optional description or generic exciting scene
        const mockStart = Math.min(2, Math.max(0, duration * 0.15));
        const mockEnd = Math.min(duration, mockStart + Math.min(25, duration * 0.6));
        
        // Define mock subtitles based on category
        let mockSubtitles = [
          { id: "sub-1", text: "Wah, perhatiin bagian ini baik-baik! ✨", start: parseFloat((mockStart + 1).toFixed(1)), end: parseFloat((mockStart + 4).toFixed(1)) },
          { id: "sub-2", text: "Momen terbaik yang paling ditunggu-tunggu! 🔥", start: parseFloat((mockStart + 5).toFixed(1)), end: parseFloat((mockStart + 9).toFixed(1)) },
          { id: "sub-3", text: "Jangan lupa share & tag teman kalian ya! 👇", start: parseFloat((mockStart + 10).toFixed(1)), end: parseFloat((mockStart + 13).toFixed(1)) }
        ];

        const catLower = activeCategory.toLowerCase();
        if (catLower.includes("lucu") || catLower.includes("kocak") || catLower.includes("humor")) {
          mockSubtitles = [
            { id: "sub-1", text: "Hahaha, perhatiin ekspresi mukanya! 😂", start: parseFloat((mockStart + 1).toFixed(1)), end: parseFloat((mockStart + 4).toFixed(1)) },
            { id: "sub-2", text: "Detik-detik sebelum kejadian kocak ini dimulai... 💀", start: parseFloat((mockStart + 5).toFixed(1)), end: parseFloat((mockStart + 8).toFixed(1)) },
            { id: "sub-3", text: "Nggak kuat nahan tawa di bagian ini! 😭💥", start: parseFloat((mockStart + 9).toFixed(1)), end: parseFloat((mockStart + 13).toFixed(1)) }
          ];
        } else if (catLower.includes("baper") || catLower.includes("romantis") || catLower.includes("sedih")) {
          mockSubtitles = [
            { id: "sub-1", text: "Duh, tatapannya bikin baper maksimal... ❤️", start: parseFloat((mockStart + 1).toFixed(1)), end: parseFloat((mockStart + 4).toFixed(1)) },
            { id: "sub-2", text: "Siapa sih yang naruh bawang di sini? 🥺😭", start: parseFloat((mockStart + 5).toFixed(1)), end: parseFloat((mockStart + 8).toFixed(1)) },
            { id: "sub-3", text: "Momen termanis yang pengen diputar terus! ✨", start: parseFloat((mockStart + 9).toFixed(1)), end: parseFloat((mockStart + 13).toFixed(1)) }
          ];
        } else if (catLower.includes("seram") || catLower.includes("mencekam") || catLower.includes("takut")) {
          mockSubtitles = [
            { id: "sub-1", text: "Suasana mulai mencekam... Merinding banget! 😱", start: parseFloat((mockStart + 1).toFixed(1)), end: parseFloat((mockStart + 4).toFixed(1)) },
            { id: "sub-2", text: "JANGAN LIHAT KE BELAKANG! 💀🕷️", start: parseFloat((mockStart + 5).toFixed(1)), end: parseFloat((mockStart + 8).toFixed(1)) },
            { id: "sub-3", text: "Siap-siap kaget dalam 3... 2... 1... 💥", start: parseFloat((mockStart + 9).toFixed(1)), end: parseFloat((mockStart + 13).toFixed(1)) }
          ];
        } else if (catLower.includes("aksi") || catLower.includes("keren") || catLower.includes("gaming")) {
          mockSubtitles = [
            { id: "sub-1", text: "Lihat gerakan super presisi dan gokil ini! ⚡", start: parseFloat((mockStart + 1).toFixed(1)), end: parseFloat((mockStart + 4).toFixed(1)) },
            { id: "sub-2", text: "Transisi visualnya luar biasa estetik! 🎥🔥", start: parseFloat((mockStart + 5).toFixed(1)), end: parseFloat((mockStart + 8).toFixed(1)) },
            { id: "sub-3", text: "Skill tingkat dewa yang wajib di-share! 🏆", start: parseFloat((mockStart + 9).toFixed(1)), end: parseFloat((mockStart + 13).toFixed(1)) }
          ];
        }

        return res.json({
          recommendedStart: parseFloat(mockStart.toFixed(1)),
          recommendedEnd: parseFloat(mockEnd.toFixed(1)),
          title: description ? `Adegan: ${description}` : `${activeCategory} (Rekomendasi AI)`,
          reason: `Analisis AI berhasil mendeteksi segmen kategori "${activeCategory}" yang paling menonjol. Perpaduan gerakan dinamis, fokus adegan yang kuat, dan transisi dramatis di segmen ini sangat ideal untuk langsung menarik audiens media sosial dalam 3 detik pertama.`,
          viralScore: 94,
          suggestedCaption: `🔥 Momen terbaik kategori [${activeCategory}]! Bagian mana yang menurut kalian paling gokil? Komen di bawah! 👇\n\n#${catLower.replace(/\s+/g, "")} #videocut #cliperan #bestmoment #fyp #viral #indonesia`,
          subtitles: mockSubtitles,
          isMock: true,
        });
      }

      const ai = getGeminiClient();

      // Formulate the content parts for Gemini
      // Each frame is an object: { base64: string, timestamp: number }
      const promptText = `
        Tugas Anda adalah menganalisis snapshot frame dari video berikut untuk mendeteksi adegan yang PALING MENCOCOKI kategori "${activeCategory}" untuk dijadikan klip pendek (maksimal 30 detik).
        
        Kategori pencarian yang diminta pengguna: "${activeCategory}".
        Total durasi video asli adalah ${duration} detik.
        Deskripsi video dari pengguna: "${description || "Tidak ada deskripsi tambahan"}".

        Berikut adalah beberapa frame kunci beserta timestamp-nya. Analisis perubahan visual, pergerakan, emosi wajah, atau fokus objek:
        ${frames.map((f: any, idx: number) => `Frame ${idx + 1}: Timestamp ${f.timestamp}s`).join("\n")}

        Silakan tentukan interval waktu (mulai dan selesai) terbaik yang berdurasi MAKSIMAL 30 detik untuk dipotong sebagai klip media sosial (seperti TikTok, Reels, atau Shorts).
        Selain itu, buatlah minimal 2 hingga 4 teks otomatis (subtitle) Bahasa Indonesia yang sangat serasi, lucu, ekspresif, atau dramatis yang cocok ditempatkan pada rentang waktu klip tersebut berdasarkan kategori "${activeCategory}".

        Berikan keluaran dalam format JSON terstruktur yang berisi:
        1. recommendedStart: angka detik mulai klip (harus berada di antara 0 dan ${duration})
        2. recommendedEnd: angka detik selesai klip (harus lebih besar dari recommendedStart, durasi maksimal 30 detik)
        3. title: Judul singkat adegan menarik tersebut (dalam Bahasa Indonesia)
        4. reason: Penjelasan mendalam mengapa adegan ini menarik secara visual untuk media sosial berdasarkan kategori "${activeCategory}" (dalam Bahasa Indonesia)
        5. viralScore: Angka perkiraan potensi viral dari 0 sampai 100
        6. suggestedCaption: Rekomendasi caption viral yang menarik beserta hashtag relevan untuk postingan media sosial (dalam Bahasa Indonesia)
        7. subtitles: Array berisi teks otomatis (subtitle) yang ditempelkan di atas video. Setiap subtitle harus memiliki:
           - id: string unik (misal "sub-1", "sub-2")
           - text: kalimat teks pendek, ekspresif, gaul, trendi, dan sarat emoji sesuai kategori "${activeCategory}" (maksimal 8 kata per subtitle)
           - start: detik kapan teks mulai muncul (harus berada di antara recommendedStart dan recommendedEnd)
           - end: detik kapan teks selesai muncul (harus lebih besar dari start dan kurang dari atau sama dengan recommendedEnd)
      `;

      // Build the parts array: first the prompt, then each image
      const parts: any[] = [{ text: promptText }];

      // Convert frame base64 strings to inlineData parts for Gemini
      frames.forEach((frame: any, idx: number) => {
        if (frame.base64) {
          // Remove potential header data:image/jpeg;base64,
          const base64Data = frame.base64.replace(/^data:image\/\w+;base64,/, "");
          parts.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          });
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedStart: {
                type: Type.NUMBER,
                description: "The recommended start timestamp in seconds.",
              },
              recommendedEnd: {
                type: Type.NUMBER,
                description: "The recommended end timestamp in seconds.",
              },
              title: {
                type: Type.STRING,
                description: "Title of the highlighted clip.",
              },
              reason: {
                type: Type.STRING,
                description: "Reasoning in Indonesian why this clip was chosen.",
              },
              viralScore: {
                type: Type.NUMBER,
                description: "Estimated virality rating from 0 to 100.",
              },
              suggestedCaption: {
                type: Type.STRING,
                description: "A viral caption with hashtags in Indonesian.",
              },
              subtitles: {
                type: Type.ARRAY,
                description: "List of auto-generated subtitle overlays.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    text: { type: Type.STRING, description: "Short expressive caption with emoticons in Indonesian." },
                    start: { type: Type.NUMBER, description: "Start time of subtitle in seconds." },
                    end: { type: Type.NUMBER, description: "End time of subtitle in seconds." },
                  },
                  required: ["id", "text", "start", "end"],
                },
              },
            },
            required: ["recommendedStart", "recommendedEnd", "title", "reason", "viralScore", "suggestedCaption", "subtitles"],
          },
        },
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response received from Gemini.");
      }

      const resultJson = JSON.parse(resultText.trim());
      res.json({
        ...resultJson,
        isMock: false,
      });

    } catch (error: any) {
      console.error("Error analyzing video frames:", error);
      res.status(500).json({
        error: error.message || "Gagal menganalisis video dengan AI.",
      });
    }
  });

  // AI Post Caption Generator Endpoint
  app.post("/api/generate-caption", async (req, res) => {
    try {
      const { title, reason, platform, duration } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          caption: `✨ Kliperan AI Highlight: ${title || "Momen Seru"}! ✨\n\n${reason || "Adegan menarik berdurasi " + duration + " detik."}\n\nCocok banget buat di-share ke ${platform || "media sosial"}! Bagaimana menurut kalian? 🤔👇\n\n#cliperan #videoeditor #highlight #ai #viral #fyp #${(platform || "social").toLowerCase()}`,
        });
      }

      const ai = getGeminiClient();

      const prompt = `
        Buatlah sebuah caption media sosial yang sangat menarik, interaktif, dan berpotensi viral untuk platform ${platform || "umum (Instagram/TikTok/Shorts)"}.
        Detail video klip:
        - Judul klip: "${title || "Momen Spesial"}"
        - Durasi klip: ${duration || 15} detik
        - Alasan menarik: "${reason || "Visual yang estetik dan aksi memukau"}"

        Aturan penulisan caption:
        1. Gunakan Bahasa Indonesia yang kasual, trendi, dan menarik (gunakan emoji yang sesuai).
        2. Berikan "Call to Action" (ajakan bertindak) agar penonton berkomentar atau membagikan video.
        3. Tambahkan 5-8 hashtag populer yang sangat relevan dengan video dan platform tersebut.
        4. Sesuaikan tone gaya penulisan dengan platform:
           - TikTok: Sangat santai, pendek, hook kuat di awal, menggunakan bahasa gaul.
           - Instagram Reels: Estetis, inspiratif atau menghibur, rapi.
           - YouTube Shorts: Ringkas, informatif, dan mengundang klik.

        Kembalikan hanya teks caption-nya saja langsung siap pakai.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({
        caption: response.text?.trim() || "",
      });

    } catch (error: any) {
      console.error("Error generating caption:", error);
      res.status(500).json({
        error: error.message || "Gagal membuat caption otomatis.",
      });
    }
  });

  // Serve static client files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Cliperan backend server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
