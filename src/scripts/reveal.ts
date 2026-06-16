// Scroll-reveal: fade and slide [data-reveal] elements in as they enter view.
// Shared by the homepage, the About page, and every case study.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
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
