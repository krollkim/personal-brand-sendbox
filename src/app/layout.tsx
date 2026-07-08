import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LangProvider } from "@/lib/i18n";
import Chrome from "@/components/Chrome";

// Applies the saved language before paint so there's no he→en flash on load.
const NO_FLASH = `try{var l=localStorage.getItem('lang');if(l==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr';}}catch(e){}`;

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-heebo",
  display: "swap",
});

const TITLE = "קים קרול — בונה, יוצר, מלווה, נווד";
const DESCRIPTION =
  "קים קרול. אדם שלא נכנס לקופסה אחת — בונה, יוצר, ומלווה. לוקח את מה שיש לך בראש, ומוציא אותו אל העולם.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning className={heebo.variable}>
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
        <LangProvider>
          <Chrome />
          <SmoothScroll />
          {children}
        </LangProvider>
      </body>
    </html>
  );
}
