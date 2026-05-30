import { useEffect, useRef, useState } from "react";
import { Star, Loader2, Quote } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Review = {
  id: string;
  name: string | null;
  is_anonymous: boolean;
  city: string;
  comment: string;
  rating: number;
  created_at: string;
};

function Stars({ value, onChange, size = "h-6 w-6" }: { value: number; onChange?: (v: number) => void; size?: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = (hover || value) >= n;
        return (
          <button
            type="button"
            key={n}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => onChange && setHover(n)}
            onMouseLeave={() => onChange && setHover(0)}
            aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
            className={onChange ? "transition-transform hover:scale-110" : "cursor-default"}
            disabled={!onChange}
          >
            <Star className={`${size} ${active ? "fill-primary text-primary" : "text-muted-foreground/40"}`} />
          </button>
        );
      })}
    </div>
  );
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);

  const [rating, setRating] = useState(5);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [comment, setComment] = useState("");

  async function refresh() {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, name, is_anonymous, city, comment, rating, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(30);
    if (!error && data) setReviews(data as Review[]);
  }

  useEffect(() => {
    refresh();
  }, []);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!city.trim() || comment.trim().length < 5) {
      toast.error("Completa ciudad y un comentario de al menos 5 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("submit-review", {
        body: {
          name: isAnonymous ? undefined : name.trim() || undefined,
          isAnonymous,
          city: city.trim(),
          comment: comment.trim(),
          rating,
        },
      });
      if (error) throw error;
      if (res?.success) {
        toast.success("¡Gracias por tu reseña!");
        setName("");
        setCity("");
        setComment("");
        setRating(5);
        setIsAnonymous(false);
        refresh();
      } else {
        toast.error("Reseña no permitida", {
          description: res?.error || "Tu reseña contiene contenido ofensivo o no apropiado. Por favor, redáctala con respeto.",
          duration: 6000,
        });
      }

    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al enviar la reseña.");
    } finally {

      setLoading(false);
    }
  }

  // Duplicamos las reseñas para que el carrusel se vea continuo aunque haya pocas.
  const minCards = 8;
  const repeats = reviews.length > 0 ? Math.max(2, Math.ceil(minCards / reviews.length)) : 0;
  const marquee = Array.from({ length: repeats }, () => reviews).flat();

  // Auto-scroll lento con pausa al interactuar (swipe/drag/hover).
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || reviews.length === 0) return;

    let raf = 0;
    let last = performance.now();
    let pos = el.scrollLeft;
    const pxPerSec = 30; // velocidad lenta

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current && !isDraggingRef.current) {
        const half = el.scrollWidth / 2;
        if (half > 0) {
          pos += pxPerSec * dt;
          if (pos >= half) pos -= half;
          el.scrollLeft = pos;
        }
      } else {
        // El usuario movió el scroll manualmente; sincronizar.
        pos = el.scrollLeft;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const pause = () => {
      pausedRef.current = true;
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    };
    const resumeSoon = () => {
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = window.setTimeout(() => {
        pausedRef.current = false;
      }, 1500);
    };

    // Drag con mouse (desktop) — táctil ya funciona con overflow-x-auto.
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      // Solo para mouse/pen: el táctil usa scroll nativo.
      if (e.pointerType === "touch") {
        pause();
        return;
      }
      isDraggingRef.current = true;
      pause();
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onPointerUp = (e: PointerEvent) => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        try { el.releasePointerCapture(e.pointerId); } catch {}
      }
      resumeSoon();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);
    el.addEventListener("touchend", resumeSoon);
    el.addEventListener("wheel", () => { pause(); resumeSoon(); }, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("touchend", resumeSoon);
    };
  }, [reviews.length, marquee.length]);

  return (
    <section id="resenas" className="scroll-mt-24 py-24 bg-gradient-warm/40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-3">Reseñas</p>
          <h2 className="font-display text-4xl md:text-5xl">Lo que dicen quienes me han consultado</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Tu opinión es valiosa. Puedes dejarla con tu nombre o de forma totalmente anónima.
          </p>
        </div>

        {/* Carrusel */}
        {reviews.length > 0 ? (
          <div className="relative mb-16 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div
              ref={scrollerRef}
              className="flex gap-6 overflow-x-auto overflow-y-hidden no-scrollbar touch-pan-x cursor-grab active:cursor-grabbing"
              style={{ scrollbarWidth: "none" }}
            >
              {marquee.map((r, i) => (
                <article
                  key={`${r.id}-${i}`}
                  className="shrink-0 w-[280px] sm:w-[320px] md:w-[360px] rounded-3xl bg-card border border-border/60 p-6 shadow-sm select-none"
                >
                  <Quote className="h-6 w-6 text-primary/40 mb-3" />
                  <Stars value={r.rating} size="h-4 w-4" />
                  <p className="mt-4 text-sm text-foreground/85 leading-relaxed line-clamp-6">{r.comment}</p>
                  <div className="mt-5 pt-4 border-t border-border/60">
                    <p className="font-display text-base">{r.is_anonymous || !r.name ? "Anónimo" : r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.city}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground mb-16">Aún no hay reseñas. ¡Sé la primera persona en compartir!</p>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto rounded-3xl bg-card border border-border/60 p-8 shadow-lg space-y-6"
        >
          <h3 className="font-display text-2xl text-center">Deja tu reseña</h3>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Tu calificación</span>
            <Stars value={rating} onChange={setRating} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">
                Nombre {isAnonymous && <span className="text-muted-foreground font-normal">(oculto)</span>}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnonymous}
                maxLength={80}
                placeholder="Tu nombre"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Ciudad *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={80}
                required
                placeholder="Ej: La Serena"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm select-none cursor-pointer">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Publicar de forma anónima (la discreción es esencial)
          </label>

          <div>
            <label className="text-sm font-medium block mb-1.5">Tu comentario *</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              minLength={5}
              maxLength={800}
              required
              placeholder="Cuéntanos tu experiencia..."
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{comment.length}/800</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Enviando..." : "Publicar reseña"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Las reseñas se moderan automáticamente con IA para mantener un espacio seguro y respetuoso.
          </p>
        </form>
      </div>
    </section>
  );
}
