import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Loader2, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductVideo({
  playbackId,
  poster,
  className,
  autoPlay = false,
}: {
  playbackId: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsReady(false);
    setError(null);
    const source = `https://stream.mux.com/${playbackId}.m3u8`;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      const onLoaded = () => setIsReady(true);
      video.addEventListener("loadeddata", onLoaded);
      return () => {
        video.removeEventListener("loadeddata", onLoaded);
        video.removeAttribute("src");
        video.load();
      };
    }

    if (!Hls.isSupported()) {
      setError("متصفحك لا يدعم تشغيل الفيديو الحالي.");
      return;
    }

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90,
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    const onManifest = () => setIsReady(true);
    hls.on(Hls.Events.MANIFEST_PARSED, onManifest);
    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        setError("تعذّر تحميل الفيديو. حاول مرة أخرى.");
      }
    });

    return () => {
      hls.off(Hls.Events.MANIFEST_PARSED, onManifest);
      hls.destroy();
    };
  }, [playbackId]);

  useEffect(() => {
    if (!autoPlay) return;
    const video = videoRef.current;
    if (!video) return;
    const play = () => {
      void video.play().catch(() => {
        // Mobile browsers may require a second tap; controls remain available.
      });
    };
    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });
    return () => video.removeEventListener("loadeddata", play);
  }, [autoPlay, isReady]);

  return (
    <div className={cn("relative overflow-hidden bg-black", className)}>
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
      />
      {!isReady && !error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="flex items-center gap-2 border border-white/15 bg-black/55 px-3 py-2 text-[9px] text-white/70 backdrop-blur">
            <Loader2 className="size-3 animate-spin text-gold" />
            جارٍ تجهيز الفيديو…
          </span>
        </div>
      )}
      {!isReady && !error && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white/90">
            <Play className="ms-0.5 size-5 fill-current" />
          </span>
        </span>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75 px-6 text-center text-[10px] leading-5 text-white/75">
          {error}
        </div>
      )}
    </div>
  );
}
