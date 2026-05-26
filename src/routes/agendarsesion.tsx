import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CreditCard, CheckCircle2, Download, X } from "lucide-react";
import { PAYMENT_URL } from "@/lib/contact";
import { extractSchedule } from "@/lib/schedule.functions";
import logoUrl from "@/assets/logo.png";


const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

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
  const [scheduleInfo, setScheduleInfo] = useState<{ dateText: string; timeText: string } | null>(null);
  const extractScheduleFn = useServerFn(extractSchedule);

  const sessionLocation = "La Serena, Región de Coquimbo";


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

  const createConfirmationImage = async () => {
    const canvas = document.createElement("canvas");
    const scale = 2;
    const width = 760;
    const height = 1040;
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.scale(scale, scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Logo en la parte superior
    try {
      const logo = await loadImage(logoUrl);
      const logoH = 70;
      const logoW = (logo.width / logo.height) * logoH;
      ctx.drawImage(logo, 54, 40, logoW, logoH);
    } catch (e) {
      console.warn("No se pudo cargar el logo", e);
    }

    const drawText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(" ");
      let line = "";
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        if (ctx.measureText(testLine).width > maxWidth && line) {
          ctx.fillText(line, x, y);
          line = word;
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
      return y;
    };

    const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };

    const topOffset = 130;

    ctx.fillStyle = "#2b2b2b";
    ctx.font = "700 30px Arial, sans-serif";
    ctx.fillText("Confirmación de agendamiento", 54, topOffset + 40);

    ctx.fillStyle = "#666666";
    ctx.font = "400 17px Arial, sans-serif";
    ctx.fillText("Alexander Bonilla Espinoza - Psicólogo Clínico", 54, topOffset + 75);
    ctx.fillText(`Generado: ${new Date().toLocaleString("es-CL")}`, 54, topOffset + 102);

    ctx.strokeStyle = "#dedbd2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(54, topOffset + 135);
    ctx.lineTo(width - 54, topOffset + 135);
    ctx.stroke();

    ctx.fillStyle = "#2b2b2b";
    ctx.font = "700 26px Arial, sans-serif";
    ctx.fillText("Ha programado su cita", 54, topOffset + 190);

    ctx.fillStyle = "#5f5f5f";
    ctx.font = "400 18px Arial, sans-serif";
    drawText(
      "Se ha enviado a su correo electrónico una invitación de calendario con los detalles de la sesión.",
      54,
      topOffset + 225,
      width - 108,
      26,
    );

    const boxY = topOffset + 305;
    ctx.fillStyle = "#fbfaf7";
    ctx.strokeStyle = "#dedbd2";
    ctx.lineWidth = 2;
    drawRoundedRect(54, boxY, width - 108, 245, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#2b2b2b";
    ctx.font = "700 22px Arial, sans-serif";
    ctx.fillText("Psicoterapia Clínica", 82, boxY + 52);

    ctx.fillStyle = "#4a4a4a";
    ctx.font = "400 18px Arial, sans-serif";
    ctx.fillText("Alexander Bonilla Espinoza", 82, boxY + 88);
    ctx.fillText(sessionLocation, 82, boxY + 122);

    ctx.fillStyle = "#7a7a7a";
    ctx.font = "400 16px Arial, sans-serif";
    drawText("Revisa tu correo electrónico para ver fecha y hora exactas.", 82, boxY + 168, width - 164, 24);

    ctx.fillStyle = "#999999";
    ctx.font = "400 14px Arial, sans-serif";
    ctx.fillText("Documento generado automáticamente - alexanderbonilla.cl", 54, height - 48);

    return canvas.toDataURL("image/png");
  };

  const downloadPdf = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const confirmationImage = await createConfirmationImage();

      if (!confirmationImage) {
        throw new Error("No se pudo preparar la confirmación.");
      }

      pdf.addImage(confirmationImage, "PNG", 0, 0, pageW, pageH);

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
                    <p className="text-sm text-foreground/80">{sessionLocation}</p>
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
