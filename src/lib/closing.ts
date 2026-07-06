import brand from "../../kim_kroll_brand.json";

const b = brand as {
  sections: {
    connect: { headline_he: string; subtext_he: string };
    footer: { name_he: string; tagline_he: string };
  };
};

export const CONNECT = b.sections.connect;
export const FOOTER = b.sections.footer;

// The single conversion for the whole site: follow the journey on Instagram.
export const INSTAGRAM_URL = "https://www.instagram.com/kroll_k/";
