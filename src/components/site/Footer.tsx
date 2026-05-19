import { Link } from "@tanstack/react-router";
import { Instagram, MessageCircle, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { WHATSAPP_URL, INSTAGRAM_URL, EMAIL } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <img src={logo} alt="Alexander Bonilla" className="h-12 w-auto mb-4" />
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Acompañamiento psicológico cercano, humano y basado en evidencia. Un espacio seguro para crecer.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-4 text-foreground">Navegación</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/sobre-mi" className="hover:text-primary">Sobre mí</Link></li>
            <li><Link to="/servicios" className="hover:text-primary">Servicios</Link></li>
            <li><Link to="/enfoque" className="hover:text-primary">Enfoque</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/contacto" className="hover:text-primary">Contacto</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-4 text-foreground">Contacto</h4>
          <div className="flex gap-3 mb-4">
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp"
               className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"
               className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={`mailto:${EMAIL}`} aria-label="Email"
               className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition">
              <Mail className="h-4 w-4" />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">Atención online y presencial</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Alexander Bonilla · Psicólogo Clínico
      </div>
    </footer>
  );
}
