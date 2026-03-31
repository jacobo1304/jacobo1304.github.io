import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  playClick,
  playLaserShot,
  playUiButton,
  playVictory,
} from "../lib/sfx";
import { translations, type Lang } from "../i18n/translations";

const videos: Record<Lang, string> = {
  es: "HatdModQrTc",
  en: "EDuOe4_6nZc",
};

const STORAGE_KEY = "victoryUnlocked";
const ALIENS_TO_UNLOCK = 3;
const ALIEN_SIZE = 58;
const ALIEN_HITBOX_SIZE = 90;
const CURSOR_SIZE = 44;
const ALIEN_BASE_SPEED = 0.8;
const ALIEN_SPEED_VARIATION = 0.1;
const ALIEN_SPEED_STEP = 0.5;

type AlienState = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fading: boolean;
};

type UnlockMode = "locked" | "default" | "victory";

function AlienSprite({
  id,
  x,
  y,
  fading,
  onHit,
}: {
  id: number;
  x: number;
  y: number;
  fading: boolean;
  onHit: (id: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onHit(id)}
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
        fading ? "opacity-0 scale-75 transition-all duration-200" : "opacity-100 scale-100"
      }`}
      style={{ left: `${x}px`, top: `${y}px`, width: ALIEN_HITBOX_SIZE, height: ALIEN_HITBOX_SIZE }}
      aria-label="Alien target"
      data-sfx="off"
    >
      <svg
        viewBox="0 0 17 17"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
        style={{ width: `${ALIEN_SIZE}px`, height: `${ALIEN_SIZE}px` }}
        fill="currentColor"
      >
        <path
          d="M9.014,0.143 C5.159,0.143 2.031,3.122 2.031,6.794 C2.031,10.469 7.209,16 9.014,16 C10.822,16 16,10.469 16,6.794 C16,3.122 12.873,0.143 9.014,0.143 L9.014,0.143 Z M7.895,10.895 C7.579,11.213 6.481,10.624 5.447,9.574 C4.411,8.528 3.829,7.42 4.145,7.1 C4.46,6.779 5.557,7.369 6.592,8.417 C7.625,9.465 8.211,10.572 7.895,10.895 L7.895,10.895 Z M10.114,10.887 C9.794,10.567 10.384,9.461 11.435,8.414 C12.484,7.367 13.593,6.778 13.915,7.1 C14.235,7.418 13.644,8.524 12.595,9.57 C11.545,10.617 10.434,11.204 10.114,10.887 L10.114,10.887 Z"
          fill="#66f3db"
        />
      </svg>
    </button>
  );
}

const TrailerEmbed = () => {
  const [lang, setLang] = useState<Lang>("en");
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [unlockMode, setUnlockMode] = useState<UnlockMode>("locked");
  const [showLockPanel, setShowLockPanel] = useState(true);
  const [isPanelFading, setIsPanelFading] = useState(false);
  const [aliens, setAliens] = useState<AlienState[]>([]);

  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const timeoutRefs = useRef<number[]>([]);
  const alienIdRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const speedMultiplierRef = useRef(1);
  const pendingHitIdsRef = useRef<Set<number>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, visible: false });

  const t = translations[lang];

  const registerTimeout = (id: number) => {
    timeoutRefs.current.push(id);
  };

  const playShotPlaceholder = () => {
    const rate = 0.92 + Math.random() * 0.2;
    playLaserShot(rate);
  };

  const playVictoryPlaceholder = () => {
    playVictory();
  };

  const playAlienDeathPlaceholder = () => {
    playClick();
  };

  const playGenericButtonPlaceholder = () => {
    playUiButton();
  };

  const videoId = videos[lang];
  const thumbnail = useMemo(
    () => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    [videoId],
  );

  const titleText = useMemo(() => {
    if (unlockMode === "victory") return t.home_trailer_title_unlocked;
    if (showLockPanel) return t.home_trailer_title_locked;
    return t.home_trailer_title;
  }, [showLockPanel, t, unlockMode]);

  const spawnAliens = useCallback(() => {
    if (!showLockPanel) return;
    speedMultiplierRef.current = 1;
    pendingHitIdsRef.current.clear();

    const area = gameAreaRef.current;
    if (!area) return;

    const rect = area.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const half = ALIEN_SIZE / 2;

    const minX = half;
    const maxX = Math.max(minX, rect.width - half);
    const minY = half;
    const maxY = Math.max(minY, rect.height - half);

    const nextAliens: AlienState[] = [];
    const minDist = ALIEN_SIZE + 12;
    let attempts = 0;

    while (nextAliens.length < ALIENS_TO_UNLOCK && attempts < 200) {
      attempts += 1;
      const x = minX + Math.random() * (maxX - minX || 1);
      const y = minY + Math.random() * (maxY - minY || 1);

      const overlaps = nextAliens.some((a) => {
        const dx = a.x - x;
        const dy = a.y - y;
        return Math.hypot(dx, dy) < minDist;
      });
      if (overlaps) continue;

      const speed =
        (ALIEN_BASE_SPEED + (Math.random() * 2 - 1) * ALIEN_SPEED_VARIATION) *
        speedMultiplierRef.current;
      const angle = Math.random() * Math.PI * 2;

      alienIdRef.current += 1;
      nextAliens.push({
        id: alienIdRef.current,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        fading: false,
      });
    }

    setAliens(nextAliens);
  }, [showLockPanel]);

  const completeVictory = useCallback(() => {
    setUnlockMode("victory");
    setAliens([]);
    setIsPanelFading(true);
    playVictoryPlaceholder();
    localStorage.setItem(STORAGE_KEY, "true");

    const fadeTimeout = window.setTimeout(() => {
      setShowLockPanel(false);
      setIsPanelFading(false);
    }, 420);
    registerTimeout(fadeTimeout);
  }, []);

  const handleAlienHit = useCallback((id: number) => {
    if (pendingHitIdsRef.current.has(id)) return;

    const target = aliens.find((alien) => alien.id === id && !alien.fading);
    if (!target) return;

    pendingHitIdsRef.current.add(id);

    setAliens((current) =>
      current.map((alien) => {
        if (alien.id !== id || alien.fading) return alien;
        return { ...alien, fading: true, vx: 0, vy: 0 };
      }),
    );

    const hitTimeout = window.setTimeout(() => {
      setAliens((current) => {
        const next = current.filter((alien) => alien.id !== id);
        speedMultiplierRef.current *= ALIEN_SPEED_STEP;

        return next.map((alien) =>
          alien.fading
            ? alien
            : {
                ...alien,
                vx: alien.vx * ALIEN_SPEED_STEP,
                vy: alien.vy * ALIEN_SPEED_STEP,
              },
        );
      });

      playAlienDeathPlaceholder();
      setScore((prev) => {
        const next = Math.min(prev + 1, ALIENS_TO_UNLOCK);
        if (next >= ALIENS_TO_UNLOCK) {
          completeVictory();
        }
        return next;
      });
    }, 190);
    registerTimeout(hitTimeout);
  }, [aliens, completeVictory]);

  const handleRestart = useCallback(() => {
    playGenericButtonPlaceholder();
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }, []);

  const handleSkip = useCallback(() => {
    playGenericButtonPlaceholder();
    setAliens([]);
    setShowLockPanel(false);
    setIsPanelFading(false);
    setUnlockMode("default");
    setScore(0);
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem("lang") || "en") as Lang;
    setLang(stored);

    const alreadyUnlocked = localStorage.getItem(STORAGE_KEY) === "true";
    if (alreadyUnlocked) {
      setUnlockMode("default");
      setShowLockPanel(false);
      setScore(ALIENS_TO_UNLOCK);
    }

    const handler = (e: Event) => {
      setLang((e as CustomEvent<{ lang: Lang }>).detail.lang);
      setIsPlaying(false);
    };

    window.addEventListener("langchange", handler);

    return () => {
      window.removeEventListener("langchange", handler);
      timeoutRefs.current.forEach((id) => window.clearTimeout(id));
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    if (!showLockPanel || score > 0 || aliens.length > 0) return;
    const spawnTimeout = window.setTimeout(() => {
      spawnAliens();
    }, 80);
    registerTimeout(spawnTimeout);
  }, [aliens.length, score, showLockPanel, spawnAliens]);

  useEffect(() => {
    if (!showLockPanel || aliens.length === 0) return;

    const tick = () => {
      const area = gameAreaRef.current;
      if (!area) {
        animFrameRef.current = null;
        return;
      }

      const rect = area.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        animFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      const half = ALIEN_SIZE / 2;
      const minX = half;
      const maxX = Math.max(minX, rect.width - half);
      const minY = half;
      const maxY = Math.max(minY, rect.height - half);

      setAliens((current) => {
        if (current.length === 0) return current;

        const next = current.map((alien) => {
          if (alien.fading) return alien;

          let nextX = alien.x + alien.vx;
          let nextY = alien.y + alien.vy;
          let nextVx = alien.vx;
          let nextVy = alien.vy;

          if (nextX <= minX || nextX >= maxX) {
            nextVx = -nextVx;
            nextX = Math.min(Math.max(nextX, minX), maxX);
          }
          if (nextY <= minY || nextY >= maxY) {
            nextVy = -nextVy;
            nextY = Math.min(Math.max(nextY, minY), maxY);
          }

          return { ...alien, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
        });

        const minDist = ALIEN_SIZE;

        for (let i = 0; i < next.length; i += 1) {
          if (next[i].fading) continue;
          for (let j = i + 1; j < next.length; j += 1) {
            if (next[j].fading) continue;

            const dx = next[j].x - next[i].x;
            const dy = next[j].y - next[i].y;
            const dist = Math.hypot(dx, dy);
            if (dist >= minDist) continue;

            const nx = dist === 0 ? 1 : dx / dist;
            const ny = dist === 0 ? 0 : dy / dist;

            const v1n = next[i].vx * nx + next[i].vy * ny;
            const v2n = next[j].vx * nx + next[j].vy * ny;

            next[i].vx += (v2n - v1n) * nx;
            next[i].vy += (v2n - v1n) * ny;
            next[j].vx += (v1n - v2n) * nx;
            next[j].vy += (v1n - v2n) * ny;

            const overlap = minDist - dist;
            if (overlap > 0) {
              next[i].x -= nx * (overlap / 2);
              next[i].y -= ny * (overlap / 2);
              next[j].x += nx * (overlap / 2);
              next[j].y += ny * (overlap / 2);
            }
          }
        }

        return next;
      });

      animFrameRef.current = window.requestAnimationFrame(tick);
    };

    animFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current !== null) {
        window.cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [aliens.length, showLockPanel]);

  return (
    <div className="w-full" data-sfx="off">
      <h3 className="mb-4 text-center text-[var(--white)] text-xl md:text-2xl font-semibold">
        {titleText}
      </h3>

      <div className="relative z-10 w-full aspect-video min-h-[220px] rounded-2xl overflow-hidden border border-[var(--white-icon-tr)] bg-[var(--btn-bg)]">
        {isPlaying ? (
          <iframe
            key={`${lang}-${videoId}`}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={lang === "es" ? "Trailer personal" : "Personal trailer"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              playGenericButtonPlaceholder();
              setIsPlaying(true);
            }}
            className="group relative w-full h-full"
            aria-label={lang === "es" ? "Reproducir trailer" : "Play trailer"}
            data-sfx="off"
          >
            <img
              src={thumbnail}
              alt={lang === "es" ? "Vista previa del trailer" : "Trailer preview"}
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-black/35 transition-colors duration-300 group-hover:bg-black/20" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-7 w-7 translate-x-[1px]"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}

        {showLockPanel && (
          <div
            className={`absolute inset-0 z-20 transition-opacity duration-500 ${
              isPanelFading ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            style={{
              cursor: "none",
            }}
            onPointerMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setMousePos({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
                visible: true,
              });
            }}
            onPointerEnter={() => {
              setMousePos((prev) => ({ ...prev, visible: true }));
            }}
            onPointerLeave={() => {
              setMousePos((prev) => ({ ...prev, visible: false }));
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(8,8,8,0.84) 0%, rgba(5,5,5,0.93) 100%), url('/assets/hex-panel-texture.png')",
                backgroundPosition: "center",
                backgroundSize: "cover, 256px 256px",
                backgroundRepeat: "no-repeat, repeat",
              }}
            />

            <div className="absolute right-3 top-3 rounded-lg border border-white/20 bg-black/45 px-3 py-1 text-sm font-semibold text-[#d8fff7] tracking-wide">
              {`${score}/${ALIENS_TO_UNLOCK}`}
            </div>

            <div
              ref={gameAreaRef}
              className="absolute inset-0 overflow-hidden"
              onClick={playShotPlaceholder}
            >
                {aliens.map((alien) => (
                <AlienSprite
                  key={alien.id}
                    id={alien.id}
                  x={alien.x}
                  y={alien.y}
                  fading={alien.fading}
                  onHit={handleAlienHit}
                />
                ))}
            </div>

            {mousePos.visible && (
              <img
                src="/assets/target-crosshair.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute z-30"
                style={{
                  left: `${mousePos.x}px`,
                  top: `${mousePos.y}px`,
                  width: `${CURSOR_SIZE}px`,
                  height: `${CURSOR_SIZE}px`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleRestart}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--white-icon-tr)] bg-[var(--btn-bg)] px-4 py-2 text-[var(--white)] transition-colors hover:bg-[var(--white-icon-tr)]"
          data-sfx="off"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
          >
            <path d="M12 4a8 8 0 1 1-7.484 10.807l1.87-.71A6 6 0 1 0 12 6h-1.757l2.506 2.506-1.414 1.414L6.414 5l4.921-4.921 1.414 1.414L10.243 4H12z" />
          </svg>
          <span>{t.home_trailer_restart}</span>
        </button>

        {showLockPanel && (
          <button
            type="button"
            onClick={handleSkip}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--white-icon-tr)] bg-[var(--btn-bg)] px-4 py-2 text-[var(--white)] transition-colors hover:bg-[var(--white-icon-tr)]"
            data-sfx="off"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M16 4l8 8-8 8-1.414-1.414L20.172 13H2v-2h18.172l-5.586-5.586L16 4z" />
            </svg>
            <span>{t.home_trailer_skip}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TrailerEmbed;
