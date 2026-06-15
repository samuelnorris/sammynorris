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
