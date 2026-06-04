import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { ThemeProvider } from "@/lib/hooks/useTheme";
import "./globals.css";

// next/font/google self-hosts these into the build output at build time:
// no runtime CDN request, no layout shift. It injects the CSS variables that
// globals.css and tailwind.config.ts reference.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "aurora — light that moves like sky",
  description:
    "A single-page landing experience whose hero is a hand-written GLSL fragment shader rendered on raw WebGL2. Procedural, theme-reactive, and accessible.",
  openGraph: {
    title: "aurora",
    description:
      "A hand-written GLSL aurora rendered on raw WebGL2. Next.js, TypeScript, Tailwind.",
    type: "website",
  },
};

// Runs before first paint to set the theme class from storage or system
// preference, eliminating the dark/light flash on load.
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("aurora-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${syne.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
