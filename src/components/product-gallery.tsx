import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Film,
  Maximize2,
  Play,
  Rotate3D,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ProductVisual } from "@/components/product-visual";
import { ProductVideo } from "@/components/product-video";
import type { Product } from "@/data/store";
import { cn } from "@/lib/utils";

function muxPoster(playbackId: string, width = 900) {
  return `https://image.mux.com/${playbackId}/thumbnail.webp?width=${width}&time=0`;
}

function formatDuration(seconds?: number) {
  if (!seconds) return "";
  const total = Math.max(0, Math.round(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

export function ProductGallery({ product }: { product: Product }) {
  const images = useMemo(() => {
    const values = [
      product.imageUrl,
      product.secondImageUrl,
      ...(product.gallery ?? []),
    ].filter((value): value is string => Boolean(value));
    return Array.from(new Set(values));
  }, [product.imageUrl, product.secondImageUrl, product.gallery]);
  const hasVideo = Boolean(product.videoPlaybackId);
  const mediaCount = images.length + (hasVideo ? 1 : 0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [videoMode, setVideoMode] = useState(
    images.length === 0 && hasVideo,
  );
  const [direction, setDirection] = useState(1);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState(false);

  const mainDrag = useRef({
    started: false,
    startX: 0,
    startY: 0,
    moved: false,
  });
  const suppressMainClick = useRef(false);
  const fullscreenDrag = useRef<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    moved: boolean;
  } | null>(null);

  const activeIsVideo = videoMode && hasVideo;
  const currentImage = images[activeIndex] ?? images[0];

  useEffect(() => {
    setActiveIndex(0);
    setVideoMode(images.length === 0 && hasVideo);
    setOpen(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [product.id]);

  useEffect(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [open, activeIndex, videoMode]);

  const goToImage = (index: number, nextDirection: number) => {
    if (images.length === 0) return;
    setDirection(nextDirection);
    setVideoMode(false);
    setActiveIndex((index + images.length) % images.length);
  };

  const step = (delta: number) => {
    if (images.length < 2 || activeIsVideo) return;
    goToImage(activeIndex + delta, delta > 0 ? 1 : -1);
  };

  const openViewer = () => {
    if (!currentImage && !hasVideo) return;
    if (!currentImage && hasVideo) setVideoMode(true);
    setOpen(true);
  };

  const changeZoom = (next: number) => {
    const value = Math.min(4, Math.max(1, next));
    setZoom(value);
    if (value === 1) setOffset({ x: 0, y: 0 });
  };

  const startMainDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activeIsVideo) return;
    mainDrag.current = {
      started: true,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
  };

  const moveMainDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!mainDrag.current.started) return;
    if (
      Math.abs(event.clientX - mainDrag.current.startX) > 9 ||
      Math.abs(event.clientY - mainDrag.current.startY) > 9
    ) {
      mainDrag.current.moved = true;
    }
  };

  const endMainDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!mainDrag.current.started) return;
    const distance = event.clientX - mainDrag.current.startX;
    const moved = mainDrag.current.moved;
    mainDrag.current.started = false;
    if (moved && images.length > 1 && Math.abs(distance) > 45) {
      suppressMainClick.current = true;
      window.setTimeout(() => {
        suppressMainClick.current = false;
      }, 350);
      step(distance > 0 ? -1 : 1);
    }
  };

  const handleMainClick = () => {
    if (activeIsVideo) return;
    if (suppressMainClick.current) {
      suppressMainClick.current = false;
      return;
    }
    openViewer();
  };

  const stage = (
    <div
      className={cn(
        "group relative aspect-[4/5] overflow-hidden bg-stage [perspective:1400px] touch-pan-y",
        activeIsVideo
          ? "cursor-default"
          : images.length > 1
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-zoom-in",
      )}
      onPointerDown={startMainDrag}
      onPointerMove={moveMainDrag}
      onPointerUp={endMainDrag}
      onPointerCancel={endMainDrag}
      onClick={handleMainClick}
    >
      {activeIsVideo && product.videoPlaybackId ? (
        open ? (
          <div className="absolute inset-0 bg-black" />
        ) : (
          <ProductVideo
            playbackId={product.videoPlaybackId}
            poster={muxPoster(product.videoPlaybackId, 1400)}
            className="absolute inset-0 h-full w-full"
          />
        )
      ) : currentImage ? (
        <AnimatePresence initial={false}>
          <motion.img
            key={`${activeIndex}-${currentImage}`}
            src={currentImage}
            alt={product.name}
            draggable={false}
            initial={{
              opacity: 0,
              rotateY: direction * 22,
              scale: 1.03,
            }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: direction * -22, scale: 0.99 }}
            transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute inset-0 h-full w-full select-none object-cover"
          />
        </AnimatePresence>
      ) : (
        <ProductVisual
          product={product}
          className="absolute inset-0 h-full w-full"
          plateClassName="p-8"
          framed
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
      <span className="mono pointer-events-none absolute top-4 start-4 z-10 bg-black/55 px-2 py-1 text-[7px] tracking-[0.18em] text-white/80 backdrop-blur">
        ZOMA EDIT / {product.kind.toUpperCase()}
      </span>
      {product.discount > 0 && (
        <span className="shimmer-sweep mono pointer-events-none absolute top-4 end-4 z-10 border border-gold/40 bg-black/55 px-2 py-1 text-[9px] text-gold backdrop-blur">
          -{product.discount}%
        </span>
      )}
      {activeIsVideo && (
        <span className="mono pointer-events-none absolute bottom-14 start-4 z-10 flex items-center gap-1.5 border border-white/20 bg-black/60 px-2 py-1 text-[8px] text-white/85 backdrop-blur">
          <Film className="size-3 text-gold" />
          PRODUCT FILM
        </span>
      )}

      {!activeIsVideo && images.length > 1 && (
        <>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            aria-label="الزاوية السابقة"
            className="absolute start-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/45 text-white opacity-100 backdrop-blur transition-all hover:bg-gold hover:text-espresso sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            aria-label="الزاوية التالية"
            className="absolute end-3 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/45 text-white opacity-100 backdrop-blur transition-all hover:bg-gold hover:text-espresso sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
          >
            <ChevronLeft className="size-4" />
          </button>
        </>
      )}

      {(currentImage || hasVideo) && (
        <button
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            openViewer();
          }}
          className={cn(
            "absolute end-3 z-20 flex items-center gap-1.5 border border-white/25 bg-black/55 px-2.5 py-1.5 text-[9px] text-white backdrop-blur transition-colors hover:bg-gold hover:text-espresso",
            activeIsVideo ? "bottom-14" : "bottom-3",
          )}
        >
          <Maximize2 className="size-3" />
          {activeIsVideo ? "عرض الفيديو" : "تكبير"}
        </button>
      )}

      {!activeIsVideo && images.length > 1 && (
        <span className="mono pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap border border-white/15 bg-black/55 px-2 py-1 text-[7.5px] text-white/70 backdrop-blur">
          <Rotate3D className="size-3 text-gold" />
          اسحب يميناً أو يساراً لتغيير الزاوية
        </span>
      )}
    </div>
  );

  if (images.length === 0 && !hasVideo) {
    return (
      <div className="relative border border-ink/10 bg-card p-2.5">
        <div className="relative aspect-[4/5] overflow-hidden">
          <ProductVisual
            product={product}
            className="h-full w-full"
            plateClassName="p-8"
          >
            <span className="mono absolute top-4 start-4 z-10 bg-black/55 px-2 py-1 text-[7px] tracking-[0.18em] text-white/80 backdrop-blur">
              ZOMA EDIT / {product.kind.toUpperCase()}
            </span>
            {product.discount > 0 && (
              <span className="shimmer-sweep mono absolute top-4 end-4 z-10 border border-gold/40 bg-black/55 px-2 py-1 text-[9px] text-gold backdrop-blur">
                -{product.discount}%
              </span>
            )}
          </ProductVisual>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative border border-ink/10 bg-card p-2.5">
        {stage}
      </div>

      {mediaCount > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => {
                setVideoMode(false);
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              aria-label={`عرض الزاوية ${index + 1}`}
              aria-pressed={!videoMode && activeIndex === index}
              className={cn(
                "relative aspect-[4/5] w-14 shrink-0 overflow-hidden border bg-paper-deep transition-all sm:w-16",
                !videoMode && activeIndex === index
                  ? "border-gold ring-1 ring-gold/40"
                  : "border-ink/10 opacity-60 hover:opacity-100",
              )}
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="mono absolute bottom-0.5 start-1 text-[7px] text-white/70">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
          {hasVideo && product.videoPlaybackId && (
            <button
              type="button"
              onClick={() => setVideoMode(true)}
              aria-label="عرض فيديو المنتج"
              aria-pressed={videoMode}
              className={cn(
                "relative aspect-[4/5] w-14 shrink-0 overflow-hidden border bg-black transition-all sm:w-16",
                videoMode
                  ? "border-gold ring-1 ring-gold/40"
                  : "border-ink/10 opacity-70 hover:opacity-100",
              )}
            >
              <img
                src={muxPoster(product.videoPlaybackId, 320)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                <span className="flex size-6 items-center justify-center rounded-full border border-white/40 bg-black/45 text-white">
                  <Play className="ms-0.5 size-2.5 fill-current" />
                </span>
              </span>
              {product.videoDuration ? (
                <span className="mono absolute bottom-1 end-1 bg-black/65 px-1 text-[7px] text-white/75">
                  {formatDuration(product.videoDuration)}
                </span>
              ) : (
                <span className="mono absolute bottom-1 end-1 bg-black/65 px-1 text-[7px] text-white/75">
                  FILM
                </span>
              )}
            </button>
          )}
        </div>
      )}

      {mediaCount > 1 && (
        <p className="mono mt-2 flex items-center gap-1.5 text-[8px] tracking-[0.04em] text-ink-soft/40">
          <Expand className="size-2.5 text-gold/70" />
          {images.length} {images.length === 1 ? "ANGLE" : "ANGLES"}
          {hasVideo ? " + PRODUCT FILM" : ""} — اضغط الصورة للتكبير
        </p>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="block h-[94vh] w-[calc(100vw-1rem)] max-w-[1200px] gap-0 overflow-hidden rounded-none border-white/10 bg-[#0b0a09] p-0 text-white shadow-2xl sm:max-w-[1200px]"
        >
          <DialogTitle className="sr-only">
            عارض صور وفيديو {product.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            كبّر الصورة، اسحب للانتقال بين الزوايا، أو شغّل فيديو المنتج.
          </DialogDescription>

          <div className="flex h-full min-h-0 flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
              <div className="min-w-0">
                <p className="mono text-[8px] tracking-[0.2em] text-gold">
                  PRODUCT VIEWER / ZOMA
                </p>
                <p className="mt-1 truncate text-[13px] text-white/85">
                  {product.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="mono hidden text-[8px] text-white/40 sm:block">
                  {activeIsVideo
                    ? "PRODUCT FILM"
                    : `ANGLE ${activeIndex + 1} / ${images.length}`}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex size-9 items-center justify-center border border-white/15 text-white/65 transition-colors hover:border-gold hover:text-gold"
                  aria-label="إغلاق العارض"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div
              className="relative min-h-0 flex-1 touch-none overflow-hidden bg-black"
              onWheel={(event) => {
                if (activeIsVideo) return;
                event.preventDefault();
                changeZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
              }}
              onDoubleClick={() => {
                if (!activeIsVideo) changeZoom(zoom > 1 ? 1 : 2);
              }}
              onPointerDown={(event) => {
                if (activeIsVideo) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                fullscreenDrag.current = {
                  x: event.clientX,
                  y: event.clientY,
                  offsetX: offset.x,
                  offsetY: offset.y,
                  moved: false,
                };
                setPanning(true);
              }}
              onPointerMove={(event) => {
                const start = fullscreenDrag.current;
                if (!start || activeIsVideo) return;
                const dx = event.clientX - start.x;
                const dy = event.clientY - start.y;
                if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                  start.moved = true;
                }
                if (zoom > 1) {
                  setOffset({
                    x: start.offsetX + dx,
                    y: start.offsetY + dy,
                  });
                }
              }}
              onPointerUp={(event) => {
                const start = fullscreenDrag.current;
                fullscreenDrag.current = null;
                setPanning(false);
                if (!start || activeIsVideo) return;
                const dx = event.clientX - start.x;
                if (zoom === 1 && start.moved && Math.abs(dx) > 55) {
                  step(dx > 0 ? -1 : 1);
                }
              }}
              onPointerCancel={() => {
                fullscreenDrag.current = null;
                setPanning(false);
              }}
            >
              {activeIsVideo && product.videoPlaybackId ? (
                <ProductVideo
                  playbackId={product.videoPlaybackId}
                  poster={muxPoster(product.videoPlaybackId, 1600)}
                  autoPlay
                  className="h-full w-full"
                />
              ) : currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  draggable={false}
                  className="pointer-events-none h-full w-full select-none object-contain"
                  style={{
                    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`,
                    transition: panning ? "none" : "transform 180ms ease-out",
                  }}
                />
              ) : null}

              {!activeIsVideo && images.length > 1 && (
                <>
                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      step(-1);
                    }}
                    aria-label="الزاوية السابقة"
                    className="absolute start-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center border border-white/15 bg-black/50 text-white/80 backdrop-blur transition-colors hover:border-gold hover:text-gold"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => {
                      event.stopPropagation();
                      step(1);
                    }}
                    aria-label="الزاوية التالية"
                    className="absolute end-3 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center border border-white/15 bg-black/50 text-white/80 backdrop-blur transition-colors hover:border-gold hover:text-gold"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                </>
              )}

              {!activeIsVideo && (
                <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 border border-white/15 bg-black/65 px-1.5 py-1 backdrop-blur">
                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => changeZoom(zoom - 0.25)}
                    disabled={zoom <= 1}
                    className="flex size-8 items-center justify-center text-white/70 hover:text-gold disabled:opacity-30"
                    aria-label="تصغير"
                  >
                    <ZoomOut className="size-4" />
                  </button>
                  <span className="mono min-w-12 text-center text-[8px] text-white/60">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => changeZoom(zoom + 0.25)}
                    disabled={zoom >= 4}
                    className="flex size-8 items-center justify-center text-white/70 hover:text-gold disabled:opacity-30"
                    aria-label="تكبير"
                  >
                    <ZoomIn className="size-4" />
                  </button>
                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={() => changeZoom(1)}
                    className="flex size-8 items-center justify-center text-white/50 hover:text-gold"
                    aria-label="إعادة ضبط التكبير"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-3 py-2.5">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`full-${image}-${index}`}
                    type="button"
                    onClick={() => {
                      setVideoMode(false);
                      setDirection(index > activeIndex ? 1 : -1);
                      setActiveIndex(index);
                    }}
                    aria-label={`عرض الزاوية ${index + 1}`}
                    aria-pressed={!videoMode && activeIndex === index}
                    className={cn(
                      "aspect-[4/5] w-12 shrink-0 overflow-hidden border transition-all sm:w-14",
                      !videoMode && activeIndex === index
                        ? "border-gold opacity-100"
                        : "border-white/10 opacity-55 hover:opacity-100",
                    )}
                  >
                    <img
                      src={image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
                {hasVideo && product.videoPlaybackId && (
                  <button
                    type="button"
                    onClick={() => setVideoMode(true)}
                    aria-label="عرض فيديو المنتج"
                    aria-pressed={videoMode}
                    className={cn(
                      "relative aspect-[4/5] w-12 shrink-0 overflow-hidden border bg-black transition-all sm:w-14",
                      videoMode
                        ? "border-gold opacity-100"
                        : "border-white/10 opacity-55 hover:opacity-100",
                    )}
                  >
                    <img
                      src={muxPoster(product.videoPlaybackId, 260)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play className="ms-0.5 size-3.5 fill-current text-white/90" />
                    </span>
                  </button>
                )}
              </div>
              <p className="mt-2 text-center text-[8px] text-white/35">
                {activeIsVideo
                  ? "فيديو المنتج — استخدم أدوات التشغيل للتحكم في الصوت والجودة."
                  : images.length > 1
                    ? "اسحب يميناً أو يساراً لتغيير الزاوية، وانقر مرتين للتكبير."
                    : "استخدم + و− للتكبير، واسحب الصورة عند التكبير."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
