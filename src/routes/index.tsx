import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, CheckCircle2, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import wavesImg from "@/assets/waves.jpg";
import careImg from "@/assets/care.jpg";
import { services } from "@/lib/services";
import { WHATSAPP_URL } from "@/lib/contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alexander Bonilla — Psicólogo Clínico | Terapia humana y cercana" },
      { name: "description", content: "Psicólogo clínico. Terapia online y presencial para ansiedad, autoestima, regulación emocional, neurodivergencias y más. Un espacio seguro y libre de juicios." },
      { property: "og:title", content: "Alexander Bonilla — Psicólogo Clínico" },
      { property: "og:description", content: "Un espacio seguro y humano para tu bienestar emocional." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-warm">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <img src={wavesImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary/80 mb-6">
              <Sparkles className="h-3.5 w-3.5" /> Psicología clínica
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-foreground text-balance">
              Un espacio seguro para <em className="text-primary not-italic font-medium">sentir, pensar y crecer.</em>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Acompañamiento psicológico cercano y libre de juicios para niños, adolescentes y adultos jóvenes. Terapia online y presencial.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm hover:opacity-90 transition"
              >
                <MessageCircle className="h-4 w-4" /> Agendar por WhatsApp
              </a>
              <Link
                to="/servicios"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-6 py-3.5 text-sm hover:border-primary transition"
              >
                Ver servicios <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs text-muted-foreground">
              {["Atención online", "Consulta presencial", "Enfoque basado en evidencia"].map((t) => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 bg-accent/20 rounded-[3rem] blur-2xl" />
            <img
              src={heroImg}
              alt="Espacio de terapia cálido y luminoso"
              width={1536}
              height={1280}
              className="relative rounded-[2.5rem] shadow-2xl object-cover aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Mi propuesta</p>
        <h2 className="font-display text-4xl md:text-5xl text-balance leading-tight">
          La terapia puede sentirse humana, cálida y profundamente personal.
        </h2>
        <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
          Combino herramientas psicológicas basadas en evidencia con una mirada empática y creativa.
          Aquí no hay juicios: solo un acompañamiento auténtico para ayudarte a entenderte mejor y vivir con más bienestar.
        </p>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-3">Servicios</p>
            <h2 className="font-display text-4xl md:text-5xl">Áreas en las que acompaño</h2>
          </div>
          <Link to="/servicios" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.title}
                className="group rounded-3xl bg-card border border-border/60 p-7 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* APPROACH */}
      <section className="bg-gradient-soft py-24">
        <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <img
            src={careImg}
            alt="Cuidado y crecimiento emocional"
            width={1280}
            height={1280}
            loading="lazy"
            className="rounded-[2.5rem] aspect-square object-cover shadow-xl"
          />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Mi enfoque</p>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance">
              Cada proceso es único. Mi mirada, siempre humana.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Trabajo desde la calidez y el respeto, integrando herramientas basadas en evidencia con
              una atención sensible a tu historia, tus tiempos y tus emociones.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Escucha empática y libre de juicios",
                "Intervenciones basadas en evidencia científica",
                "Mirada respetuosa de la neurodiversidad",
                "Acompañamiento creativo y personalizado",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-foreground/80">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/enfoque"
              className="mt-8 inline-flex items-center gap-2 text-primary hover:underline"
            >
              Conocer mi enfoque <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-balance">
          ¿Listo para dar el primer paso?
        </h2>
        <p className="mt-5 text-muted-foreground text-lg max-w-xl mx-auto">
          Reservar una primera sesión es simple. Te respondo personalmente y juntos encontramos el mejor momento para conversar.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" /> Escribir por WhatsApp
          </a>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm hover:border-primary"
          >
            Formulario de contacto
          </Link>
        </div>
      </section>
    </>
  );
}
