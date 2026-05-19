import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Calendar } from "lucide-react";
import logo from "@/assets/logo.png";

const sections = [
  { hash: "#sobre-mi", label: "Sobre mí" },
  { hash: "#servicios", label: "Servicios" },
  { hash: "#enfoque", label: "Enfoque" },
  { hash: "#resenas", label: "Reseñas" },
  { hash: "#blog", label: "Blog" },
  { hash: "#contacto", label: "Contacto" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/75 border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <img src={logo} alt="Alexander Bonilla — Psicólogo Clínico" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm text-foreground/70 hover:text-primary transition-colors"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: true }}
          >
            Inicio
          </Link>
          {sections.map((s) => (
            <a
              key={s.hash}
              href={`/${s.hash}`}
              className="text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/agendarsesion"
            className="inline-flex items-center gap-2 text-sm rounded-full bg-primary text-primary-foreground px-4 md:px-5 py-2.5 hover:opacity-90 transition"
            onClick={() => setOpen(false)}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Agendar sesión</span>
            <span className="sm:hidden">Agendar</span>
          </Link>
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="px-6 py-4 flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="py-2 text-foreground/80"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: true }}
            >
              Inicio
            </Link>
            {sections.map((s) => (
              <a
                key={s.hash}
                href={`/${s.hash}`}
                onClick={() => setOpen(false)}
                className="py-2 text-foreground/80"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
