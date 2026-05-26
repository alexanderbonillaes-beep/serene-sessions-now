import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CreditCard, CheckCircle2, Download, X } from "lucide-react";
import { PAYMENT_URL } from "@/lib/contact";

export const Route = createFileRoute("/agendarsesion")({
  head: () => ({
    meta: [
      { title: "Agendar sesión — Reserva tu cita | Alexander Bonilla" },
      { name: "description", content: "Reserva tu sesión de terapia con Alexander Bonilla de forma rápida y sencilla a través de Calendly." },
      { property: "og:title", content: "Agendar sesión — Alexander Bonilla" },
      { property: "og:description", content: "Reserva tu sesión de terapia presencial." },
    ],
    links: [{ rel: "canonical", href: "/agendarsesion" }],
  }),
  component: AgendarSesion,
});

function AgendarSesion() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);
  const [scheduled, setScheduled] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    if (!widgetRef.current) return;
    const existing = document.getElementById("calendly-widget-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "calendly-widget-script";
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const isCalendlyEvent = (e: MessageEvent) =>
      typeof e.data === "object" &&
      e.data !== null &&
      "event" in e.data &&
      typeof (e.data as { event: string }).event === "string" &&
      (e.data as { event: string }).event.indexOf("calendly.") === 0;

    const handler = async (e: MessageEvent) => {
      if (!isCalendlyEvent(e)) return;
      const event = (e.data as { event: string }).event;
      if (event === "calendly.event_scheduled") {
        setCapturing(true);
        // Esperar a que Calendly pinte la pantalla "Ha programado su cita"
        await new Promise((r) => setTimeout(r, 3500));
        try {
          if (widgetRef.current) {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(widgetRef.current, {
              backgroundColor: "#ffffff",
              useCORS: true,
              allowTaint: true,
              foreignObjectRendering: true,
              scale: 2,
              logging: false,
            });
            // Detectar si la captura quedó esencialmente en blanco (iframe cross-origin)
            const ctx = canvas.getContext("2d");
            let isBlank = false;
            if (ctx) {
              const sample = ctx.getImageData(
                Math.floor(canvas.width / 2),
                Math.floor(canvas.height / 2),
                10,
                10,
              ).data;
              let variance = 0;
              for (let i = 0; i < sample.length; i += 4) {
                variance += Math.abs(sample[i] - 255) + Math.abs(sample[i + 1] - 255) + Math.abs(sample[i + 2] - 255);
              }
              isBlank = variance < 50;
            }
            if (!isBlank) {
              setSnapshot(canvas.toDataURL("image/png"));
            } else {
              setSnapshot(null); // se usará fallback diseñado en el modal
            }
          }
        } catch (err) {
          console.warn("No se pudo capturar el widget", err);
          setSnapshot(null);
        }
        setCapturing(false);
        setScheduled(true);
      }
    };


    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const downloadPdf = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 40;

      // Encabezado
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Confirmación de agendamiento", margin, margin + 6);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(110, 110, 110);
      pdf.text("Alexander Bonilla Espinoza — Psicólogo Clínico", margin, margin + 26);
      pdf.text(`Generado: ${new Date().toLocaleString("es-CL")}`, margin, margin + 42);

      // Línea separadora
      pdf.setDrawColor(220, 220, 220);
      pdf.line(margin, margin + 56, pageW - margin, margin + 56);

      let cursorY = margin + 80;

      // Bloque de confirmación
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text("✓ Ha programado su cita", margin, cursorY);
      cursorY += 22;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(90, 90, 90);
      pdf.text(
        "Se ha enviado a su correo electrónico una invitación de calendario",
        margin,
        cursorY,
      );
      cursorY += 14;
      pdf.text("con los detalles de la sesión.", margin, cursorY);
      cursorY += 30;

      // Caja de detalles
      pdf.setDrawColor(220, 220, 220);
      pdf.setFillColor(250, 249, 246);
      pdf.roundedRect(margin, cursorY, pageW - margin * 2, 110, 8, 8, "FD");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(40, 40, 40);
      pdf.text("Psicoterapia Clínica", margin + 16, cursorY + 24);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(70, 70, 70);
      pdf.text("Alexander Bonilla Espinoza", margin + 16, cursorY + 44);
      pdf.text(
        "Av. Balmaceda 2195, Edificio Portal Las Higueras",
        margin + 16,
        cursorY + 62,
      );
      pdf.text("Piso 4, Oficina 401 — Temuco", margin + 16, cursorY + 78);

      pdf.setFontSize(9);
      pdf.setTextColor(140, 140, 140);
      pdf.text(
        "Revisa tu correo electrónico para ver fecha y hora exactas.",
        margin + 16,
        cursorY + 100,
      );

      cursorY += 140;

      // Si tenemos snapshot del widget, agregarlo
      if (snapshot) {
        try {
          const img = new Image();
          img.src = snapshot;
          await new Promise((res, rej) => {
            img.onload = res;
            img.onerror = rej;
          });
          const maxW = pageW - margin * 2;
          const maxH = pageH - cursorY - margin;
          const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
          const w = img.width * ratio;
          const h = img.height * ratio;
          pdf.addImage(snapshot, "PNG", (pageW - w) / 2, cursorY, w, h);
        } catch (e) {
          console.warn("No se pudo añadir la captura al PDF", e);
        }
      }

      // Pie
      pdf.setFontSize(9);
      pdf.setTextColor(160, 160, 160);
      pdf.text(
        "Documento generado automáticamente — alexanderbonilla.cl",
        margin,
        pageH - 20,
      );

      pdf.save(`agendamiento-${Date.now()}.pdf`);
    } catch (err) {
      console.error("Error generando PDF", err);
      alert("No se pudo generar el PDF. Por favor intenta nuevamente.");
    }
  };


  const closeModal = () => {
    setScheduled(false);
  };

  return (
    <>
      <section className="bg-gradient-warm py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/80 mb-4">Reservas</p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-balance">Agenda tu sesión</h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Selecciona el día y horario que mejor te acomode. Te espero con calidez y profesionalismo.
          </p>
        </div>
      </section>

      <section className="w-full px-0 sm:px-4 py-8 md:py-12">
        <div
          ref={widgetRef}
          className="calendly-inline-widget w-full h-[1000px] md:h-[900px]"
          data-url="https://calendly.com/alexander-bonillaes/1hr?primary_color=4db6ac&hide_gdpr_banner=1"
          style={{ minWidth: 280 }}
        />
      </section>

      {capturing && !scheduled && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="rounded-2xl bg-card border border-border/60 px-6 py-4 text-sm text-muted-foreground shadow-xl">
            Capturando tu agendamiento…
          </div>
        </div>
      )}

      {scheduled && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-foreground/50 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-2xl bg-card border border-border/60 rounded-3xl shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              aria-label="Cerrar"
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-secondary/70 hover:bg-secondary text-foreground/70 hover:text-foreground flex items-center justify-center transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="p-6 sm:p-8 md:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary text-primary px-4 py-1.5 text-xs mb-4">
                <CheckCircle2 className="h-4 w-4" /> ¡Tu cita fue agendada!
              </div>

              {snapshot ? (
                <div className="rounded-2xl overflow-hidden border border-border/60 bg-background mb-5">
                  <img src={snapshot} alt="Captura de tu agendamiento" className="w-full h-auto" />
                </div>
              ) : (
                <div
                  ref={fallbackRef}
                  className="rounded-2xl border border-border/60 bg-background p-6 sm:p-8 mb-5 text-center"
                >
                  <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-1">Ha programado su cita</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Se ha enviado a su correo electrónico una invitación de calendario.
                  </p>
                  <div className="text-left rounded-xl border border-border/60 bg-card p-5 space-y-2">
                    <p className="font-display text-lg text-foreground">Psicoterapia Clínica</p>
                    <p className="text-sm text-foreground/80">Alexander Bonilla Espinoza</p>
                    <p className="text-sm text-foreground/80">
                      Av. Balmaceda 2195, Edificio Portal Las Higueras, Piso 4, Oficina 401
                    </p>
                    <p className="text-xs text-muted-foreground pt-2">
                      Revisa tu correo para ver fecha y hora exactas.
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={downloadPdf}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-background text-primary px-6 py-3 text-sm hover:bg-primary/5 transition mb-8"
              >
                <Download className="h-4 w-4" /> Descargar agendamiento en PDF
              </button>


              <div className="border-t border-border/60 pt-6">
                <h2 className="font-display text-2xl mb-3">¿Ya agendaste?</h2>
                <p className="text-muted-foreground mb-6">
                  Realiza el pago de tu sesión de forma segura a través de Flow. Te enviaré la confirmación una vez procesado.
                </p>
                <a
                  href={PAYMENT_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm hover:opacity-90 transition"
                >
                  <CreditCard className="h-4 w-4" /> Pagar sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
