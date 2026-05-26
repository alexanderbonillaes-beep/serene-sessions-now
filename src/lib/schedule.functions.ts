import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  imageDataUrl: z.string().min(50),
});

export const extractSchedule = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Eres un extractor. Recibes una captura de pantalla de la pantalla de confirmación de Calendly tras agendar una cita. Devuelve SOLO un JSON válido con dos campos: \"dateText\" (la fecha tal como aparece, p.ej. '11:00 - jueves 28 de mayo de 2026') y \"timeText\" (la hora si está separada, sino vacía). Si no puedes leerlo, devuelve {\"dateText\":\"\",\"timeText\":\"\"}. No incluyas explicaciones.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Extrae la fecha y hora del agendamiento visibles en esta captura." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("AI gateway error", res.status, txt);
      return { dateText: "", timeText: "" };
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content ?? "{}";
    try {
      const parsed = JSON.parse(content) as { dateText?: string; timeText?: string };
      return {
        dateText: typeof parsed.dateText === "string" ? parsed.dateText : "",
        timeText: typeof parsed.timeText === "string" ? parsed.timeText : "",
      };
    } catch {
      return { dateText: "", timeText: "" };
    }
  });
