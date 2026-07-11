// Scroll-reveal: fade and slide [data-reveal] elements in as they enter view.
// Shared by the homepage, the About page, and every case study.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        el.classList.add("revealed");
        observer.unobserve(el);
        // The stagger belongs to the reveal alone: once it has played, zero
        // the delay so hover/press transitions on the same element respond
        // immediately instead of queueing behind --delay.
        el.addEventListener(
          "transitionend",
          () => el.style.setProperty("--delay", "0s"),
          { once: true }
        );
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));

// Keyboard access: reveal a [data-reveal] element as soon as it (or something
// inside it) receives focus. Without this, tabbing to an off-screen card paints
// its focus ring on an opacity:0 element, so keyboard users cannot see focus
// move through the projects. Zero the stagger delay so the ring appears at once.
document.addEventListener("focusin", (event) => {
  const el = (event.target as Element | null)?.closest?.("[data-reveal]");
  if (el && !el.classList.contains("revealed")) {
    (el as HTMLElement).style.setProperty("--delay", "0s");
    el.classList.add("revealed");
    observer.unobserve(el);
  }
});

// Chapter dividers: scale the .chapter__head::after rule from 0 to full width
// as the head travels from the bottom edge of the viewport through 80% of its
// height (full width once its top reaches 20% from the top). Scroll-linked
// (reverses on scroll back), driven via the --line custom property. Under
// prefers-reduced-motion the CSS shows the line at full width and this never
// runs.
const heads = document.querySelectorAll<HTMLElement>(".chapter__head");
if (heads.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    heads.forEach((head) => {
      const top = head.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (vh - top) / (vh * 0.8)));
      head.style.setProperty("--line", progress.toFixed(4));
    });
  };
  const queueUpdate = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener("scroll", queueUpdate, { passive: true });
  window.addEventListener("resize", queueUpdate, { passive: true });
  update();
}
