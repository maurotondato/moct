import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { buildMetadata } from "@/lib/seo";
import { PageShell, ProseSections } from "@/components/layout/page-shell";

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
    title: dict.pages.privacy.title,
    description: dict.pages.privacy.intro,
    path: "privacy",
  });
}

export default async function PrivacyPage({
  params,
}: PageProps<"/[locale]/privacy">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const page = dict.pages.privacy;

  return (
    <PageShell
      dict={dict}
      locale={locale}
      eyebrow={page.eyebrow}
      title={page.title}
      intro={page.intro}
    >
      <p className="mt-6 font-mono text-fluid-xs text-chalk-muted">
        {page.updatedLabel}: {page.updated}
      </p>
      <ProseSections sections={page.sections} />
    </PageShell>
  );
}
