import { createFileRoute } from "@tanstack/react-router";
import { Heart, Compass, Sparkles, Shield } from "lucide-react";
import wavesImg from "@/assets/waves.jpg";

export const Route = createFileRoute("/enfoque")({
  head: () => ({
    meta: [
      { title: "Enfoque terapéutico — Alexander Bonilla" },
      { name: "description", content: "Un enfoque psicológico basado en evidencia, integrador y profundamente humano. Respeto, escucha y herramientas creativas." },
      { property: "og:title", content: "Enfoque terapéutico" },
      { property: "og:description", content: "Terapia basada en evidencia, integradora y humana." },
    ],
    links: [{ rel: "canonical", href: "/enfoque" }],
  }),
  component: Approach,
});

const pillars = [
  { icon: Heart, title: "Cercanía", desc: "Construimos un vínculo de confianza donde puedas mostrarte sin máscaras." },
  { icon: Shield, title: "Seguridad", desc: "Un espacio libre de juicios, confidencial y respetuoso de tus tiempos." },
  { icon: Compass, title: "Evidencia", desc: "Integro herramientas validadas científicamente, adaptadas a cada persona." },
  { icon: Sparkles, title: "Creatividad", desc: "Uso recursos lúdicos y creativos para que el proceso sea cercano y profundo." },
];

function Approach() {
  return (
    <>
      <section className="relative bg-gradient-warm py-20 overflow-hidden">
        <img src={wavesImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Enfoque</p>
          <h1 className="font-display text-5xl md:text-6xl text-balance">Mi forma de acompañar</h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Una terapia integradora, cálida y basada en evidencia. Donde la persona siempre va primero.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="rounded-3xl bg-card border border-border/60 p-7">
                <div className="h-11 w-11 rounded-2xl bg-secondary text-primary flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl text-balance">¿Qué puedes esperar?</h2>
          <div className="mt-10 space-y-6 text-left">
            {[
              { n: "01", t: "Primer contacto", d: "Una conversación breve para conocernos y ver si encajamos." },
              { n: "02", t: "Sesión inicial", d: "Escucho tu motivo de consulta y exploramos qué necesitas." },
              { n: "03", t: "Proceso a tu ritmo", d: "Diseñamos juntos el camino, con objetivos claros y flexibles." },
              { n: "04", t: "Cierre y autonomía", d: "Te acompaño hasta que sientas que tienes las herramientas para continuar." },
            ].map((s) => (
              <div key={s.n} className="flex gap-6 rounded-3xl bg-card border border-border/60 p-6">
                <span className="font-display text-3xl text-primary">{s.n}</span>
                <div>
                  <h3 className="font-display text-xl">{s.t}</h3>
                  <p className="text-muted-foreground mt-1">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
