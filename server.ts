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

        // Generate multiple mock scenes tailored to duration
        const scene1Start = parseFloat(mockStart.toFixed(1));
        const scene1End = parseFloat(mockEnd.toFixed(1));

        const scene2Start = parseFloat((duration * 0.45).toFixed(1));
        const scene2End = parseFloat(Math.min(duration, scene2Start + Math.min(18, duration * 0.3)).toFixed(1));

        const scene3Start = parseFloat((duration * 0.72).toFixed(1));
        const scene3End = parseFloat(Math.min(duration, scene3Start + Math.min(20, duration * 0.25)).toFixed(1));

        const scene4Start = parseFloat((duration * 0.05).toFixed(1));
        const scene4End = parseFloat(Math.min(duration, scene4Start + Math.min(15, duration * 0.15)).toFixed(1));

        // Generate scene details
        const mockScenes = [
          {
            id: "scene-1",
            title: description ? `Sorotan Utama: ${description}` : `Momen Terpanas Kategori ${activeCategory}`,
            start: scene1Start,
            end: scene1End,
            viralScore: 94,
            reason: `Klip ini memiliki retensi visual tertinggi berdasarkan kategori "${activeCategory}". Sangat dinamis dan pas untuk langsung menarik audiens dalam 3 detik pertama.`,
            suggestedCaption: `🔥 Bagian paling gokil kategori [${activeCategory}]! Gimana menurut kalian? 🤔👇\n\n#cliperan #fyp #viral #indonesia #highlight`,
            subtitles: mockSubtitles
          },
          {
            id: "scene-2",
            title: `Adegan Transisi Kece - ${activeCategory}`,
            start: scene2Start,
            end: scene2End,
            viralScore: 88,
            reason: `Transisi visual di detik ${scene2Start}s s/d ${scene2End}s menunjukkan perkembangan plot atau aksi yang rapi dengan intensitas warna yang menonjol.`,
            suggestedCaption: `⚡ Bagian kedua yang gak kalah estetik! Tag temen kalian yang suka scene kayak gini! ✨\n\n#cliperan #bestmoment #fyp #trend #editing`,
            subtitles: [
              { id: "scene2-sub-1", text: "Perhatiin transisi visualnya... Rapih banget! ⚡", start: parseFloat((scene2Start + 1).toFixed(1)), end: parseFloat((scene2Start + 4).toFixed(1)) },
              { id: "scene2-sub-2", text: "Kombinasi komposisi warna terbaik! 🎨🎬", start: parseFloat((scene2Start + 5).toFixed(1)), end: parseFloat((scene2Start + 9).toFixed(1)) }
            ]
          },
          {
            id: "scene-3",
            title: `Puncak Klimaks & Ending Dramatis`,
            start: scene3Start,
            end: scene3End,
            viralScore: 82,
            reason: `Momen klimaks di bagian akhir yang meninggalkan rasa penasaran tinggi (cliffhanger). Sempurna untuk memancing penonton menonton ulang.`,
            suggestedCaption: `😱 Plot twist di bagian akhir bener-bener gak disangka! Tonton sampai habis ya guys! 🔥\n\n#viralindo #plottwist #cliperan #klimaks #shorts`,
            subtitles: [
              { id: "scene3-sub-1", text: "DI SINI BAGIAN YANG PALING SERU! 😱🔥", start: parseFloat((scene3Start + 1).toFixed(1)), end: parseFloat((scene3Start + 4).toFixed(1)) },
              { id: "scene3-sub-2", text: "Duh, jadi penasaran kelanjutannya... 👇", start: parseFloat((scene3Start + 5).toFixed(1)), end: parseFloat((scene3Start + 8).toFixed(1)) }
            ]
          },
          {
            id: "scene-4",
            title: `Hook Kilat Pembuka (Intro FYP)`,
            start: scene4Start,
            end: scene4End,
            viralScore: 78,
            reason: `Klip pendek berdurasi kilat yang langsung menyajikan aksi awal yang cepat (Fast-paced Action). Sangat ideal sebagai teaser singkat atau snap story.`,
            suggestedCaption: `⚡ Teaser kilat penarik perhatian! Cuma butuh beberapa detik buat paham serunya! 😉\n\n#shorts #reel #teaser #videopendek #indonesia`,
            subtitles: [
              { id: "scene4-sub-1", text: "Awal adegan yang langsung bikin melotot! 👀", start: parseFloat((scene4Start + 1).toFixed(1)), end: parseFloat((scene4Start + 3).toFixed(1)) },
              { id: "scene4-sub-2", text: "Siap-siap tonton versi lengkapnya ya! 🚀", start: parseFloat((scene4Start + 4).toFixed(1)), end: parseFloat((scene4Start + 7).toFixed(1)) }
            ]
          }
        ];

        return res.json({
          recommendedStart: scene1Start,
          recommendedEnd: scene1End,
          title: description ? `Adegan: ${description}` : `${activeCategory} (Rekomendasi AI)`,
          reason: `Analisis AI berhasil mendeteksi segmen kategori "${activeCategory}" yang paling menonjol. Perpaduan gerakan dinamis, fokus adegan yang kuat, dan transisi dramatis di segmen ini sangat ideal untuk langsung menarik audiens media sosial dalam 3 detik pertama.`,
          viralScore: 94,
          suggestedCaption: `🔥 Momen terbaik kategori [${activeCategory}]! Bagian mana yang menurut kalian paling gokil? Komen di bawah! 👇\n\n#${catLower.replace(/\s+/g, "")} #videocut #cliperan #bestmoment #fyp #viral #indonesia`,
          subtitles: mockSubtitles,
          isMock: true,
          scenes: mockScenes
        });
      }

      const ai = getGeminiClient();

      // Formulate the content parts for Gemini
      // Each frame is an object: { base64: string, timestamp: number }
      const promptText = `
        Tugas Anda adalah menganalisis snapshot frame dari video berikut untuk mendeteksi adegan-adegan yang PALING MENCOCOKI kategori "${activeCategory}" untuk dijadikan klip pendek (maksimal 30 detik).
        
        Kategori pencarian yang diminta pengguna: "${activeCategory}".
        Total durasi video asli adalah ${duration} detik.
        Deskripsi video dari pengguna: "${description || "Tidak ada deskripsi tambahan"}".

        Berikut adalah beberapa frame kunci beserta timestamp-nya. Analisis perubahan visual, pergerakan, emosi wajah, atau fokus objek:
        ${frames.map((f: any, idx: number) => `Frame ${idx + 1}: Timestamp ${f.timestamp}s`).join("\n")}

        Silakan tentukan interval waktu (mulai dan selesai) terbaik yang berdurasi MAKSIMAL 30 detik untuk dipotong sebagai klip media sosial utama (seperti TikTok, Reels, atau Shorts).
        Selain itu, deteksi juga 3 hingga 4 segmen / adegan terbaik alternatif lainnya (scenes) dalam video ini yang memiliki skor potensi viral tinggi.
        Untuk masing-masing adegan tersebut, buatlah minimal 2 hingga 4 teks otomatis (subtitle) Bahasa Indonesia yang sangat serasi, lucu, ekspresif, atau dramatis yang cocok ditempatkan pada rentang waktu adegan tersebut berdasarkan kategori "${activeCategory}".

        Berikan keluaran dalam format JSON terstruktur yang berisi:
        1. recommendedStart: angka detik mulai klip utama (harus berada di antara 0 dan ${duration})
        2. recommendedEnd: angka detik selesai klip utama (harus lebih besar dari recommendedStart, durasi maksimal 30 detik)
        3. title: Judul singkat adegan menarik utama tersebut (dalam Bahasa Indonesia)
        4. reason: Penjelasan mendalam mengapa adegan ini menarik secara visual untuk media sosial berdasarkan kategori "${activeCategory}" (dalam Bahasa Indonesia)
        5. viralScore: Angka perkiraan potensi viral dari 0 sampai 100
        6. suggestedCaption: Rekomendasi caption viral yang menarik beserta hashtag relevan untuk postingan media sosial utama (dalam Bahasa Indonesia)
        7. subtitles: Array berisi teks otomatis (subtitle) yang ditempelkan di atas video untuk klip utama. Setiap subtitle harus memiliki:
           - id: string unik (misal "sub-1", "sub-2")
           - text: kalimat teks pendek, ekspresif, gaul, trendi, dan sarat emoji sesuai kategori "${activeCategory}" (maksimal 8 kata per subtitle)
           - start: detik kapan teks mulai muncul (harus berada di antara recommendedStart dan recommendedEnd)
           - end: detik kapan teks selesai muncul (harus lebih besar dari start dan kurang dari atau sama dengan recommendedEnd)
        8. scenes: Array berisi 3 hingga 4 adegan menarik lainnya yang ditemukan (candidate scenes). Setiap adegan harus memiliki:
           - id: string unik (misal "scene-1", "scene-2", dll.)
           - title: judul singkat adegan menarik tersebut (dalam Bahasa Indonesia)
           - start: detik mulai adegan (antara 0 dan ${duration})
           - end: detik selesai adegan (lebih besar dari start, durasi maksimal 30 detik)
           - viralScore: perkiraan potensi viral (0 - 100)
           - reason: alasan mengapa segmen adegan ini menarik (dalam Bahasa Indonesia)
           - suggestedCaption: saran caption viral dengan hashtag relevan (dalam Bahasa Indonesia)
           - subtitles: array berisi teks otomatis (subtitle) khusus untuk adegan ini, masing-masing memiliki id, text, start, dan end.
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
              scenes: {
                type: Type.ARRAY,
                description: "List of other interesting candidate scenes detected in the video.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING, description: "Scene title in Indonesian." },
                    start: { type: Type.NUMBER, description: "Start time of scene in seconds." },
                    end: { type: Type.NUMBER, description: "End time of scene in seconds (max 30s duration)." },
                    viralScore: { type: Type.NUMBER, description: "Estimated virality rating from 0 to 100." },
                    reason: { type: Type.STRING, description: "Short explanation in Indonesian why this scene is appealing." },
                    suggestedCaption: { type: Type.STRING, description: "Short caption with hashtags for this scene." },
                    subtitles: {
                      type: Type.ARRAY,
                      description: "Subtitles specifically for this scene.",
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          text: { type: Type.STRING },
                          start: { type: Type.NUMBER },
                          end: { type: Type.NUMBER },
                        },
                        required: ["id", "text", "start", "end"],
                      }
                    }
                  },
                  required: ["id", "title", "start", "end", "viralScore", "reason", "suggestedCaption", "subtitles"]
                }
              }
            },
            required: ["recommendedStart", "recommendedEnd", "title", "reason", "viralScore", "suggestedCaption", "subtitles", "scenes"],
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
