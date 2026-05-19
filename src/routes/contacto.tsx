import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Instagram, Mail, Clock, Monitor, MapPin, Send } from "lucide-react";
import { WHATSAPP_URL, INSTAGRAM_URL, EMAIL } from "@/lib/contact";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Agenda tu sesión | Alexander Bonilla" },
      { name: "description", content: "Reserva una sesión de terapia. Atención online y presencial. Contacto por WhatsApp, Instagram o formulario." },
      { property: "og:title", content: "Contacto — Alexander Bonilla" },
      { property: "og:description", content: "Agenda tu sesión de terapia." },
    ],
    links: [{ rel: "canonical", href: "/contacto" }],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="bg-gradient-warm py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Contacto</p>
          <h1 className="font-display text-5xl md:text-6xl text-balance">Conversemos</h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            El primer paso suele ser el más difícil. Estoy aquí para escucharte.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 grid lg:grid-cols-5 gap-10">
        <aside className="lg:col-span-2 space-y-5">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer"
             className="block rounded-3xl bg-primary text-primary-foreground p-7 hover:opacity-95 transition">
            <MessageCircle className="h-6 w-6 mb-3" />
            <h3 className="font-display text-2xl mb-1">WhatsApp</h3>
            <p className="text-sm opacity-90">Respuesta personal en horario laboral</p>
          </a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"
             className="block rounded-3xl bg-card border border-border/60 p-7 hover:border-primary transition">
            <Instagram className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-display text-2xl mb-1">Instagram</h3>
            <p className="text-sm text-muted-foreground">Contenido psicoeducativo</p>
          </a>
          <a href={`mailto:${EMAIL}`}
             className="block rounded-3xl bg-card border border-border/60 p-7 hover:border-primary transition">
            <Mail className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-display text-2xl mb-1">Email</h3>
            <p className="text-sm text-muted-foreground break-all">{EMAIL}</p>
          </a>
          <div className="rounded-3xl bg-card border border-border/60 p-7 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-primary" /> Lun a Vie · 9:00 – 19:00</div>
            <div className="flex items-center gap-3"><Monitor className="h-4 w-4 text-primary" /> Sesiones online</div>
            <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary" /> Consulta presencial</div>
          </div>
        </aside>

        <form
          className="lg:col-span-3 rounded-3xl bg-card border border-border/60 p-8 md:p-10 space-y-5"
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
        >
          <h2 className="font-display text-3xl">Envíame un mensaje</h2>
          <p className="text-muted-foreground text-sm">Te responderé personalmente lo antes posible.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nombre" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <Field label="Teléfono (opcional)" name="phone" />
          <div>
            <label className="block text-sm mb-2 text-foreground/80">¿En qué puedo acompañarte?</label>
            <textarea
              required
              rows={5}
              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm hover:opacity-90"
          >
            <Send className="h-4 w-4" /> Enviar mensaje
          </button>
          {sent && (
            <p className="text-sm text-primary">¡Gracias! Tu mensaje fue enviado. Te responderé pronto.</p>
          )}
        </form>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm mb-2 text-foreground/80">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
      />
    </div>
  );
}
