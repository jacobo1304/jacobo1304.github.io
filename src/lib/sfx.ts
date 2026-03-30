import { Howl, Howler } from "howler";

type SfxKey = "click" | "lasershot" | "victory" | "ui-button" | "nav-jump";

const sounds: Record<SfxKey, Howl> = {
  click: new Howl({
    src: ["/sfx/click.wav"],
    volume: 0.22,
    preload: true,
  }),
  lasershot: new Howl({
    src: ["/sfx/LaserShot.wav"],
    volume: 0.28,
    preload: true,
  }),
  victory: new Howl({
    src: ["/sfx/trompetabien.wav"],
    volume: 0.34,
    preload: true,
  }),
  "ui-button": new Howl({
    src: ["/sfx/UIBotonBurbuja.mp3"],
    volume: 0.24,
    preload: true,
  }),
  "nav-jump": new Howl({
    src: ["/sfx/SaltoPantallaUISFX.wav"],
    volume: 0.5,
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

export function playLaserShot() {
  play("lasershot");
}

export function playVictory() {
  play("victory");
}

export function playUiButton() {
  play("ui-button");
}

export function playNavJump() {
  play("nav-jump");
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
      if (customSfx === "click") return void playClick();
      if (customSfx === "lasershot") return void playLaserShot();
      if (customSfx === "victory") return void playVictory();
      if (customSfx === "ui-button") return void playUiButton();
      if (customSfx === "nav-jump") return void playNavJump();

      const interactive = target.closest(
        "button, a, [role='button'], input[type='button'], input[type='submit']",
      );

      if (interactive) {
        playUiButton();
      }
    },
    { capture: true },
  );
}
