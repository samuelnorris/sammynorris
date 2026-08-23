// Interaction sounds, powered by cuelume (MIT, by Daniel Belyi): seventeen
// cues synthesised live with Web Audio, so there are no audio files to
// download and nothing to wait for.
//
// Sound is on by default — except for visitors who have asked their system to
// reduce motion, who start muted, since the same "less, please" applies to
// noise. Either way the speaker control beside the theme toggle switches it,
// and the choice is remembered in localStorage, overriding the default in both
// directions. Browsers keep audio silent until the visitor's first gesture, so
// nobody is met by noise on arrival — the first thing they hear is the click
// they made themselves.
import { bind, play, setEnabled, setVolume, type SoundName } from "cuelume";

const STORAGE_KEY = "sound";
const VOLUME = 0.55; // full scale is louder than a portfolio ever needs

/** Mirrors the stored preference so the toggle can render the right state. */
let on = true;

/**
 * The default for a visitor who has never touched the toggle: on, unless the
 * system asks for reduced motion. Kept in step with the pre-paint script in
 * Layout.astro, which decides the same thing before this module loads.
 */
function defaultPreference(): boolean {
  try {
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return true;
  }
}

function readPreference(): boolean {
  try {
    // An explicit choice wins in both directions, so someone on reduced motion
    // can still turn the sound on and have it stay on.
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "on") return true;
    if (stored === "off") return false;
  } catch {}
  return defaultPreference();
}

/**
 * Plays a cue. A no-op while muted — cuelume's own enabled flag does the
 * silencing, so the declarative data-cuelume-* bindings and these imperative
 * calls always agree.
 */
export function cue(name: SoundName, options?: { volume?: number }) {
  play(name, options);
}

export function isSoundOn() {
  return on;
}

export function setSoundOn(next: boolean) {
  on = next;
  setEnabled(next);
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {}
}

on = readPreference();
setVolume(VOLUME);
setEnabled(on);

// One call wires every data-cuelume-* attribute on the page. Listeners are
// delegated, so elements added later (pops, scoreboard rows) work too.
bind();

// Page transitions: the navigation interceptor in Layout announces the exit
// just before it fades the page out. The cue has to play here, on the old
// document, because the next one loads without a gesture to unblock audio.
document.addEventListener("sn:navigate", () => cue("page"));
