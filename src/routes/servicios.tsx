import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Monitor, MapPin } from "lucide-react";
import { services } from "@/lib/services";
import { WHATSAPP_URL } from "@/lib/contact";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios — Terapia psicológica online y presencial" },
      { name: "description", content: "Servicios de psicología clínica para niños, adolescentes y adultos jóvenes: ansiedad, autoestima, neurodivergencias, regulación emocional y más." },
      { property: "og:title", content: "Servicios terapéuticos — Alexander Bonilla" },
      { property: "og:description", content: "Terapia personalizada, online y presencial." },
    ],
    links: [{ rel: "canonical", href: "/servicios" }],
  }),
  component: Services,
});

function Services() {
  return (
    <>
      <section className="bg-gradient-warm py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Servicios</p>
          <h1 className="font-display text-5xl md:text-6xl text-balance">Terapia que te acompaña</h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Sesiones personalizadas en un entorno seguro, cálido y profesional.
            Puedes elegir entre atención online o presencial.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article key={s.title} className="rounded-3xl bg-card border border-border/60 p-8 hover:border-primary/40 transition">
                <div className="flex items-start gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-secondary text-primary flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-2xl mb-2">{s.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {s.topics.map((t) => (
                        <span key={t} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground/80">
                          {t}
                        </span>
                      ))}
                    </div>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <MessageCircle className="h-4 w-4" /> Consultar disponibilidad
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl bg-card border border-border/60 p-8">
            <Monitor className="h-6 w-6 text-primary mb-4" />
            <h3 className="font-display text-2xl mb-2">Sesiones online</h3>
            <p className="text-muted-foreground leading-relaxed">
              Atención por videollamada desde cualquier lugar. Misma calidez y profundidad que una sesión presencial,
              con la comodidad de tu espacio.
            </p>
          </div>
          <div className="rounded-3xl bg-card border border-border/60 p-8">
            <MapPin className="h-6 w-6 text-primary mb-4" />
            <h3 className="font-display text-2xl mb-2">Sesiones presenciales</h3>
            <p className="text-muted-foreground leading-relaxed">
              Un consultorio pensado para que te sientas en confianza desde que entras.
              Coordina conmigo el horario que mejor se ajuste a ti.
            </p>
          </div>
        </div>
        <div className="text-center mt-10">
          <Link to="/contacto" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm hover:opacity-90">
            Reservar una sesión
          </Link>
        </div>
      </section>
    </>
  );
}
