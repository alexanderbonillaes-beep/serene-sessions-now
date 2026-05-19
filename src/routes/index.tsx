import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Sparkles, MapPin, Mail, Instagram, Clock, Calendar } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import wavesImg from "@/assets/waves.jpg";
import careImg from "@/assets/care.jpg";
import { services } from "@/lib/services";
import { EMAIL, INSTAGRAM_URL, INSTAGRAM_HANDLE, ADDRESS, MAP_EMBED_URL, MAP_LINK } from "@/lib/contact";
import { ReviewsSection } from "@/components/site/ReviewsSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alexander Bonilla — Psicólogo Clínico | Terapia humana y cercana" },
      { name: "description", content: "Psicólogo clínico en La Serena. Terapia presencial para ansiedad, autoestima, regulación emocional, neurodivergencias y más. Un espacio seguro y libre de juicios." },
      { property: "og:title", content: "Alexander Bonilla — Psicólogo Clínico" },
      { property: "og:description", content: "Un espacio seguro y humano para tu bienestar emocional." },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const posts = [
  { title: "Cómo identificar señales de ansiedad en la vida diaria", excerpt: "Pequeños indicadores que muchas veces pasamos por alto y que pueden hablarnos de nuestro estado emocional.", tag: "Ansiedad" },
  { title: "Autoestima: construirla desde adentro", excerpt: "La autoestima no es algo que se tiene o no se tiene. Es algo que se cultiva, día a día, con prácticas concretas.", tag: "Autoestima" },
  { title: "Acompañar la neurodivergencia con respeto", excerpt: "Una mirada centrada en las fortalezas, no en lo que falta. Estrategias para familias y personas TEA.", tag: "Neurodiversidad" },
];

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
              Acompañamiento psicológico cercano y libre de juicios para niños, adolescentes y adultos jóvenes. Atención presencial en La Serena.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/agendarsesion"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm hover:opacity-90 transition"
              >
                <Calendar className="h-4 w-4" /> Agendar sesión
              </Link>
              <a
                href="#servicios"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 backdrop-blur px-6 py-3.5 text-sm hover:border-primary transition"
              >
                Ver servicios <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-xs text-muted-foreground">
              {["Consulta presencial", "Enfoque basado en evidencia", "Mirada humana y cálida"].map((t) => (
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

      {/* SOBRE MÍ */}
      <section id="sobre-mi" className="scroll-mt-24 mx-auto max-w-5xl px-6 py-24 grid md:grid-cols-2 gap-12 items-start">
        <img src={careImg} alt="" loading="lazy" className="rounded-[2.5rem] aspect-[4/5] object-cover shadow-xl" />
        <div className="space-y-6 text-foreground/85 leading-relaxed">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Sobre mí</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight">Hola, soy Alexander.</h2>
          <p>
            Soy psicólogo clínico y mi vocación es acompañar procesos de cambio desde la cercanía,
            el respeto y una mirada profundamente humana.
          </p>
          <div>
            <h3 className="font-display text-2xl mb-2 text-foreground">Mi experiencia</h3>
            <p>
              He acompañado a niños, adolescentes y adultos jóvenes en procesos relacionados con ansiedad,
              autoestima, regulación emocional, neurodivergencias —especialmente TEA— y desarrollo personal.
            </p>
          </div>
          <div>
            <h3 className="font-display text-2xl mb-2 text-foreground">Por qué hago esto</h3>
            <p>
              Porque creo que todos merecemos un lugar donde sentirnos comprendidos. Y porque he visto cómo,
              con apoyo adecuado, las personas florecen y descubren recursos que no sabían que tenían.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="scroll-mt-24 bg-gradient-soft py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-3">Servicios</p>
            <h2 className="font-display text-4xl md:text-5xl">Áreas en las que acompaño</h2>
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
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.topics.map((t) => (
                      <span key={t} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground/80">
                        {t}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link to="/agendarsesion" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm hover:opacity-90">
              <Calendar className="h-4 w-4" /> Reservar una sesión
            </Link>
          </div>
        </div>
      </section>

      {/* ENFOQUE */}
      <section id="enfoque" className="scroll-mt-24 mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
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
        </div>
        <img
          src={careImg}
          alt="Cuidado y crecimiento emocional"
          loading="lazy"
          className="rounded-[2.5rem] aspect-square object-cover shadow-xl"
        />
      </section>

      {/* RESEÑAS */}
      <ReviewsSection />

      {/* BLOG */}
      <section id="blog" className="scroll-mt-24 bg-gradient-soft py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-3">Blog</p>
            <h2 className="font-display text-4xl md:text-5xl">Espacio psicoeducativo</h2>
            <p className="mt-4 text-muted-foreground">Reflexiones y herramientas para entendernos mejor.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((p) => (
              <article key={p.title} className="rounded-3xl bg-card border border-border/60 p-7 hover:border-primary/40 hover:-translate-y-1 transition-all">
                <span className="text-xs uppercase tracking-widest text-primary/80">{p.tag}</span>
                <h3 className="font-display text-2xl mt-3 mb-3 leading-snug">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
                <span className="mt-5 inline-block text-sm text-primary">Próximamente</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="scroll-mt-24 mx-auto max-w-6xl px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-3">Contacto</p>
          <h2 className="font-display text-4xl md:text-5xl">Conversemos</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            El primer paso suele ser el más difícil. Estoy aquí para escucharte.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"
               className="flex items-center gap-4 rounded-3xl bg-card border border-border/60 p-6 hover:border-primary transition">
              <div className="h-12 w-12 rounded-2xl bg-secondary text-primary flex items-center justify-center shrink-0">
                <Instagram className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl">Instagram</h3>
                <p className="text-sm text-muted-foreground">{INSTAGRAM_HANDLE}</p>
              </div>
            </a>
            <a href={`mailto:${EMAIL}`}
               className="flex items-center gap-4 rounded-3xl bg-card border border-border/60 p-6 hover:border-primary transition">
              <div className="h-12 w-12 rounded-2xl bg-secondary text-primary flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl">Email</h3>
                <p className="text-sm text-muted-foreground break-all">{EMAIL}</p>
              </div>
            </a>
            <a href={MAP_LINK} target="_blank" rel="noreferrer"
               className="flex items-start gap-4 rounded-3xl bg-card border border-border/60 p-6 hover:border-primary transition">
              <div className="h-12 w-12 rounded-2xl bg-secondary text-primary flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl">Consulta</h3>
                <p className="text-sm text-muted-foreground">{ADDRESS}</p>
                <p className="text-xs text-primary mt-1">Ver en Google Maps →</p>
              </div>
            </a>
            <div className="flex items-center gap-4 rounded-3xl bg-card border border-border/60 p-6">
              <div className="h-12 w-12 rounded-2xl bg-secondary text-primary flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xl">Horarios</h3>
                <p className="text-sm text-muted-foreground">Lun a Vie · 17:30 – 21:30</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-border/60 shadow-xl">
            <iframe
              title="Ubicación consulta — Av. Balmaceda 2195, La Serena"
              src={MAP_EMBED_URL}
              width="100%"
              height="480"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div className="text-center mt-14">
          <Link to="/agendarsesion" className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm hover:opacity-90">
            <Calendar className="h-4 w-4" /> Agendar sesión
          </Link>
        </div>
      </section>
    </>
  );
}
