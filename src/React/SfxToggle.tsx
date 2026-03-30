import { useEffect, useState } from "react";
import { setSfxEnabled } from "../lib/sfx";

const STORAGE_KEY = "sfx-enabled";

export default function SfxToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = stored !== "false";
    setEnabled(initial);
    setSfxEnabled(initial);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSfxEnabled(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed left-4 bottom-24 md:bottom-5 z-[120] inline-flex items-center justify-center h-12 w-12 rounded-full border border-[var(--white-icon-tr)] bg-[var(--btn-bg)] text-[var(--white)] shadow-lg backdrop-blur-md transition-colors hover:bg-[var(--white-icon-tr)]"
      title={enabled ? "Mute SFX" : "Unmute SFX"}
      aria-label={enabled ? "Mute SFX" : "Unmute SFX"}
      data-sfx="off"
    >
      {enabled ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M11 5.889V18.11a1 1 0 0 1-1.64.768L5.703 16H3a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2.703L9.36 5.12A1 1 0 0 1 11 5.889zM15.536 8.464a1 1 0 0 1 1.414 0A5.982 5.982 0 0 1 18.707 13a5.982 5.982 0 0 1-1.757 4.536 1 1 0 0 1-1.414-1.414A3.986 3.986 0 0 0 16.707 13a3.986 3.986 0 0 0-1.171-3.122 1 1 0 0 1 0-1.414z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M11 5.889V18.11a1 1 0 0 1-1.64.768L5.703 16H3a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h2.703L9.36 5.12A1 1 0 0 1 11 5.889z" />
          <path d="M19.778 6.222a1 1 0 0 1 0 1.414L17.414 10l2.364 2.364a1 1 0 1 1-1.414 1.414L16 11.414l-2.364 2.364a1 1 0 0 1-1.414-1.414L14.586 10l-2.364-2.364a1 1 0 1 1 1.414-1.414L16 8.586l2.364-2.364a1 1 0 0 1 1.414 0z" />
        </svg>
      )}
    </button>
  );
}
