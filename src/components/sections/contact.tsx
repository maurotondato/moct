"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { site, whatsappLink } from "@/config/site";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/utils";

/**
 * Un sitio estático no puede mandar mails por sí solo, así que el envío va a un
 * servicio externo configurado por entorno (Formspree, Web3Forms y similares
 * aceptan este mismo POST con JSON).
 *
 * Si no hay endpoint configurado, el formulario no se rompe: arma un mailto con
 * todo el contenido ya cargado y abre el cliente de correo. Así la web sirve
 * desde el primer día y activarlo después es pegar una variable.
 */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

type Status = "idle" | "sending" | "success" | "error";
type Errors = Partial<Record<"name" | "email" | "message", string>>;

export function Contact({ dict }: { dict: Dictionary }) {
  const t = dict.contact.form;
  const whatsapp = whatsappLink(dict.contact.whatsappMessage);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Trampa para robots: un humano nunca completa un campo que no ve.
    if (data.get("website")) return;

    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };

    const nextErrors: Errors = {};
    if (!values.name) nextErrors.name = t.required;
    if (!values.email) nextErrors.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email)) {
      nextErrors.email = t.invalidEmail;
    }
    if (!values.message) nextErrors.message = t.required;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const subject = `Consulta desde la web — ${values.name}`;
    const body = [
      `Nombre: ${values.name}`,
      `Email: ${values.email}`,
      values.company ? `Empresa: ${values.company}` : null,
      "",
      values.message,
    ]
      .filter(Boolean)
      .join("\n");

    if (!FORM_ENDPOINT) {
      window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...values, subject }),
      });
      if (!response.ok) throw new Error(String(response.status));
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  // Panel oscuro propio: con el campo tecnológico detrás, un fondo casi
  // transparente dejaba los textos de ayuda ilegibles.
  const fieldClass =
    "w-full rounded-xl border bg-ink-950/70 px-4 py-3.5 text-fluid-sm text-chalk outline-none transition-all duration-300 placeholder:text-chalk-muted focus:border-accent focus:bg-ink-950/85 focus:ring-4 focus:ring-accent/15";

  return (
    <section
      id="contacto"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/5 py-28 md:py-36"
    >
      {/* Halo violeta: cierra la página con el mismo color con el que abre. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-1/3 left-1/2 -z-10 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full opacity-20 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, transparent 65%)",
        }}
      />

      <div className="container-moct">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionHeading
              eyebrow={dict.contact.eyebrow}
              title={dict.contact.title}
              subtitle={dict.contact.subtitle}
            />

            <Reveal delay={200}>
              <div className="mt-10">
                <p className="text-fluid-sm text-chalk-muted">
                  {t.fallbackNote}
                </p>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="group mt-2 inline-flex items-center gap-2 text-fluid-lg font-medium text-accent-soft transition-colors hover:text-accent"
                >
                  {site.contact.email}
                  <span
                    aria-hidden
                    className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>

                {whatsapp ? (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-6 inline-flex items-center gap-3 rounded-pill border border-white/15 bg-white/[0.03] px-5 py-3 text-fluid-sm text-chalk transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-accent/50 hover:bg-accent/10"
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="size-4 fill-current text-accent-soft"
                    >
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.82c0 4.54-3.69 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.15.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z" />
                    </svg>
                    WhatsApp
                    <span
                      aria-hidden
                      className="text-chalk-muted transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                ) : null}
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Campo trampa: oculto para personas, visible para robots. */}
              <div aria-hidden className="absolute -left-[9999px]">
                <label>
                  No completar
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="name"
                  label={t.name}
                  placeholder={t.namePlaceholder}
                  autoComplete="name"
                  error={errors.name}
                  className={fieldClass}
                />
                <Field
                  id="email"
                  type="email"
                  label={t.email}
                  placeholder={t.emailPlaceholder}
                  autoComplete="email"
                  error={errors.email}
                  className={fieldClass}
                />
              </div>

              <Field
                id="company"
                label={t.company}
                placeholder={t.companyPlaceholder}
                autoComplete="organization"
                className={fieldClass}
              />

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-fluid-sm text-chalk-dim"
                >
                  {t.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder={t.messagePlaceholder}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={cn(
                    fieldClass,
                    "resize-y",
                    errors.message ? "border-red-400/60" : "border-white/10",
                  )}
                />
                {errors.message ? (
                  <p id="message-error" className="mt-2 text-fluid-xs text-red-300">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-pill bg-accent px-8 py-4 text-fluid-sm font-medium text-white shadow-[0_0_0_1px_rgb(78_20_255/0.5),0_10px_40px_-12px_rgb(78_20_255/0.8)] transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:bg-accent-bright disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {status === "sending" ? t.sending : t.submit}
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                >
                  →
                </span>
              </button>

              {/* aria-live: el lector de pantalla anuncia el resultado sin mover el foco. */}
              <p
                aria-live="polite"
                className={cn(
                  "text-fluid-sm",
                  status === "success" && "text-accent-soft",
                  status === "error" && "text-red-300",
                )}
              >
                {status === "success" ? t.success : null}
                {status === "error" ? t.error : null}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  className,
  type = "text",
  ...props
}: {
  id: string;
  label: string;
  error?: string;
  className: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-fluid-sm text-chalk-dim">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(className, error ? "border-red-400/60" : "border-white/10")}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-fluid-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
