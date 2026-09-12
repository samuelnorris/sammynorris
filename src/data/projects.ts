// Single source of truth for the six case studies as they appear in the
// homepage shell. The case-study pages themselves still own their own copy —
// this is only the summary the dock's Work panel and detail card need.
//
// `monogram` is the two-letter tile in the work list. `role` / `year` / `stat`
// fill the detail card's uppercase meta labels, and `read` feeds the cursor
// bubble that types a reading time on hover.

export interface Project {
  title: string;
  slug: string;
  monogram: string;
  year: string;
  role: string;
  discipline: string;
  read: string;
  summary: string;
  stat: { value: string; label: string };
}

export const PROJECTS: Project[] = [
  {
    title: "Commission consent",
    slug: "commission",
    monogram: "CC",
    year: "2025",
    role: "Senior Product Designer",
    discipline: "Regulated service · FCA",
    read: "2 min read",
    summary:
      "A court ruling made Close Brothers' broker commission process non-compliant overnight. I drove the design of a new Commission Disclosure and Consent service — built and launched in seven weeks.",
    stat: { value: "91%", label: "Completion rate" },
  },
  {
    title: "Ekeg+",
    slug: "ekeg",
    monogram: "EK",
    year: "2023",
    role: "Senior Product Designer",
    discipline: "Platform · Logistics",
    read: "2 min read",
    summary:
      "Breweries were managing keg fleets manually — high costs, poor visibility, constant stock errors. I led the design of a pay-per-fill rental platform giving them real-time control of over 400,000 containers.",
    stat: { value: "400k+", label: "Containers in fleet" },
  },
  {
    title: "Larkbury",
    slug: "larkbury",
    monogram: "LB",
    year: "2022",
    role: "Product / Graphic Designer",
    discipline: "Brand · Ecommerce",
    read: "1 min read",
    summary:
      "Larkbury London didn't exist before this project. I built it from scratch — brand identity and a fully responsive ecommerce site, designed solo across 700+ artboards and seven viewports.",
    stat: { value: "700+", label: "Artboards" },
  },
  {
    title: "Gener8",
    slug: "gener8",
    monogram: "G8",
    year: "2021",
    role: "Sole Designer",
    discipline: "Consumer · Browser extension",
    read: "1 min read",
    summary:
      "A first-of-its-kind browser extension that lets people profit from the ads they see. I was brought in as the sole designer to turn a genuinely novel proposition into something simple enough to download and trust.",
    stat: { value: "200k+", label: "Downloads" },
  },
  {
    title: "Porsche",
    slug: "porsche",
    monogram: "PO",
    year: "2021",
    role: "Lead Designer",
    discipline: "Automotive · watchOS",
    read: "1 min read",
    summary:
      "A native Apple Watch app giving Porsche owners instant, glanceable access to their car's key stats — designed from information architecture through to handoff at Brandwidth.",
    stat: { value: "watchOS", label: "Native build" },
  },
  {
    title: "Toyota",
    slug: "toyota",
    monogram: "TO",
    year: "2020",
    role: "Product Designer",
    discipline: "Automotive · Configurator",
    read: "1 min read",
    summary:
      "A web-based car configurator giving people the tools to spec their perfect vehicle from engine to interior. I owned the design execution across more than 70% of the screens.",
    stat: { value: "70%+", label: "Screens owned" },
  },
];
