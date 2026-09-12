// Homepage shell: the menu state machine, the morph, the clock and the
// keyboard model.
//
// The dock and the menu are one card. At rest the card is just the nav row —
// a pill. Opening a state grows the body above it, so the menu extends out of
// the navigation rather than floating over it. Two values animate: the card's
// width, and the body's height.
//
// Sizing is measure-and-set rather than an interpolation to `height: auto`,
// which still isn't safe cross-browser. On every state change we lay the
// target view out at its intended width off-screen, read its natural height,
// then transition to those numbers on the site's existing spring easing while
// the two views crossfade underneath.

const PANEL_MIN_H = 120;

const card = document.querySelector<HTMLElement>("[data-card]");
const panel = document.querySelector<HTMLElement>("[data-panel]");
const dock = document.querySelector<HTMLElement>(".dock");

// ---------------------------------------------------------------- clock

(function clock() {
  const el = document.querySelector<HTMLElement>("[data-clock]");
  if (!el) return;

  const timeZone = el.dataset.timezone || "Europe/London";
  const fmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  });

  function tick() {
    el!.textContent = fmt.format(new Date());
  }

  tick();
  setInterval(tick, 1000);
})();

// ---------------------------------------------------------------- panel

if (card && panel && dock) {
  const views = Array.from(panel.querySelectorAll<HTMLElement>(".panel__view"));
  const stateButtons = Array.from(dock.querySelectorAll<HTMLButtonElement>("[data-state]"));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /** Current view key, or null when the menu is collapsed to the nav row. */
  let current: string | null = null;
  /** Which dock button opened the menu, so Esc can hand focus back. */
  let opener: HTMLElement | null = null;

  const viewFor = (key: string) => views.find((v) => v.dataset.view === key) || null;

  /** Runs fn with the card's transitions off, so a measuring pass can set
      sizes without animating to them. */
  function withoutTransition(fn: () => void) {
    const cardPrev = card!.style.transition;
    const panelPrev = panel!.style.transition;
    card!.style.transition = "none";
    panel!.style.transition = "none";
    fn();
    // Flush, so the suppressed transition can't leak into the next change.
    void card!.offsetWidth;
    card!.style.transition = cardPrev;
    panel!.style.transition = panelPrev;
  }

  /**
   * The card's width when collapsed: the nav row's own natural width. Read
   * with the explicit width removed so `fit-content` applies, then restored.
   *
   * Returns 0 if the element isn't laid out yet — during startup, or in an
   * embedded viewer that reports zero-size boxes for a frame. Callers treat 0
   * as "leave it to CSS" rather than writing a 0px width, which would collapse
   * the card to nothing with no way back.
   */
  function measureClosedWidth(): number {
    let w = 0;
    withoutTransition(() => {
      const prev = card!.style.getPropertyValue("--card-w");
      card!.style.setProperty("--card-w", "fit-content");
      w = card!.offsetWidth;
      if (prev) card!.style.setProperty("--card-w", prev);
      else card!.style.removeProperty("--card-w");
    });
    return w > 0 ? w : 0;
  }

  let closedWidth = 0;

  /**
   * Natural size of a view at its intended width. The clone is laid out for
   * real (visibility:hidden, not display:none) so scrollHeight is honest,
   * then torn straight back down.
   */
  function measure(view: HTMLElement): { w: number; h: number } {
    const slot = card!.parentElement as HTMLElement;
    const cs = getComputedStyle(slot);

    // clientWidth/Height include the slot's own padding. Measuring against
    // those would let a tall card overflow the slot at both ends — on a short
    // viewport it rode up over the status pill — so clamp to the content box.
    // The nav row is part of the card now, so its height comes off the budget
    // the body has to play with.
    const availableW =
      slot.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const availableH =
      slot.clientHeight -
      parseFloat(cs.paddingTop) -
      parseFloat(cs.paddingBottom) -
      dock!.offsetHeight;

    // A slot that hasn't been laid out yet reports zero, which would make the
    // budget negative and size the card to nothing. Fall back to the view's
    // own intent and let the ResizeObserver correct it once layout lands.
    const want = Number(view.dataset.w || 420);
    const w = availableW > 0 ? Math.min(want, availableW) : want;

    view.style.setProperty("--measure-w", `${w}px`);
    view.classList.add("is-measuring");
    const h = view.scrollHeight;
    view.classList.remove("is-measuring");
    view.style.removeProperty("--measure-w");

    return { w, h: availableH > 0 ? Math.max(PANEL_MIN_H, Math.min(h, availableH)) : h };
  }

  /** Width goes on the card, height on the body it wraps. */
  function apply(w: number, h: number) {
    card!.style.setProperty("--card-w", `${w}px`);
    panel!.style.setProperty("--panel-h", `${h}px`);
  }

  /**
   * Collapse to the nav row. With a known width it animates; without one it
   * hands the width back to the stylesheet's `fit-content`, so a failed
   * measurement leaves the nav row at its natural size instead of at zero.
   */
  function collapse() {
    panel!.style.setProperty("--panel-h", "0px");
    if (closedWidth > 0) card!.style.setProperty("--card-w", `${closedWidth}px`);
    else card!.style.removeProperty("--card-w");
  }

  function sizeTo(view: HTMLElement, animate: boolean) {
    const { w, h } = measure(view);
    if (animate) apply(w, h);
    else withoutTransition(() => apply(w, h));
  }

  function syncDock() {
    for (const btn of stateButtons) {
      const active = current !== null && btn.dataset.state === rootState(current);
      btn.setAttribute("aria-expanded", active ? "true" : "false");
    }
  }

  /** A detail view still belongs to Work as far as the dock is concerned. */
  function rootState(key: string) {
    return key.startsWith("detail:") ? "work" : key;
  }

  function show(key: string, options: { focus?: boolean } = {}) {
    const next = viewFor(key);
    if (!next || key === current) return;

    // The card is always on screen — only the body's height changes — so
    // opening is the same operation as switching states. No reveal frame to
    // schedule, and nothing that can strand it half-open in a background tab.
    card!.classList.add("is-open");
    sizeTo(next, !reduced.matches);

    for (const view of views) view.classList.toggle("is-active", view === next);
    current = key;
    syncDock();

    if (options.focus) {
      // First focusable thing inside the new view, so keyboard users land in
      // the content rather than back at the top of the document.
      const target = next.querySelector<HTMLElement>(
        "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])",
      );
      target?.focus();
    }
  }

  /** Collapses the body back into the nav row. The card itself stays. */
  function close(options: { restoreFocus?: boolean } = {}) {
    if (current === null) return;
    for (const view of views) view.classList.remove("is-active");
    current = null;
    card!.classList.remove("is-open");

    if (reduced.matches) withoutTransition(collapse);
    else collapse();

    syncDock();

    if (options.restoreFocus && opener) opener.focus();
    opener = null;
  }

  // ------------------------------------------------------------- dock

  for (const btn of stateButtons) {
    btn.addEventListener("click", () => {
      const state = btn.dataset.state!;
      // Same button again shuts it — the dock is a toggle, not a tab strip.
      if (current !== null && rootState(current) === state) {
        close();
        return;
      }
      opener = btn;
      show(state);
    });
  }

  // Roving arrow keys along the dock, home/end to the ends.
  const dockItems = Array.from(dock.querySelectorAll<HTMLElement>(".dock__btn"));
  dock.addEventListener("keydown", (e) => {
    const index = dockItems.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return;

    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % dockItems.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + dockItems.length) % dockItems.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = dockItems.length - 1;

    if (next !== -1) {
      e.preventDefault();
      dockItems[next].focus();
    }
  });

  // ------------------------------------------------------------- image warming

  // Detail images are lazy and live inside a panel that starts display:none,
  // so nothing fetches them until the detail is already on screen — which
  // shows a card full of empty boxes for a beat. Flipping an already-parsed
  // img from lazy to eager kicks the fetch off, so warm a project's images as
  // soon as the pointer or focus lands on its row.
  const warmed = new Set<string>();
  function warm(slug: string) {
    if (warmed.has(slug)) return;
    warmed.add(slug);
    const view = viewFor(`detail:${slug}`);
    view?.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
      img.loading = "eager";
    });
  }

  for (const row of panel.querySelectorAll<HTMLElement>("[data-project]")) {
    const slug = row.dataset.project!;
    row.addEventListener("pointerenter", () => warm(slug));
    row.addEventListener("focus", () => warm(slug));
  }

  // ------------------------------------------------------------- panel body

  panel.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const row = target.closest<HTMLElement>("[data-project]");
    if (row) {
      // Touch and keyboard activation never fire pointerenter, so warm here too.
      warm(row.dataset.project!);
      show(`detail:${row.dataset.project}`, { focus: true });
      return;
    }

    if (target.closest("[data-back]")) {
      show("work", { focus: true });
      return;
    }

    if (target.closest("[data-close]")) {
      close({ restoreFocus: true });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || current === null) return;
    // Esc steps back out of a detail before it closes the panel outright.
    if (current.startsWith("detail:")) show("work", { focus: true });
    else close({ restoreFocus: true });
  });

  /** Re-measure and re-apply whatever state we're in, without animating. */
  function resync() {
    closedWidth = measureClosedWidth();
    withoutTransition(() => {
      if (current === null) {
        collapse();
        return;
      }
      const view = viewFor(current);
      if (view) {
        const { w, h } = measure(view);
        apply(w, h);
      }
    });
  }

  // The card carries explicit pixel sizes, so they have to be recomputed
  // whenever the space around it changes. A ResizeObserver on the slot covers
  // three cases with one mechanism that a resize listener misses: the viewport
  // changing, web fonts landing and reflowing the nav row, and — the reason
  // it's here — the very first layout, since the slot can report a zero-size
  // box for a frame and every measurement taken then is worthless.
  const slot = card.parentElement as HTMLElement;
  let roTimer: ReturnType<typeof setTimeout>;
  new ResizeObserver(() => {
    clearTimeout(roTimer);
    roTimer = setTimeout(resync, 120);
  }).observe(slot);

  // ------------------------------------------------------------- entrance

  // Start collapsed to the nav row, then grow into Home so the name arrives
  // as the menu opens. The open is deferred a beat so it follows the page
  // entrance rather than fighting it.
  withoutTransition(collapse);

  const openHome = () => show("home");
  if (reduced.matches) openHome();
  else setTimeout(openHome, 260);
}
