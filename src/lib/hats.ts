import brand from "../../kim_kroll_brand.json";

export type HatMediaType = "project" | "video" | "image";

export type Hat = {
  number: string;
  name_he: string;
  tagline_he: string;
  body_he: string;
  media: { type: HatMediaType; src: string };
  world: { accent: string; mood: string };
};

// Transition direction INTO each world. hero -> hat1 is always "down";
// after that the axis alternates so the page stops behaving normally.
export type Direction = "down" | "right";
export const HAT_DIRECTIONS: Direction[] = ["down", "right", "down", "right"];

const section = (brand as { sections: { hats: { title_he: string; hats: Hat[] } } })
  .sections.hats;

export const HATS_TITLE: string = section.title_he;
export const HATS: Hat[] = section.hats;
