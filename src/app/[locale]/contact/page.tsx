import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { site, whatsappLink } from "@/config/site";
import { PageShell, ProseSections } from "@/components/layout/page-shell";
import { Reveal } from "@/components/ui/reveal";
import { JsonLd } from "@/components/seo/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.pages.contact.title,
    description: dict.pages.contact.intro,
    path: "contact",
  });
}

export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const page = dict.pages.contact;
  const whatsapp = whatsappLink(dict.contact.whatsappMessage);

  const channels = [
    whatsapp
      ? { label: page.whatsappLabel, value: `+${site.contact.whatsapp}`, href: whatsapp, external: true }
      : null,
    { label: page.emailLabel, value: site.contact.email, href: `mailto:${site.contact.email}`, external: false },
    site.social.instagram
      ? { label: page.instagramLabel, value: "@moctlab", href: site.social.instagram, external: true }
      : null,
  ].filter((channel) => channel !== null);

  return (
    <PageShell
      dict={dict}
      locale={locale}
      eyebrow={page.eyebrow}
      title={page.title}
      intro={page.intro}
    >
      <Reveal delay={200}>
        <div className="mt-12 max-w-2xl rounded-card border border-white/10 bg-ink-950/60 p-8">
          <h2 className="font-mono text-fluid-xs tracking-[0.25em] text-chalk-muted uppercase">
            {page.channels}
          </h2>
          <ul className="mt-6 space-y-5">
            {channels.map((channel) => (
              <li key={channel.label}>
                <a
                  href={channel.href}
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group flex flex-wrap items-baseline gap-x-4 gap-y-1"
                >
                  <span className="min-w-24 font-mono text-fluid-xs tracking-[0.2em] text-chalk-muted uppercase">
                    {channel.label}
                  </span>
                  <span className="text-fluid-lg text-accent-soft transition-colors group-hover:text-accent">
                    {channel.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <Link
            href={`/${locale}#contacto`}
            className="group mt-8 inline-flex items-center gap-2 text-fluid-sm text-chalk-dim transition-colors hover:text-accent-soft"
          >
            {page.formCta}
            <span
              aria-hidden
              className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </Reveal>

      <ProseSections sections={page.sections} />

      {/* ContactPage: le dice al buscador que acá están los datos de contacto. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: page.title,
          description: page.intro,
          url: absoluteUrl(`/${locale}/contact`),
          mainEntity: { "@id": `${site.url}/#organization` },
        }}
      />
    </PageShell>
  );
}
