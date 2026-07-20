import type { HatMediaType } from "@/lib/hats";
import type { AtmosphereVariant } from "@/components/hats/Atmosphere";
import type { Tone, WorldLayout } from "@/components/hats/World";

export type Lang = "he" | "en";
export type WorkTypeKey = "build" | "content" | "guide";

/** Structural, language-independent per-hat data (number, colour, media, world look). */
export const HATS_META: {
  number: string;
  accent: string;
  base: string;
  media: HatMediaType;
  variant: AtmosphereVariant;
  tone: Tone;
  layout: WorldLayout;
}[] = [
  { number: "01", accent: "#4E2C77", base: "#FFFFFF", media: "project", variant: "clean", tone: "light", layout: "split" },
  { number: "02", accent: "#9A6FD0", base: "#FFFFFF", media: "video", variant: "flow", tone: "light", layout: "showcase" },
  { number: "03", accent: "#C8794E", base: "#FFFFFF", media: "image", variant: "soft", tone: "light", layout: "journey" },
  { number: "04", accent: "#2E2A40", base: "#FFFFFF", media: "image", variant: "soft", tone: "light", layout: "map" },
];

type HatCopy = { name: string; tagline: string; body: string };

export type Content = {
  hero: {
    eyebrow: string;
    headlineLine1: string;
    headlinePre: string;
    headlineHi: string;
    headlinePost: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    scroll: string;
    wordmark: string;
  };
  story: { kicker: string; title: string; kickers: string[]; beats: string[] };
  hats: HatCopy[];
  work: {
    kicker: string;
    title: string;
    subtitle: string;
    preview: string;
    types: Record<WorkTypeKey, string>;
    projects: { name: string; type: WorkTypeKey; oneLiner: string }[];
  };
  connect: { kicker: string; headline: string; subtext: string; cta: string; note: string };
  footer: { tagline: string; links: { instagram: string; story: string; work: string }; copyright: string };
  map: { thailand: string; israel: string; england: string };
  media: { project: string; video: string; image: string };
  ui: { skip: string; toLang: string };
};

const he: Content = {
  hero: {
    eyebrow: "בונה · יוצר · מלווה · נווד",
    headlineLine1: "אני לא נכנס",
    headlinePre: "לקופסה ",
    headlineHi: "אחת",
    headlinePost: "",
    subheadline: "קים קרול - בונה, יוצר, ומלווה. לוקח את מה שיש לך בראש, ומוציא אותו אל העולם.",
    ctaPrimary: "עקוב אחרי המסע",
    ctaSecondary: "מה אני עושה",
    scroll: "גלול",
    wordmark: "קים קרול",
  },
  story: {
    kicker: "הסיפור",
    title: "המסע",
    kickers: ["מאיפה התחלתי", "הקפיצה", "בתנועה", "החוט"],
    beats: [
      'רוב החיים שלי לא הייתי בעולם הזה. מסעדנות, עבודה בשטח במד"א, אנשים בכל מיני מצבים.',
      "לפני שלוש שנים קיבלתי מחשב יד שנייה, והתחלתי ללמוד לבד. חודשיים, אחר כך שנתיים פול-סטאק, ושנה בסטארטאפ בניו יורק.",
      "מאז אני נווד. שנתיים בתאילנד, היום באנגליה - תמיד בתנועה, תמיד יוצר.",
      "מה שלא השתנה: אני לוקח את מה שיש בראש, ומוציא אותו החוצה. וזה מה שאני עושה גם בשבילך.",
    ],
  },
  hats: [
    {
      name: "בונה",
      tagline: "הרעיון שבראש שלך - יוצא לאוויר.",
      body: "יש לך רעיון שלא מפסיק לרוץ לך בראש, אבל נשאר שם. אני בונה אותו איתך, צעד-צעד, עד שהוא חי באמת.",
    },
    {
      name: "יוצר",
      tagline: "שזה יראה וירגיש כמו שדמיינת.",
      body: "מפחד שזה ייצא חובבני? אני דואג שכל פרט, כל תנועה וכל תחושה יהיו מדויקים - שהדבר שלך יופיע ברמה שמגיעה לו.",
    },
    {
      name: "מלווה",
      tagline: "אני לא בונה לך אתר. אני מלווה אותך.",
      body: "מבין מי עומד מולי, ועוזר לך להוציא את מה שיש לך בראש אל העולם.",
    },
    {
      name: "נווד",
      tagline: "לא משנה איפה אתה. אני איתך.",
      body: "מכל מקום בעולם, זמין וגמיש - בלי גבולות של מיקום או שעה. העבודה נעה סביב החיים שלך, לא הפוך.",
    },
  ],
  work: {
    kicker: "עבודות",
    title: "מה יצא לי מהראש",
    subtitle: "דברים שבניתי, יצרתי, וליוויתי",
    preview: "[תצוגה]",
    types: { build: "בנייה", content: "תוכן", guide: "ליווי" },
    projects: [
      { name: "פלטפורמה דיגיטלית", type: "build", oneLiner: "רעיון שהיה בראש של מישהו - היום מוצר חי שאנשים משתמשים בו." },
      { name: "סדרת תוכן", type: "content", oneLiner: "סיפור שנבנה נכון, ונשאר לאנשים בראש." },
      { name: "ליווי מרעיון למוצר", type: "guide", oneLiner: "מאיפה שהם התחילו - ולאן הגיעו כשליוויתי אותם." },
      { name: "מוצר דיגיטלי", type: "build", oneLiner: "עוד דבר שיצא מהראש אל העולם." },
    ],
  },
  connect: {
    kicker: "המסע ממשיך",
    headline: "יש לך רעיון, פרויקט, או סתם רוצה לדבר?",
    subtext: "אני כאן בשביל בדיוק זה. בוא נוציא אותו לאוויר.",
    cta: "עקוב אחרי המסע",
    note: "כל מה שאני בונה, יוצר ומלווה - קורה שם. עונה לכל הודעה.",
  },
  footer: {
    tagline: "בונה · יוצר · מלווה · נווד - מכל מקום בעולם",
    links: { instagram: "אינסטגרם", story: "המסע", work: "עבודות" },
    copyright: "© 2026 קים קרול · נבנה בתנועה.",
  },
  map: { thailand: "תאילנד", israel: "ישראל", england: "אנגליה" },
  media: { project: "פרויקט", video: "וידאו", image: "תמונה" },
  ui: { skip: "דלג לתוכן", toLang: "EN" },
};

const en: Content = {
  hero: {
    eyebrow: "Builder · Creator · Mentor · Nomad",
    headlineLine1: "I don't fit",
    headlinePre: "in ",
    headlineHi: "one",
    headlinePost: " box",
    subheadline: "Kim Kroll - builder, creator, and mentor. I take what's in your head, and bring it out into the world.",
    ctaPrimary: "Follow the journey",
    ctaSecondary: "What I do",
    scroll: "Scroll",
    wordmark: "Kim Kroll",
  },
  story: {
    kicker: "The story",
    title: "The journey",
    kickers: ["Where I started", "The leap", "In motion", "The thread"],
    beats: [
      "For most of my life I wasn't in this world. Restaurants, field work as a medic, people in every kind of situation.",
      "Three years ago I got a second-hand laptop and started teaching myself. Two months, then two years of full-stack, and a year at a startup in New York.",
      "Since then I've been a nomad. Two years in Thailand, today in England - always in motion, always creating.",
      "What never changed: I take what's in the head, and bring it out. And that's exactly what I do for you.",
    ],
  },
  hats: [
    {
      name: "Builder",
      tagline: "The idea in your head - out into the open.",
      body: "You've got an idea that won't stop running through your head, but it stays there. I build it with you, step by step, until it's truly alive.",
    },
    {
      name: "Creator",
      tagline: "So it looks and feels the way you imagined.",
      body: "Afraid it'll come out amateur? I make sure every detail, every motion and every feeling is precise - so your thing shows up at the level it deserves.",
    },
    {
      name: "Mentor",
      tagline: "I don't build you a website. I walk beside you.",
      body: "I understand who's standing in front of me, and help you bring what's in your head out into the world.",
    },
    {
      name: "Nomad",
      tagline: "No matter where you are. I'm with you.",
      body: "From anywhere in the world, available and flexible - no limits of place or time zone. The work moves around your life, not the other way around.",
    },
  ],
  work: {
    kicker: "Work",
    title: "What came out of my head",
    subtitle: "Things I've built, created, and guided",
    preview: "[preview]",
    types: { build: "Build", content: "Content", guide: "Guidance" },
    projects: [
      { name: "Digital platform", type: "build", oneLiner: "An idea that lived in someone's head - today a live product people use." },
      { name: "Content series", type: "content", oneLiner: "A story built right, that stays in people's minds." },
      { name: "From idea to product", type: "guide", oneLiner: "Where they started - and where they got to with me alongside." },
      { name: "Digital product", type: "build", oneLiner: "One more thing out of the head and into the world." },
    ],
  },
  connect: {
    kicker: "The journey continues",
    headline: "Got an idea, a project, or just want to talk?",
    subtext: "That's exactly what I'm here for. Let's bring it to life.",
    cta: "Follow the journey",
    note: "Everything I build, create and guide - it happens there. I answer every message.",
  },
  footer: {
    tagline: "Builder · Creator · Mentor · Nomad - from anywhere in the world",
    links: { instagram: "Instagram", story: "The journey", work: "Work" },
    copyright: "© 2026 Kim Kroll · Built in motion.",
  },
  map: { thailand: "Thailand", israel: "Israel", england: "England" },
  media: { project: "project", video: "video", image: "image" },
  ui: { skip: "Skip to content", toLang: "עב" },
};

export const CONTENT: Record<Lang, Content> = { he, en };

/** A hat with its structural data merged with the current language's copy. */
export type ResolvedHat = (typeof HATS_META)[number] & HatCopy;

export function resolveHats(lang: Lang): ResolvedHat[] {
  return HATS_META.map((meta, i) => ({ ...meta, ...CONTENT[lang].hats[i] }));
}
