import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import careImg from "@/assets/care.jpg";

export const Route = createFileRoute("/sobre-mi")({
  head: () => ({
    meta: [
      { title: "Sobre mí — Alexander Bonilla, Psicólogo Clínico" },
      { name: "description", content: "Conoce a Alexander Bonilla, psicólogo clínico dedicado a un acompañamiento humano, cálido y basado en evidencia." },
      { property: "og:title", content: "Sobre mí — Alexander Bonilla" },
      { property: "og:description", content: "Un acompañamiento humano y profesional para tu bienestar emocional." },
    ],
    links: [{ rel: "canonical", href: "/sobre-mi" }],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="bg-gradient-warm py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Sobre mí</p>
          <h1 className="font-display text-5xl md:text-6xl text-balance">
            Hola, soy Alexander.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Soy psicólogo clínico y mi vocación es acompañar procesos de cambio desde la cercanía,
            el respeto y una mirada profundamente humana.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 grid md:grid-cols-2 gap-12 items-start">
        <img src={careImg} alt="" loading="lazy" className="rounded-[2.5rem] aspect-[4/5] object-cover shadow-xl" />
        <div className="space-y-6 text-foreground/85 leading-relaxed">
          <div>
            <h2 className="font-display text-3xl mb-3">Mi historia</h2>
            <p>
              Desde el inicio de mi formación entendí que la psicología no es solo técnica: es vínculo.
              Es estar presente, escuchar sin prisa y construir junto a cada persona un espacio en el que pueda
              mostrarse tal cual es.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl mb-3">Mi experiencia</h2>
            <p>
              He acompañado a niños, adolescentes y adultos jóvenes en procesos relacionados con ansiedad,
              autoestima, regulación emocional, neurodivergencias —especialmente TEA— y desarrollo personal.
            </p>
          </div>
          <div>
            <h2 className="font-display text-3xl mb-3">Por qué hago esto</h2>
            <p>
              Porque creo que todos merecemos un lugar donde sentirnos comprendidos. Y porque he visto cómo,
              con apoyo adecuado, las personas florecen y descubren recursos que no sabían que tenían.
            </p>
          </div>
          <Link to="/contacto" className="inline-flex items-center gap-2 text-primary hover:underline">
            Conversemos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
