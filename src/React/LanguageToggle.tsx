import { useState, useEffect } from "react";
import type { Lang } from "../i18n/translations";

export default function LanguageToggle() {
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

  const toggle = () => {
    const next: Lang = lang === "en" ? "es" : "en";
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: next } }));
  };

  return (
    <button
      onClick={toggle}
      className="text-xl cursor-pointer transition-transform hover:scale-110 leading-none"
      aria-label="Toggle language"
      title={lang === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
    >
      {lang === "en" ? "🇺🇸" : "🇪🇸"}
    </button>
  );
}
