import { useEffect, useRef, useState, useCallback } from 'react';

interface FrameMeta {
  frameCount: number;
  fps: number;
  desktopPath: string;
  mobilePath: string;
  generatedAt?: string;
}

export function useScrubFrames(sectionRef: React.RefObject<HTMLElement | null>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [meta, setMeta] = useState<FrameMeta | null>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef(false);

  const padIndex = (num: number) => num.toString().padStart(4, '0');

  // 1. Fetch metadata
  useEffect(() => {
    prefersReducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    fetch('/frames/meta.json')
      .then((res) => {
        if (!res.ok) throw new Error('meta.json not found');
        return res.text();
      })
      .then((text) => {
        const clean = text.replace(/^\uFEFF/, '').trim();
        const data: FrameMeta = JSON.parse(clean);
        setMeta(data);
      })
      .catch((err) => {
        console.warn('Could not load meta.json:', err);
      });
  }, []);

  // 2. Preload frames into cache
  useEffect(() => {
    if (!meta || meta.frameCount === 0) return;

    const isMobile = window.innerWidth < 768;
    const basePath = isMobile ? '/frames/mob' : '/frames/desk';
    const total = meta.frameCount;
    imagesRef.current = new Array(total).fill(null);

    let count = 0;
    const initialBatch = Math.min(25, total);

    const loadSingle = (index: number) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = `${basePath}/f_${padIndex(index + 1)}.webp`;
        img.onload = () => {
          imagesRef.current[index] = img;
          count++;
          setLoadProgress(Math.round((count / total) * 100));
          if (count >= initialBatch) {
            setFramesLoaded(true);
          }
          resolve();
        };
        img.onerror = () => resolve();
      });
    };

    const run = async () => {
      for (let i = 0; i < initialBatch; i++) {
        await loadSingle(i);
      }
      setFramesLoaded(true);

      for (let i = initialBatch; i < total; i++) {
        loadSingle(i);
      }
    };

    run();
  }, [meta]);

  // 3. Scroll progress calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      const scrollable = sectionHeight - windowHeight;
      if (scrollable <= 0) return;

      // When section top hits viewport top: progress = 0
      // When section bottom hits viewport bottom: progress = 1
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));

      setScrollProgress(p);

      if (meta && meta.frameCount > 0) {
        targetFrameRef.current = Math.min(
          meta.frameCount - 1,
          Math.floor(p * (meta.frameCount - 1))
        );
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRef, meta]);

  // 4. Responsive canvas sizing
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round((rect.width || window.innerWidth) * dpr);
    const h = Math.round((rect.height || window.innerHeight) * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  // 5. Render frame on canvas with centered cover-fit math
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateCanvasDimensions();

    const width = canvas.width;
    const height = canvas.height;

    if (width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);

    if (meta && meta.frameCount > 0 && imagesRef.current.length > 0) {
      const targetIdx = Math.max(0, Math.min(meta.frameCount - 1, Math.round(currentFrameRef.current)));
      let img = imagesRef.current[targetIdx];

      // Fallback to nearest loaded frame
      if (!img) {
        for (let offset = 1; offset < 40; offset++) {
          if (targetIdx - offset >= 0 && imagesRef.current[targetIdx - offset]) {
            img = imagesRef.current[targetIdx - offset];
            break;
          }
          if (targetIdx + offset < meta.frameCount && imagesRef.current[targetIdx + offset]) {
            img = imagesRef.current[targetIdx + offset];
            break;
          }
        }
      }

      if (!img && imagesRef.current[0]) {
        img = imagesRef.current[0];
      }

      if (img && img.complete && img.naturalWidth > 0) {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = width / height;

        let drawW: number;
        let drawH: number;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawW = width;
          drawH = width / imgRatio;
          offsetY = (height - drawH) / 2;
        } else {
          drawW = height * imgRatio;
          drawH = height;
          offsetX = (width - drawW) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        return;
      }
    }

    // Atmospheric dark obsidian procedural fallback
    const gradient = ctx.createRadialGradient(
      width / 2,
      height * 0.35,
      50,
      width / 2,
      height * 0.5,
      Math.max(width, height) * 0.7
    );
    gradient.addColorStop(0, 'rgba(29, 46, 19, 0.85)');
    gradient.addColorStop(0.5, 'rgba(15, 25, 10, 0.6)');
    gradient.addColorStop(1, '#090909');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }, [meta, updateCanvasDimensions]);

  // 6. rAF lerp loop (0.16 factor for butter-smooth, responsive sync)
  useEffect(() => {
    const loop = () => {
      if (!prefersReducedMotionRef.current && meta && meta.frameCount > 0) {
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) < 0.02) {
          currentFrameRef.current = targetFrameRef.current;
        } else {
          currentFrameRef.current += diff * 0.16;
        }
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      drawFrame();
      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrame, meta]);

  // 7. Resize handling
  useEffect(() => {
    const handleResize = () => {
      updateCanvasDimensions();
      drawFrame();
    };

    updateCanvasDimensions();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCanvasDimensions, drawFrame]);

  return {
    canvasRef,
    scrollProgress,
    framesLoaded,
    loadProgress,
    hasFrames: Boolean(meta && meta.frameCount > 0),
  };
}
