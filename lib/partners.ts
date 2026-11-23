// Partner listings and page copy for /partners. Add a new entry to PARTNERS
// (and, if needed, a logo under public/partners/) to list another partner.

import type { Lang } from "./i18n";

export type Partner = {
  id: string;
  name: string;
  url: string;
  logoSrc?: string;
  logoWidth?: number;
  logoHeight?: number;
  blurb: Record<Lang, string>;
  cta: Record<Lang, string>;
};

export const PARTNERS: Partner[] = [
  {
    id: "las-vegas-kids-directory",
    name: "Las Vegas Kids' Directory",
    url: "https://lvkidsdirectory.com",
    logoSrc: "/partners/las-vegas-kids-directory.jpg",
    logoWidth: 1400,
    logoHeight: 871,
    blurb: {
      en: "A parent-run, woman-owned resource guide for Southern Nevada families. Every issue features new local partners, so there's always something you haven't tried yet.",
      es: "Una guía de recursos dirigida por papás y de propiedad de una mujer, para familias del sur de Nevada. Cada edición presenta socios locales nuevos, así que siempre hay algo que todavía no has probado.",
    },
    cta: {
      en: "Visit the directory",
      es: "Visita el directorio",
    },
  },
];

export const PARTNERS_COPY: Record<
  Lang,
  {
    metaTitle: string;
    metaDesc: string;
    ogTitle: string;
    h1: string;
    intro: string;
    closerPre: string;
    closerLink: string;
    closerPost: string;
  }
> = {
  en: {
    metaTitle: "Partners | Vegas Kiddos",
    metaDesc:
      "Local Las Vegas family resources we team up with, starting with the Las Vegas Kids' Directory, a parent-run guide for Southern Nevada families.",
    ogTitle: "Vegas Kiddos Partners",
    h1: "Our partners",
    intro:
      "Good family stuff in Vegas is scattered all over town. These are the local folks we team up with. They send parents our way, and we send parents theirs.",
    closerPre: "Run a Las Vegas family resource and want to swap links? Reach out through our ",
    closerLink: "contact page",
    closerPost: ".",
  },
  es: {
    metaTitle: "Socios | Vegas Kiddos",
    metaDesc:
      "Recursos familiares locales de Las Vegas con los que nos asociamos, empezando por Las Vegas Kids' Directory, una guía dirigida por papás para familias del sur de Nevada.",
    ogTitle: "Socios de Vegas Kiddos",
    h1: "Nuestros socios",
    intro:
      "Los planes familiares en Vegas están repartidos por toda la ciudad. Estos son los grupos locales con los que nos asociamos. Ellos nos mandan papás, y nosotros les mandamos papás a ellos.",
    closerPre: "¿Tienes un recurso familiar en Las Vegas y quieres intercambiar enlaces? Escríbenos por nuestra ",
    closerLink: "página de contacto",
    closerPost: ".",
  },
};
