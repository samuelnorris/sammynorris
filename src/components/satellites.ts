// The satellites plotted on the /iss map. Shared by the map component (which
// renders a marker per entry) and the page script (which propagates them).
//
// `catnr` is the NORAD catalogue number used to fetch a TLE from CelesTrak.
// `id` is used for element ids, CSS classes and the toggle buttons.
export interface Satellite {
  id: string;
  catnr: number;
  name: string;
  /** Short line under the name in the toggle, for people who don't know it. */
  blurb: string;
  /** The ISS is the subject of the page and gets the louder marker treatment. */
  primary?: boolean;
}

export const SATELLITES: Satellite[] = [
  { id: "iss", catnr: 25544, name: "ISS", blurb: "Crewed since 2000", primary: true },
  { id: "css", catnr: 48274, name: "Tiangong", blurb: "China's space station" },
  { id: "hst", catnr: 20580, name: "Hubble", blurb: "Space telescope" },
];
