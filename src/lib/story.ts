import brand from "../../kim_kroll_brand.json";

const section = (
  brand as { sections: { story: { title_he: string; body_he: string[] } } }
).sections.story;

export const STORY_TITLE: string = section.title_he;
export const STORY_BEATS: string[] = section.body_he;
