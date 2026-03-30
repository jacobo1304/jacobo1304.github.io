import { useEffect, useMemo, useState } from "react";
import { type Lang } from "../i18n/translations";

const videos: Record<Lang, string> = {
  es: "HatdModQrTc",
  en: "EDuOe4_6nZc",
};

const TrailerEmbed = () => {
  const [lang, setLang] = useState<Lang>("en");
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = videos[lang];
  const thumbnail = useMemo(
    () => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    [videoId],
  );

  useEffect(() => {
    const stored = (localStorage.getItem("lang") || "en") as Lang;
    setLang(stored);

    const handler = (e: Event) => {
      setLang((e as CustomEvent<{ lang: Lang }>).detail.lang);
      setIsPlaying(false);
    };
    window.addEventListener("langchange", handler);
    return () => window.removeEventListener("langchange", handler);
  }, []);

  return (
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
          onClick={() => setIsPlaying(true)}
          className="group relative w-full h-full"
          aria-label={lang === "es" ? "Reproducir trailer" : "Play trailer"}
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
    </div>
  );
};

export default TrailerEmbed;
