import React, { useState, useEffect } from "react";
import { type Lang } from "../i18n/translations";

const videos: Record<Lang, string> = {
  es: "HatdModQrTc",
  en: "EDuOe4_6nZc",
};

const TrailerEmbed = () => {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = (localStorage.getItem("lang") || "en") as Lang;
    setLang(stored);

    const handler = (e: Event) => {
      setLang((e as CustomEvent<{ lang: Lang }>).detail.lang);
    };
    window.addEventListener("langchange", handler);
    return () => window.removeEventListener("langchange", handler);
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[var(--white-icon-tr)]">
      <iframe
        key={lang}
        src={`https://www.youtube.com/embed/${videos[lang]}?feature=oembed&rel=0&modestbranding=1&playsinline=1`}
        title="Personal Trailer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};

export default TrailerEmbed;
