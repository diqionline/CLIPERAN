import React, { useRef, useState, useEffect } from "react";
import { 
  Camera, 
  Download, 
  Sparkles, 
  Type, 
  Layers, 
  RotateCw, 
  Move, 
  Check, 
  Palette, 
  Plus, 
  Layout, 
  Image as ImageIcon,
  Sliders,
  Award,
  Flame,
  AlertCircle
} from "lucide-react";
import { TrimRange, VideoClip } from "../types";
import { formatTimecode } from "../utils";

interface ThumbnailGeneratorProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  currentTime: number;
  currentClip: VideoClip;
  trimRange: TrimRange;
}

type TextPreset = "tiktok-impact" | "cyberpunk-neon" | "brutalist-banner" | "clean-vlog" | "glow-impact";

export default function ThumbnailGenerator({
  videoRef,
  currentTime,
  currentClip,
  trimRange
}: ThumbnailGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // States
  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  
  // Customization States
  const [titleText, setTitleText] = useState("MOMEN PALING VIRAL! 🔥");
  const [subtitleText, setSubtitleText] = useState("Jangan lewatkan adegan ini");
  const [activePreset, setActivePreset] = useState<TextPreset>("tiktok-impact");
  
  // Advanced control states
  const [titleSize, setTitleSize] = useState(48);
  const [titleColor, setTitleColor] = useState("#facc15"); // yellow-400
  const [titleStrokeColor, setTitleStrokeColor] = useState("#000000");
  const [titleStrokeWidth, setTitleStrokeWidth] = useState(6);
  const [titleBgColor, setTitleBgColor] = useState("#000000");
  const [titleBgOpacity, setTitleBgOpacity] = useState(0.8);
  const [titleY, setTitleY] = useState(35); // 0-100 percentage
  const [titleX, setTitleX] = useState(50); // 0-100 percentage
  const [titleRotation, setTitleRotation] = useState(-3); // -15 to 15 degrees

  const [subtitleSize, setSubtitleSize] = useState(24);
  const [subtitleColor, setSubtitleColor] = useState("#ffffff");
  const [subtitleY, setSubtitleY] = useState(80); // 0-100 percentage
  const [subtitleX, setSubtitleX] = useState(50); // 0-100 percentage
  const [subtitleRotation, setSubtitleRotation] = useState(0);

  // Decorative Badge Overlay
  const [badgeText, setBadgeText] = useState("MUST WATCH");
  const [badgePosition, setBadgePosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right" | "none">("top-right");
  const [badgeColor, setBadgeColor] = useState("#ef4444"); // red-500

  const [isCapturing, setIsCapturing] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  // Try to capture on initial mount if video is ready
  useEffect(() => {
    if (videoRef.current && !capturedFrame) {
      handleCaptureFrame();
    }
  }, [videoRef, currentClip]);

  // Redraw canvas whenever states change
  useEffect(() => {
    drawThumbnail();
  }, [
    capturedFrame,
    titleText,
    subtitleText,
    activePreset,
    titleSize,
    titleColor,
    titleStrokeColor,
    titleStrokeWidth,
    titleBgColor,
    titleBgOpacity,
    titleX,
    titleY,
    titleRotation,
    subtitleSize,
    subtitleColor,
    subtitleX,
    subtitleY,
    subtitleRotation,
    badgeText,
    badgePosition,
    badgeColor
  ]);

  // Apply styles based on chosen preset
  const applyPreset = (preset: TextPreset) => {
    setActivePreset(preset);
    switch (preset) {
      case "tiktok-impact":
        setTitleColor("#facc15"); // Yellow
        setTitleStrokeColor("#000000");
        setTitleStrokeWidth(7);
        setTitleSize(46);
        setTitleRotation(-4);
        setTitleBgColor("#000000");
        setTitleBgOpacity(0); // transparent background, rely on outline
        setSubtitleColor("#ffffff");
        setSubtitleSize(22);
        setSubtitleRotation(0);
        break;
      case "cyberpunk-neon":
        setTitleColor("#f472b6"); // Pink
        setTitleStrokeColor("#06b6d4"); // Cyan border
        setTitleStrokeWidth(3);
        setTitleSize(48);
        setTitleRotation(2);
        setTitleBgColor("#0f172a");
        setTitleBgOpacity(0.4);
        setSubtitleColor("#22d3ee");
        setSubtitleSize(20);
        setSubtitleRotation(2);
        break;
      case "brutalist-banner":
        setTitleColor("#000000"); // Black text
        setTitleStrokeColor("#ffffff");
        setTitleStrokeWidth(0);
        setTitleSize(40);
        setTitleRotation(0);
        setTitleBgColor("#22c55e"); // Neon green banner
        setTitleBgOpacity(1);
        setSubtitleColor("#ffffff");
        setSubtitleSize(18);
        setSubtitleRotation(0);
        break;
      case "clean-vlog":
        setTitleColor("#ffffff");
        setTitleStrokeColor("#000000");
        setTitleStrokeWidth(2);
        setTitleSize(36);
        setTitleRotation(0);
        setTitleBgColor("#000000");
        setTitleBgOpacity(0.7); // Dark card background
        setSubtitleColor("#cbd5e1");
        setSubtitleSize(18);
        setSubtitleRotation(0);
        break;
      case "glow-impact":
        setTitleColor("#ffffff");
        setTitleStrokeColor("#ef4444"); // Red glow effect outline
        setTitleStrokeWidth(8);
        setTitleSize(52);
        setTitleRotation(-2);
        setTitleBgColor("#000000");
        setTitleBgOpacity(0.2);
        setSubtitleColor("#facc15");
        setSubtitleSize(24);
        setSubtitleRotation(-1);
        break;
    }
  };

  // Capture Frame handler
  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    setIsCapturing(true);
    try {
      const canvas = document.createElement("canvas");
      // Use the actual video dimensions for crisp rendering
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw current video state
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        setCapturedFrame(dataUrl);
      }
    } catch (err) {
      console.error("Gagal menangkap frame video: ", err);
    } finally {
      setIsCapturing(false);
    }
  };

  // Main Draw function inside the canvas
  const drawThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Background image if captured, else dark gradient template
    if (capturedFrame) {
      const img = new Image();
      img.src = capturedFrame;
      img.onload = () => {
        // Draw the video frame
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Add subtle vignette/dimming gradient to make text more readable
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "rgba(0, 0, 0, 0.4)");
        grad.addColorStop(0.3, "rgba(0, 0, 0, 0.1)");
        grad.addColorStop(0.7, "rgba(0, 0, 0, 0.15)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0.6)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Overlays
        drawOverlays(ctx, canvas.width, canvas.height);
      };
    } else {
      // Background Placeholder gradient
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 50,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.5
      );
      grad.addColorStop(0, "#1e1b4b"); // indigo-950
      grad.addColorStop(1, "#020617"); // slate-950
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid line details
      ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
      ctx.lineWidth = 2;
      for (let i = 0; i < canvas.width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 60) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw Info text
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 24px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Gunakan Playhead & Tangkap Frame Video", canvas.width / 2, canvas.height / 2);

      drawOverlays(ctx, canvas.width, canvas.height);
    }
  };

  // Helper to draw overlays (Title, Subtitle, Badge)
  const drawOverlays = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // 3. Draw Badge Overlay if active
    if (badgePosition !== "none" && badgeText.trim()) {
      drawBadge(ctx, w, h);
    }

    // 4. Draw Title Text
    if (titleText.trim()) {
      drawTitle(ctx, w, h);
    }

    // 5. Draw Subtitle Text
    if (subtitleText.trim()) {
      drawSubtitle(ctx, w, h);
    }

    // 6. Draw Watermark logo brand in bottom corner
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "bold 14px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("✨ Cliperan Studio", 25, h - 20);
    ctx.restore();
  };

  // Draw styled Title on Canvas
  const drawTitle = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    
    const posX = (titleX / 100) * w;
    const posY = (titleY / 100) * h;
    
    // Translate to pivot point and rotate
    ctx.translate(posX, posY);
    ctx.rotate((titleRotation * Math.PI) / 180);

    // Font family selection
    let fontName = "'Plus Jakarta Sans', sans-serif";
    let textToDraw = titleText;

    if (activePreset === "tiktok-impact" || activePreset === "glow-impact") {
      fontName = "Impact, 'Arial Black', sans-serif";
      textToDraw = titleText.toUpperCase(); // Force uppercase for impact presets
    } else if (activePreset === "cyberpunk-neon") {
      fontName = "'JetBrains Mono', Courier, monospace";
    }

    ctx.font = `900 ${titleSize}px ${fontName}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const metrics = ctx.measureText(textToDraw);
    const textWidth = metrics.width;
    const textHeight = titleSize * 1.2;

    // Draw Background Strip if opacity > 0
    if (titleBgOpacity > 0) {
      ctx.fillStyle = hexToRgba(titleBgColor, titleBgOpacity);
      const paddingX = 24;
      const paddingY = 12;
      
      // Rounded banner or clean block
      if (activePreset === "clean-vlog" || activePreset === "cyberpunk-neon") {
        // Rounded border
        drawRoundedRect(
          ctx, 
          -textWidth / 2 - paddingX, 
          -textHeight / 2 - paddingY + 2, 
          textWidth + paddingX * 2, 
          textHeight + paddingY * 2, 
          10
        );
        ctx.fill();
      } else {
        // Solid block banner
        ctx.fillRect(
          -textWidth / 2 - paddingX, 
          -textHeight / 2 - paddingY + 2, 
          textWidth + paddingX * 2, 
          textHeight + paddingY * 2
        );
      }
    }

    // Draw Text Outline / Stroke if width > 0
    if (titleStrokeWidth > 0) {
      ctx.strokeStyle = titleStrokeColor;
      ctx.lineWidth = titleStrokeWidth;
      ctx.lineJoin = "miter";
      ctx.miterLimit = 2;
      ctx.strokeText(textToDraw, 0, 0);
    }

    // Draw Drop shadow if glow or tiktok active
    if (activePreset === "tiktok-impact") {
      ctx.shadowColor = "#000000";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
    } else if (activePreset === "cyberpunk-neon") {
      ctx.shadowColor = titleStrokeColor;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else if (activePreset === "glow-impact") {
      ctx.shadowColor = titleStrokeColor;
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Draw Main Fill Text
    ctx.fillStyle = titleColor;
    ctx.fillText(textToDraw, 0, 0);

    ctx.restore();
  };

  // Draw styled Subtitle on Canvas
  const drawSubtitle = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();

    const posX = (subtitleX / 100) * w;
    const posY = (subtitleY / 100) * h;

    ctx.translate(posX, posY);
    ctx.rotate((subtitleRotation * Math.PI) / 180);

    let fontName = "'Plus Jakarta Sans', sans-serif";
    if (activePreset === "cyberpunk-neon") {
      fontName = "'JetBrains Mono', Courier, monospace";
    }

    ctx.font = `bold ${subtitleSize}px ${fontName}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const metrics = ctx.measureText(subtitleText);
    const textWidth = metrics.width;
    const textHeight = subtitleSize * 1.3;

    // Text backing strip for subtitle
    ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
    drawRoundedRect(
      ctx,
      -textWidth / 2 - 12,
      -textHeight / 2 - 4,
      textWidth + 24,
      textHeight + 8,
      6
    );
    ctx.fill();

    // Subtle outline
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Fill Text
    ctx.fillStyle = subtitleColor;
    ctx.fillText(subtitleText, 0, 0);

    ctx.restore();
  };

  // Draw Badge Overlay (e.g. "HOT", "LIVE")
  const drawBadge = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();

    const margin = 24;
    const badgeW = 120;
    const badgeH = 34;
    let bx = 0;
    let by = 0;

    switch (badgePosition) {
      case "top-left":
        bx = margin;
        by = margin;
        break;
      case "top-right":
        bx = w - badgeW - margin;
        by = margin;
        break;
      case "bottom-left":
        bx = margin;
        by = h - badgeH - margin - 30; // offset watermark
        break;
      case "bottom-right":
        bx = w - badgeW - margin;
        by = h - badgeH - margin - 30; // offset watermark
        break;
    }

    // Badge Background
    ctx.fillStyle = badgeColor;
    drawRoundedRect(ctx, bx, by, badgeW, badgeH, 8);
    ctx.fill();

    // Gold borders for highlight
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Badge Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 13px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // Add pulsing icon indicator conceptually
    ctx.fillText(`🔥 ${badgeText.toUpperCase()}`, bx + badgeW / 2, by + badgeH / 2);

    ctx.restore();
  };

  // Utility to convert Hex to RGBA
  const hexToRgba = (hex: string, opacity: number) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Helper to draw rounded rectangles
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // Download Action
  const handleDownloadThumbnail = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Trigger instant browser download
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `thumbnail-${currentClip.id}-${Math.floor(currentTime)}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsSuccessMessage(true);
    setTimeout(() => setIsSuccessMessage(false), 4000);
  };

  // Handle auto preset titles
  const insertQuickText = (text: string) => {
    setTitleText(text);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col space-y-5" id="thumbnail-generator-panel">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-950 text-amber-400 border border-amber-500/10 rounded-lg animate-pulse">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-200 text-xs md:text-sm">Pembuat Thumbnail Kreatif</h4>
            <p className="text-[10px] text-slate-500">Buat gambar cover clickbait viral beresolusi tinggi</p>
          </div>
        </div>

        <button
          onClick={handleCaptureFrame}
          disabled={isCapturing}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] sm:text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          title="Ambil frame dari waktu video aktif"
          type="button"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{isCapturing ? "Menangkap..." : "Ambil Frame Aktif"}</span>
        </button>
      </div>

      {/* Success Download Notification banner */}
      {isSuccessMessage && (
        <div className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 rounded-xl p-3 text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Gambar Thumbnail HD berhasil disimpan! Siap diunggah ke platform media sosial Anda. 🎉</span>
        </div>
      )}

      {/* Grid Layout: Left is Canvas Preview (6 cols), Right is Controllers (6 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Canvas Preview Area (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pratinjau Hasil Desain (16:9 HD)
            </label>
            <p className="text-[9px] text-slate-500">Semua perubahan teks dan preset dirender real-time</p>
          </div>

          {/* Interactive Canvas Stage Wrapper */}
          <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-850 flex items-center justify-center p-2 relative group shadow-inner">
            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="w-full h-auto aspect-video rounded-lg max-h-[260px] object-contain shadow-lg bg-slate-900"
            />
            
            {/* Overlay indicators inside bounds */}
            {!capturedFrame && (
              <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center text-center p-4">
                <AlertCircle className="w-10 h-10 text-indigo-400 mb-2 animate-bounce-short" />
                <p className="text-xs font-bold text-slate-200">Frame Belum Ditangkap</p>
                <p className="text-[9px] text-slate-500 max-w-[180px] mt-1">
                  Atur slider video ke momen dramatis lalu klik tombol <span className="text-indigo-400 font-semibold">Ambil Frame Aktif</span> di atas.
                </p>
              </div>
            )}
          </div>

          {/* Quick Clickbait Ideas */}
          <div className="bg-slate-950/50 border border-slate-850 rounded-xl p-3 space-y-2">
            <label className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider block flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Rekomendasi Teks Clickbait AI
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => insertQuickText("MOMEN GILA BANGET! 😱")}
                className="bg-slate-900 hover:bg-slate-850 text-slate-300 text-[9px] font-semibold px-2 py-1 rounded-lg border border-slate-800 hover:border-indigo-500/20 transition-all"
                type="button"
              >
                #GilaBanget
              </button>
              <button
                onClick={() => insertQuickText("TIPS RAHASIA SUKSES! 💡")}
                className="bg-slate-900 hover:bg-slate-850 text-slate-300 text-[9px] font-semibold px-2 py-1 rounded-lg border border-slate-800 hover:border-indigo-500/20 transition-all"
                type="button"
              >
                #RahasiaSukses
              </button>
              <button
                onClick={() => insertQuickText("X KALI LEBIH CEPAT! ⚡")}
                className="bg-slate-900 hover:bg-slate-850 text-slate-300 text-[9px] font-semibold px-2 py-1 rounded-lg border border-slate-800 hover:border-indigo-500/20 transition-all"
                type="button"
              >
                #LebihCepat
              </button>
              <button
                onClick={() => insertQuickText("JANGAN COBA INI! 🛑")}
                className="bg-slate-900 hover:bg-slate-850 text-slate-300 text-[9px] font-semibold px-2 py-1 rounded-lg border border-slate-800 hover:border-indigo-500/20 transition-all"
                type="button"
              >
                #JanganCoba
              </button>
            </div>
          </div>
        </div>

        {/* Configurations Area (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Preset Styles Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-indigo-400" />
              Pilih Desain Gaya Teks
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                onClick={() => applyPreset("tiktok-impact")}
                className={`py-2 px-2.5 rounded-xl border text-[10px] font-extrabold transition-all flex flex-col items-center justify-center gap-1 text-center ${
                  activePreset === "tiktok-impact"
                    ? "bg-slate-950 border-yellow-500 text-yellow-400 shadow-lg"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
                type="button"
              >
                <span className="text-xs">🎵</span>
                <span>TikTok Yellow</span>
              </button>

              <button
                onClick={() => applyPreset("glow-impact")}
                className={`py-2 px-2.5 rounded-xl border text-[10px] font-extrabold transition-all flex flex-col items-center justify-center gap-1 text-center ${
                  activePreset === "glow-impact"
                    ? "bg-slate-950 border-red-500 text-red-400 shadow-lg"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
                type="button"
              >
                <span className="text-xs">💥</span>
                <span>Red Glow</span>
              </button>

              <button
                onClick={() => applyPreset("brutalist-banner")}
                className={`py-2 px-2.5 rounded-xl border text-[10px] font-extrabold transition-all flex flex-col items-center justify-center gap-1 text-center ${
                  activePreset === "brutalist-banner"
                    ? "bg-slate-950 border-green-500 text-green-400 shadow-lg"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
                type="button"
              >
                <span className="text-xs">🟩</span>
                <span>Brutalist Green</span>
              </button>

              <button
                onClick={() => applyPreset("cyberpunk-neon")}
                className={`py-2 px-2.5 rounded-xl border text-[10px] font-extrabold transition-all flex flex-col items-center justify-center gap-1 text-center ${
                  activePreset === "cyberpunk-neon"
                    ? "bg-slate-950 border-pink-500 text-pink-400 shadow-lg"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
                type="button"
              >
                <span className="text-xs">🤖</span>
                <span>Neon Cyber</span>
              </button>

              <button
                onClick={() => applyPreset("clean-vlog")}
                className={`py-2 px-2.5 rounded-xl border text-[10px] font-extrabold transition-all flex flex-col items-center justify-center gap-1 text-center ${
                  activePreset === "clean-vlog"
                    ? "bg-slate-950 border-white text-white shadow-lg"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
                type="button"
              >
                <span className="text-xs">📸</span>
                <span>Clean Card</span>
              </button>
            </div>
          </div>

          {/* Text Settings Container */}
          <div className="bg-slate-950/50 border border-slate-850 p-4 rounded-xl space-y-4">
            
            {/* Input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 block uppercase font-bold">Judul Utama (Title)</label>
                <input
                  type="text"
                  value={titleText}
                  onChange={(e) => setTitleText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none text-slate-200"
                  maxLength={40}
                  placeholder="Ketik judul utama..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 block uppercase font-bold">Sub-judul (Sub)</label>
                <input
                  type="text"
                  value={subtitleText}
                  onChange={(e) => setSubtitleText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/80 rounded-lg px-3 py-1.5 text-xs focus:outline-none text-slate-200"
                  maxLength={50}
                  placeholder="Ketik sub-judul pendukung..."
                />
              </div>
            </div>

            {/* Precision Position & Size Controllers */}
            <div className="space-y-3 pt-2 border-t border-slate-900">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1">
                <Sliders className="w-3 h-3 text-slate-500" />
                Pengaturan Presisi Teks & Posisi
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title Controller Left side */}
                <div className="space-y-2.5 bg-slate-900/40 p-3 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-bold text-indigo-400 block">Judul (Title)</span>
                  
                  {/* Size slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>Ukuran Font</span>
                      <span className="font-bold text-slate-300">{titleSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="75"
                      value={titleSize}
                      onChange={(e) => setTitleSize(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Y-coordinate position slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>Vertikal (Y)</span>
                      <span className="font-bold text-slate-300">{titleY}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={titleY}
                      onChange={(e) => setTitleY(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* X-coordinate position slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>Horisontal (X)</span>
                      <span className="font-bold text-slate-300">{titleX}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={titleX}
                      onChange={(e) => setTitleX(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Tilt rotation slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>Kemiringan (Rotasi)</span>
                      <span className="font-bold text-slate-300">{titleRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-15"
                      max="15"
                      value={titleRotation}
                      onChange={(e) => setTitleRotation(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Subtitle Controller Right side */}
                <div className="space-y-2.5 bg-slate-900/40 p-3 rounded-lg border border-slate-900">
                  <span className="text-[10px] font-bold text-amber-400 block">Sub-judul (Subtitle)</span>

                  {/* Sub Size slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>Ukuran Font</span>
                      <span className="font-bold text-slate-300">{subtitleSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="14"
                      max="40"
                      value={subtitleSize}
                      onChange={(e) => setSubtitleSize(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Sub Y-coordinate position slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                      <span>Vertikal (Y)</span>
                      <span className="font-bold text-slate-300">{subtitleY}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="95"
                      value={subtitleY}
                      onChange={(e) => setSubtitleY(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Color Selector */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-slate-500 block font-mono">Warna Teks</span>
                    <div className="flex gap-1.5">
                      {["#ffffff", "#cbd5e1", "#facc15", "#4ade80", "#f472b6", "#ef4444"].map((col) => (
                        <button
                          key={col}
                          onClick={() => setSubtitleColor(col)}
                          style={{ backgroundColor: col }}
                          className={`w-5 h-5 rounded-full border-2 transition-transform ${
                            subtitleColor === col ? "border-indigo-400 scale-110" : "border-transparent"
                          }`}
                          type="button"
                          title={col}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Color pickers & Background settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-slate-900">
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 block uppercase font-bold">Warna Utama Judul</label>
                <div className="flex flex-wrap gap-1.5">
                  {["#facc15", "#ffffff", "#4ade80", "#f472b6", "#ef4444", "#38bdf8"].map((col) => (
                    <button
                      key={col}
                      onClick={() => setTitleColor(col)}
                      style={{ backgroundColor: col }}
                      className={`w-5 h-5 rounded-full border-2 transition-transform ${
                        titleColor === col ? "border-indigo-400 scale-110" : "border-transparent"
                      }`}
                      type="button"
                      title={col}
                    />
                  ))}
                </div>
              </div>

              {/* Title Strip Background customizer */}
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 block uppercase font-bold">Bumper Banner Belakang</label>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {["#000000", "#ef4444", "#22c55e", "#1e1b4b"].map((col) => (
                      <button
                        key={col}
                        onClick={() => {
                          setTitleBgColor(col);
                          if (titleBgOpacity === 0) setTitleBgOpacity(0.85); // Auto turn on
                        }}
                        style={{ backgroundColor: col }}
                        className={`w-4 h-4 rounded border transition-transform ${
                          titleBgColor === col && titleBgOpacity > 0 ? "border-indigo-400 scale-110" : "border-transparent"
                        }`}
                        type="button"
                        title={col}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => setTitleBgOpacity(titleBgOpacity === 0 ? 0.85 : 0)}
                    className={`px-2 py-0.5 rounded text-[8px] font-bold border transition-all ${
                      titleBgOpacity > 0 
                        ? "bg-indigo-950 border-indigo-500/20 text-indigo-300"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                    type="button"
                  >
                    {titleBgOpacity > 0 ? "Banner Aktif" : "Sembunyi"}
                  </button>
                </div>
              </div>
            </div>

            {/* Badge Overlay Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-slate-900">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 block uppercase font-bold">Isi Teks Stiker/Badge</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  placeholder="Ketik stiker, contoh: AWAS!"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500/80 rounded-lg px-2.5 py-1 text-xs focus:outline-none text-slate-200"
                  maxLength={15}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 block uppercase font-bold">Posisi Stiker</label>
                <select
                  value={badgePosition}
                  onChange={(e) => setBadgePosition(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="none">Tidak Ada Stiker</option>
                  <option value="top-right">Pojok Kanan Atas</option>
                  <option value="top-left">Pojok Kiri Atas</option>
                  <option value="bottom-right">Pojok Kanan Bawah</option>
                  <option value="bottom-left">Pojok Kiri Bawah</option>
                </select>
              </div>
            </div>

          </div>

          {/* Export Action Card */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleDownloadThumbnail}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              title="Download Hasil Cover Image JPG"
              type="button"
            >
              <Download className="w-4 h-4 text-black" />
              <span>Simpan Thumbnail (JPG)</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
