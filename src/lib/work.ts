import brand from "../../kim_kroll_brand.json";

const section = (
  brand as { sections: { work: { title_he: string; subtitle_he: string } } }
).sections.work;

export const WORK_TITLE: string = section.title_he;
export const WORK_SUBTITLE: string = section.subtitle_he;

export type WorkType = "בנייה" | "תוכן" | "ליווי";
export type Project = { name: string; type: WorkType; oneLiner: string };

// Placeholder gallery — designed to be replaced with real projects. Categories
// mirror the hats (בונה / יוצר / מלווה) so the proof ties back to the offer.
export const PROJECTS: Project[] = [
  { name: "פלטפורמה דיגיטלית", type: "בנייה", oneLiner: "רעיון שהיה בראש של מישהו — היום מוצר חי שאנשים משתמשים בו." },
  { name: "סדרת תוכן", type: "תוכן", oneLiner: "סיפור שנבנה נכון, ונשאר לאנשים בראש." },
  { name: "ליווי מרעיון למוצר", type: "ליווי", oneLiner: "מאיפה שהם התחילו — ולאן הגיעו כשליוויתי אותם." },
  { name: "מוצר דיגיטלי", type: "בנייה", oneLiner: "עוד דבר שיצא מהראש אל העולם." },
];
