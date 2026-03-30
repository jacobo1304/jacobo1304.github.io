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

type AlienState = {
  id: number;
  x: number;
  y: number;
  fading: boolean;
};

type UnlockMode = "locked" | "default" | "victory";

function AlienSprite({
  x,
  y,
  fading,
  onHit,
}: {
  x: number;
  y: number;
  fading: boolean;
  onHit: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onHit}
      className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
        fading ? "opacity-0 scale-75" : "opacity-100 scale-100 hover:scale-105"
      }`}
      style={{ left: `${x}px`, top: `${y}px`, width: ALIEN_SIZE, height: ALIEN_SIZE }}
      aria-label="Alien target"
      data-sfx="off"
    >
      <svg
        viewBox="0 0 17 17"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
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
  const [alien, setAlien] = useState<AlienState | null>(null);

  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const timeoutRefs = useRef<number[]>([]);
  const alienIdRef = useRef(0);

  const t = translations[lang];

  const registerTimeout = (id: number) => {
    timeoutRefs.current.push(id);
  };

  const playShotPlaceholder = () => {
    playLaserShot();
  };

  const playVictoryPlaceholder = () => {
    playVictory();
  };

  const playSpawnPlaceholder = () => {
    // Placeholder reservado para un tercer SFX (spawn) en el siguiente paso.
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

  const spawnAlien = useCallback(() => {
    if (!showLockPanel) return;

    const area = gameAreaRef.current;
    if (!area) return;

    const rect = area.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const half = ALIEN_SIZE / 2;
    const edgePadding = 18;

    const minX = half + edgePadding;
    const maxX = Math.max(minX, rect.width - half - edgePadding);
    const minY = half + edgePadding;
    const maxY = Math.max(minY, rect.height - half - edgePadding);

    const x = minX + Math.random() * (maxX - minX || 1);
    const y = minY + Math.random() * (maxY - minY || 1);

    alienIdRef.current += 1;
    setAlien({ id: alienIdRef.current, x, y, fading: false });
    playSpawnPlaceholder();
  }, [showLockPanel]);

  const completeVictory = useCallback(() => {
    setUnlockMode("victory");
    setAlien(null);
    setIsPanelFading(true);
    playVictoryPlaceholder();
    localStorage.setItem(STORAGE_KEY, "true");

    const fadeTimeout = window.setTimeout(() => {
      setShowLockPanel(false);
      setIsPanelFading(false);
    }, 420);
    registerTimeout(fadeTimeout);
  }, []);

  const handleAlienHit = useCallback(() => {
    setAlien((current) => {
      if (!current || current.fading) return current;
      playShotPlaceholder();
      return { ...current, fading: true };
    });

    const hitTimeout = window.setTimeout(() => {
      playAlienDeathPlaceholder();
      setScore((prev) => {
        const next = Math.min(prev + 1, ALIENS_TO_UNLOCK);
        if (next >= ALIENS_TO_UNLOCK) {
          completeVictory();
        } else {
          spawnAlien();
        }
        return next;
      });
    }, 190);
    registerTimeout(hitTimeout);
  }, [completeVictory, spawnAlien]);

  const handleRestart = useCallback(() => {
    playGenericButtonPlaceholder();
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }, []);

  const handleSkip = useCallback(() => {
    playGenericButtonPlaceholder();
    setAlien(null);
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
    if (!showLockPanel || alien) return;
    const spawnTimeout = window.setTimeout(() => {
      spawnAlien();
    }, 80);
    registerTimeout(spawnTimeout);
  }, [alien, showLockPanel, spawnAlien]);

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
              cursor: "url('/assets/target-crosshair.png') 16 16, crosshair",
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

            <div ref={gameAreaRef} className="absolute inset-0 overflow-hidden">
              {alien && (
                <AlienSprite
                  key={alien.id}
                  x={alien.x}
                  y={alien.y}
                  fading={alien.fading}
                  onHit={handleAlienHit}
                />
              )}
            </div>
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
