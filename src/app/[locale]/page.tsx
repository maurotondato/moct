import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/config/site";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <main className="relative flex flex-1 items-center overflow-hidden">
      <div className="bg-tech-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div
        className="pointer-events-none absolute top-[-20%] left-1/2 h-[60vh] w-[60vw] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, var(--color-accent-2) 55%, transparent 70%)",
        }}
      />

      <div className="container-moct relative py-32">
        <p className="font-mono text-fluid-xs tracking-[0.3em] text-accent uppercase">
          {dict.hero.eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl text-fluid-3xl leading-[0.95] font-semibold tracking-tight text-balance">
          {dict.hero.headline}{" "}
          <span className="text-gradient-brand">{dict.hero.headlineAccent}</span>
        </h1>
        <p className="mt-6 max-w-xl text-fluid-base text-chalk-dim text-pretty">
          {dict.hero.subhead}
        </p>
        <p className="mt-16 font-mono text-fluid-xs text-chalk-muted">
          {site.name} · base del proyecto lista — esperando logo y contenido
          para el diseño final.
        </p>
      </div>
    </main>
  );
}
