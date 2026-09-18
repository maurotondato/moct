import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/hero/hero";
import { Problems } from "@/components/sections/problems";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { WhyUs } from "@/components/sections/why-us";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd, servicesJsonLd } from "@/lib/seo";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader dict={dict} locale={locale} />
      <main className="flex-1">
        <Hero dict={dict} locale={locale} />
        <Problems dict={dict} />
        <Services dict={dict} locale={locale} />
        <Process dict={dict} />
        <WhyUs dict={dict} />
        <Faq dict={dict} />
        <Contact dict={dict} />
      </main>
      <SiteFooter dict={dict} locale={locale} />

      {/* Datos estructurados de la home: habilitan el resultado desplegable de
          preguntas en Google y describen el catálogo de servicios. */}
      <JsonLd data={[faqJsonLd(dict), servicesJsonLd(dict, locale)]} />
    </>
  );
}
