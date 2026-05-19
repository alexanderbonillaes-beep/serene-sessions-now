import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog psicoeducativo — Alexander Bonilla" },
      { name: "description", content: "Artículos y reflexiones sobre bienestar emocional, salud mental, ansiedad, autoestima y crecimiento personal." },
      { property: "og:title", content: "Blog — Alexander Bonilla" },
      { property: "og:description", content: "Contenido psicoeducativo cercano y claro." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Blog,
});

const posts = [
  { title: "Cómo identificar señales de ansiedad en la vida diaria", excerpt: "Pequeños indicadores que muchas veces pasamos por alto y que pueden hablarnos de nuestro estado emocional.", tag: "Ansiedad" },
  { title: "Autoestima: construirla desde adentro", excerpt: "La autoestima no es algo que se tiene o no se tiene. Es algo que se cultiva, día a día, con prácticas concretas.", tag: "Autoestima" },
  { title: "Acompañar la neurodivergencia con respeto", excerpt: "Una mirada centrada en las fortalezas, no en lo que falta. Estrategias para familias y personas TEA.", tag: "Neurodiversidad" },
];

function Blog() {
  return (
    <>
      <section className="bg-gradient-warm py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Blog</p>
          <h1 className="font-display text-5xl md:text-6xl text-balance">Espacio psicoeducativo</h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Reflexiones y herramientas para entendernos mejor.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <article key={p.title} className="rounded-3xl bg-card border border-border/60 p-7 hover:border-primary/40 hover:-translate-y-1 transition-all">
              <span className="text-xs uppercase tracking-widest text-primary/80">{p.tag}</span>
              <h2 className="font-display text-2xl mt-3 mb-3 leading-snug">{p.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
              <span className="mt-5 inline-block text-sm text-primary">Próximamente</span>
            </article>
          ))}
        </div>
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">¿Quieres que escriba sobre algún tema en particular?</p>
          <Link to="/contacto" className="inline-flex rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm hover:opacity-90">
            Sugerir un tema
          </Link>
        </div>
      </section>
    </>
  );
}
