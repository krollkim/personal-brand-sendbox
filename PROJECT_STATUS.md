# PROJECT STATUS — אתר התדמית של קים קרול

> עודכן לאחרונה: **2026-06-29**
> מסמך מצב-נתון חי. מתעדכן בכל אבן דרך. ה-source of truth לתוכן/טון הוא `kim_kroll_brand.json`.

---

## 1. סקירה כללית

אתר **פרסונל ברנד רב-כובעי** לקים קרול — האדם, לא הסטודיו. עברית, RTL מלא, עמוד-אחד עם גלילה.
הכיוון: **FULL WOW** ברמת Awwwards / 21st.dev — סצנות 3D אימרסיביות, כוריאוגרפיית גלילה נועזת.
החוט המקשר: *"לוקח את מה שיש בראש — ומוציא אותו החוצה"*. כובעים: **בונה · יוצר · מלווה · נווד**.

> ⚠️ הטון הישן ב-JSON (ממוקד-אתרים, מינימליסטי) **נדרס** לטובת הכיוון הרב-כובעי וה-wow. coherence חשוב, מינימליזם לא.

### 🎯 מטרה והחלטות נעולות (ראיון, 2026-06-29)

**המטרה:** מגרש-משחקים/ביטוי אישי שגורם לעמיתים ולקהל רחב להרגיש *"רמה אחרת — מוכשר ויצירתי"* וללחוץ **עקוב באינסטגרם**. החוט: *"אדם של אנשים שעושה טכנולוגיה"*. ה-wow הוא האסטרטגיה, לא קישוט. ההוק לעקיבה = **המסע / מאחורי הקלעים**.

| החלטה | נעול |
|-------|------|
| Conversion | **עקיבה באינסטגרם בלבד** — אין יצירת-קשר/"שכרו אותי" בשום מקום |
| CTA ראשי בהירו | **"עקוב אחרי המסע"** (אינסטגרם); משני: "מה אני עושה" → גלילה לכובעים. להסיר "בוא נכיר" |
| סקשן `work` | **פיד מסע/תוכן** (BTS, יצירות, סגנון אינסטגרם) — לא פורטפוליו רשמי |
| סקשן `connect` | **finale של "עקוב אחרי המסע"** — לא "דבר איתי" |
| חום אנושי | **קים יספק נכסים אישיים** (וידאו/תמונות, דיבור למצלמה, BTS) לאיזון ה-wow |

**נתונים שסופקו (2026-06-29):**
- 🔗 **אינסטגרם:** `https://www.instagram.com/kroll_k/` (יעד ה-follow). זמין לחיווט ה-CTA.
- **טיקטוק:** יהיה, אבל **כרגע בלי פוסטים** → בינתיים אינסטגרם הוא ה-CTA החי; טיקטוק יתווסף כשיהיה תוכן.
- **אימייל:** לא צריך (ירד). פוטר עדיין לא בסקופ (אנחנו על hat2).
- **וידאו warmth (קים יצרף):** "מי אני" → story · "מה אני עושה" → hats/what-i-do · בקרוב "מה תקבלו ממני" → beat של ערך/תועלת. ממופים יפה לסקשנים.

### 🎨 פיבוט ויזואלי — איפוס מלא ללבן (2026-06-30)

הכיוון הכהה/אימרסיבי-3D **הוחלף**. עכשיו: **מינימליזם לבן + design system אמיתי**. כל האתר (Hero + כובעים) **נבנה מחדש** בשפה הלבנה. ה-wow מגיע מ**איפוק פרימיום** (טיפוגרפיה, whitespace, תנועת GSAP מכוונת, ורגעי pearlescent נדירים) — לא מ-3D כהה.

**Design system (נעול · tokens ב-`tailwind.config.ts` · עמוד ייחוס `/style`):**
| תפקיד | צבע |
|-------|-----|
| Primary (שולט) | לבן `#FFFFFF` |
| Secondary | סגול `#6B3FA0` (+deep `#4E2C77`, soft `#8A5FBE`) |
| Accent (נגיעות בלבד) | פוקסיה `#E11D8B` — נקודה/קו/מילה, לעולם לא ממלא |
| Pearlescent (wow נדיר) | גרדיאנט סגול→פוקסיה `bg-pearl` |
| טקסט | ink `#0A0A0A` · muted `#6B6B72` · surface `#F7F5FA` |

**קבצים שמוחלפים (כהים — superseded):** `hero/scene/*` (R3F), `hats/Atmosphere` הכהה, `hats/VideoAtmosphere`. נשארים בינתיים אך לא בשימוש בשפה החדשה.

---

## 2. Stack טכנולוגי

| תחום | טכנולוגיה |
|------|-----------|
| Framework | Next.js 14.2.35 (App Router) + React 18 + TypeScript |
| Styling | Tailwind CSS 3.4 |
| אנימציה | **GSAP 3.12** + `@gsap/react` (useGSAP) + **ScrollTrigger** |
| 3D | React Three Fiber 8 + drei 9 + postprocessing 2 + three 0.169 |
| פונט | Heebo (next/font) |
| בדיקות ויזואליות | Playwright (dev-only, screenshots) |

> **GSAP הוא דרישה קשיחה, לא Framer Motion** — Framer גרם ל-flickering על מסכי 120Hz. כל אנימציה: transform/opacity בלבד, GPU, עם fallback ל-`prefers-reduced-motion`/מובייל.

---

## 3. מבנה קבצים

```
kim_kroll_brand.json            # source of truth לתוכן/טון
public/images/hero/hero.jpg     # דיוקן (גלימה סגולה, רקע בז' #A29B90)

src/app/
  layout.tsx                    # RTL, lang=he, Heebo, metadata
  page.tsx                      # <Hero/> + <Hats/>
  globals.css                   # base + scene-fade-in keyframes

src/components/sections/
  Hero.tsx                      # ה-hero: סצנת 3D + overlay טקסט + intro GSAP
  Hats.tsx                      # סקשן הכובעים: כוריאוגרפיית ScrollTrigger

src/components/hero/
  Monogram.tsx                  # מונוגרמת KK לאנימציית הפתיחה
  scene/
    HeroScene.tsx               # R3F Canvas + Bloom + frameloop pause
    Backdrop.tsx                # רקע גרדיאנט טאופ→סגול
    Portrait3D.tsx              # הדיוקן כ-plane עם feather alpha
    FloatingObjects.tsx         # גאומטריה סגולה מרחפת בעומק
    Particles.tsx               # חלקיקי אבק

src/components/hats/
  World.tsx                     # פאנל עולם מלא-מסך (number/name/tagline/body/media)
  Atmosphere.tsx                # אווירה משותפת: variant "grid" | "fluid"
  HatMedia.tsx                  # placeholder ממוסגר לפי type (project/video/image)

src/lib/
  hats.ts                       # נתוני הכובעים מה-JSON + HAT_DIRECTIONS
```

### קבצים legacy (לא בשימוש כרגע — מועמדים לניקוי)
- `src/components/hero/FloatingShapes.tsx` — מהגרסה הדו-ממדית של ה-hero (לפני ה-3D).
- `src/components/ui/shader-background.tsx` + `shader-background-demo.tsx` — shader ה-plasma שהוטמע ואז הוחלף בסצנת R3F.

---

## 4. סטטוס לפי סקשן

| # | סקשן | סטטוס | הערות |
|---|------|-------|-------|
| — | **Hero** | ✅ מאושר | סצנת 3D, דיוקן מוטמע, קופי חדש, intro מונוגרמה |
| 01 | **hat: בונה** | ✅ מאושר | **לבן-מינימלי**, layout "split" (טקסט ימין/כרטיס שמאל), grid עדין, נגיעות פוקסיה |
| → | מעבר hat1→hat2 (ימינה) | ✅ נבנה | pinned horizontal, עכשיו לבן→לבן (נקי) |
| 02 | **hat: יוצר** | ✅ מאושר | **לבן-מינימלי**, layout "showcase" (כרטיס ימין מוטה/טקסט שמאל), צורות אורגניות. הווידאו הוסר |

> **תבנית שהוקמה:** כל כובע = `layout` ייחודי ב-`World.tsx` (split / showcase / ...) — מבנה, מיקומים וצורות משתנים בין סקשנים, בתוך אותה שפה לבנה + פלטה. hat3/hat4 יקבלו layouts חדשים.
| 03 | **hat: מלווה** | ⏳ הבא בתור | warm; מעבר hat2→hat3 = **למטה** |
| 04 | **hat: נווד** | ⏳ ממתין | dark; מעבר hat3→hat4 = **ימינה** |
| — | story (המסע) | ⏳ לא התחיל | scroll-driven storytelling |
| — | work (מה יצא לי מהראש) | ⏳ לא התחיל | גלריית עבודות |
| — | connect (סגירה) | ⏳ לא התחיל | CTA נועז, שיא סגול |
| — | footer | ⏳ לא התחיל | |

---

## 5. ה-Hero — פירוט

- **סצנת R3F** (`HeroScene`): רקע גרדיאנט (טאופ במרכז → סגול בקצוות), דיוקן כ-`plane` עם feather alpha (מוטמע בסביבה), גאומטריה סגולה מרחפת בעומק (לפני ומאחורי הדיוקן), חלקיקים, ו-**Bloom** לזוהר. **parallax לעכבר**.
- **Intro (GSAP):** מונוגרמת KK מופיעה → מתרחבת ומתמוססת → טקסט נחשף מילה-מילה.
- **קופי:** כותרת *"אני לא נכנס לקופסה אחת."* (אחת. בסגול) · sub *"קים קרול — בונה, יוצר, ומלווה..."* · CTA *"בוא נכיר"* / *"מה אני עושה"* · eyebrow *"בונה · יוצר · מלווה · נווד"*.
- **ביצועים:** `frameloop` עובר ל-`never` כשה-hero יוצא מהמסך (IntersectionObserver). DPR מוגבל ל-1.5.
- **Fallback:** מובייל / weak GPU / reduced-motion → דיוקן סטטי עם feather דו-ממדי (ללא Canvas).
- **הערה פתוחה:** המשתמש רוצה בעתיד **cutout מלא** (PNG שקוף ב-remove.bg) במקום ה-feather על רקע הבז'. החלפה של שורה אחת ב-`Portrait3D` כשהקובץ יסופק → `public/images/hero/hero-cutout.png`.

---

## 6. סקשן הכובעים (hats) — הכוריאוגרפיה

**עיקרון:** ארבעה "עולמות" מלא-מסך, אחד גלוי בכל רגע. **אווירה אחת משותפת** (`Atmosphere`) שמשנה גוון/treatment לפי העולם — לא 4 סצנות 3D. ה-wow מהכוריאוגרפיה והגוון.

### כיווני המעבר (מתחלפים — זו ההפתעה)
`HAT_DIRECTIONS = [down, right, down, right]` (ב-`lib/hats.ts`)
- hero → hat1: **למטה** (תמיד)
- hat1 → hat2: **ימינה** ✅ נבנה (pinned horizontal)
- hat2 → hat3: **למטה** ⏳
- hat3 → hat4: **ימינה** ⏳

### העולמות
| כובע | accent | base | variant | tone |
|------|--------|------|---------|------|
| 01 בונה | `#4E2C77` | `#2A1A40` | grid (כהה, פרספקטיבי) | dark (טקסט לבן) |
| 02 יוצר | `#9A6FD0` | `#EDE6F5` | fluid (בהיר, blobs) | light (טקסט כהה) |
| 03 מלווה | `#C8794E` (חם) | TBD | TBD | TBD |
| 04 נווד | `#2E2A40` (כהה) | TBD | TBD | TBD |

### מימוש נוכחי (hat1 ↔ hat2)
- **כניסת hat1:** `reveal` **חד-פעמי** (`toggleActions: play`, מופעל ב-`top 65%`) — לא scrub-coupled, מסיים תמיד.
- **HOLD:** ~`0.6` מה-timeline הנעוץ → **~740px** של בידוד מוחלט ל-hat1 לפני שההחלקה מתחילה.
- **SLIDE:** pinned, `track` רוחב 200vw מחליק `-100vw` (pan ימינה), עם parallax בעומק (אווירה לאט, תוכן מהר, צורות מהצדדים).
- **`dir="ltr"`** על ה-track (אחרת ב-RTL ה-overflow מתחיל מימין ומציג את הפאנל הלא-נכון) + עטיפת כל World ב-`dir="rtl"`.
- **Overscan** (-14%) לאווירה + רקע סקשן כהה → אין הצצות/seams בקצוות.
- **Fallback:** מובייל / reduced-motion → עולמות **מוערמים אנכית**, בלי pin/החלקה.

---

## 7. בעיות ידועות / נקודות תשומת-לב

1. **ScrollTrigger + HMR לא מסתדרים** — אחרי עריכת קוד כוריאוגרפיה צריך **hard-refresh (Ctrl+Shift+R)**. בטעינה נקייה הכל עובד.
2. **`?force3d=1`** — query param לכפיית סצנת ה-3D (כי ב-headless `hardwareConcurrency` נמוך → ברירת מחדל fallback). `?force3d=0` לכפיית הסטטי.
3. **cutout דיוקן** — ממתין ל-PNG שקוף מהמשתמש (לא חוסם).
4. **קבצי legacy** (סעיף 3) — לא בשימוש, מועמדים לניקוי.
5. **אזהרות webpack cache** (`Caching failed... ENOENT rename .pack.gz`) — נעילות קבצים של Windows, **לא מזיקות**.

---

## 8. איך מריצים / בודקים

```bash
npm run dev          # שרת פיתוח על :3000
npm run build        # build לפרודקשן
```
צילומי בדיקה: סקריפט Playwright ב-scratchpad מצלם desktop (`?force3d=1`) + מובייל בעמדות גלילה שונות.

---

## 9. הצעד הבא

1. **אימות hat1↔hat2** ע"י המשתמש (עם hard-refresh) — לוודא שהבידוד מרגיש נכון.
2. **בניית hat3 "מלווה"** (warm/soft/human) + מעבר hat2→hat3 **למטה** (הוספת פאזה אנכית ל-timeline הנעוץ).
3. אחר כך hat4 "נווד" (מעבר ימינה).
4. ואז: story → work → connect → footer.

**עיקרון עבודה:** בונים סקשן/כובע אחד, עוצרים, מראים, מאשרים — ורק אז ממשיכים.
