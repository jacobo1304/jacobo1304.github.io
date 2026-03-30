import { Howl, Howler } from "howler";

type SfxKey = "click";

const sounds: Record<SfxKey, Howl> = {
  click: new Howl({
    src: ["/sfx/click.wav"],
    volume: 0.22,
    preload: true,
  }),
};

let sfxEnabled = true;
let initialized = false;

function unlockAudioContext() {
  const ctx = Howler.ctx;
  if (ctx && ctx.state !== "running") {
    void ctx.resume();
  }
}

function setupAutoplayUnlock() {
  const unlock = () => {
    unlockAudioContext();
  };

  document.addEventListener("pointerdown", unlock, { once: true, capture: true });
  document.addEventListener("keydown", unlock, { once: true, capture: true });
}

function play(key: SfxKey) {
  if (!sfxEnabled) return;
  sounds[key].play();
}

export function playClick() {
  play("click");
}

export function setSfxEnabled(enabled: boolean) {
  sfxEnabled = enabled;
}

export function initGlobalSfx() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  setupAutoplayUnlock();

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element | null;
      if (!target) return;

      if (target.closest("[data-sfx='off']")) return;

      const custom = target.closest<HTMLElement>("[data-sfx]");
      const customSfx = custom?.dataset.sfx;
      if (customSfx === "click") {
        playClick();
        return;
      }

      const interactive = target.closest(
        "button, a, [role='button'], input[type='button'], input[type='submit']",
      );

      if (interactive) {
        playClick();
      }
    },
    { capture: true },
  );
}
