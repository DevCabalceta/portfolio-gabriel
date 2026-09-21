// Contact details from the supplied CV and Gabriel's confirmed messages.
export const profile = {
  name: "Gabriel Cabalceta",
  email: "cabalceta.gabriel.2001@gmail.com",
  linkedin: "https://www.linkedin.com/in/devcabalceta/",
  github: "https://github.com/DevCabalceta",
  whatsapp: "https://wa.me/50683442305",
  portfolio: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-gabriel-lemon.vercel.app").replace(/\/$/, ""),
  resume: "/documents/CV-GabrielCabalceta.pdf",
  portrait: "/images/gabriel-cabalceta.png",
};
