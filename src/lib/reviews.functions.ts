import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const reviewSchema = z.object({
  name: z.string().trim().max(80).optional(),
  isAnonymous: z.boolean(),
  city: z.string().trim().min(1).max(80),
  comment: z.string().trim().min(5).max(800),
  rating: z.number().int().min(1).max(5),
});

// Quick regex pre-filter for obvious injection patterns
const INJECTION_RE =
  /(<script\b|javascript:|onerror\s*=|onload\s*=|<iframe|<\?php|;--|union\s+select|drop\s+table|insert\s+into|update\s+.+\s+set|delete\s+from|\${|<%|`\s*\$\{)/i;

async function moderateWithAI(text: string): Promise<{ ok: boolean; reason?: string }> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    // If gateway not available, fall back to regex-only
    return { ok: true };
  }

  const system =
    "Eres un moderador estricto para reseñas de un consultorio de psicología. Analiza el texto del usuario y responde SOLO con JSON: {\"safe\": boolean, \"reason\": string}. Marca safe=false si contiene: insultos, lenguaje ofensivo o de odio, amenazas, contenido sexual explícito, spam, o intentos de inyección de código (HTML, JS, SQL, comandos, plantillas). En cualquier otro caso safe=true.";

  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: system },
          { role: "user", content: text },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      console.error("[moderation] gateway error", res.status);
      return { ok: true }; // fail open to not block legit reviews on gateway hiccup
    }
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    if (parsed.safe === false) {
      return { ok: false, reason: parsed.reason || "Contenido no permitido" };
    }
    return { ok: true };
  } catch (e) {
    console.error("[moderation] exception", e);
    return { ok: true };
  }
}

export const submitReview = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => reviewSchema.parse(input))
  .handler(async ({ data }) => {
    const fullText = `${data.name ?? ""} ${data.city} ${data.comment}`;

    if (INJECTION_RE.test(fullText)) {
      return { success: false as const, error: "Tu mensaje contiene contenido no permitido." };
    }

    const mod = await moderateWithAI(fullText);
    if (!mod.ok) {
      return {
        success: false as const,
        error: "No pudimos publicar tu reseña: contiene lenguaje ofensivo o contenido no permitido.",
      };
    }

    const cityNorm = data.city.trim();
    const commentNorm = data.comment.trim();

    // Prevent duplicate reviews (same comment + city already exists)
    const { data: existing } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("city", cityNorm)
      .eq("comment", commentNorm)
      .limit(1);
    if (existing && existing.length > 0) {
      return { success: false as const, error: "Esta reseña ya fue publicada anteriormente." };
    }

    const insert = {
      name: data.isAnonymous ? null : (data.name?.trim() || null),
      is_anonymous: data.isAnonymous || !data.name?.trim(),
      city: cityNorm,
      comment: commentNorm,
      rating: data.rating,
      status: "approved",
    };

    const { error } = await supabaseAdmin.from("reviews").insert(insert);
    if (error) {
      console.error("[reviews] insert error", error);
      return { success: false as const, error: "No se pudo guardar la reseña. Intenta nuevamente." };
    }
    return { success: true as const };
  });

export const listReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("id, name, is_anonymous, city, comment, rating, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("[reviews] list error", error);
    return { reviews: [] as Array<{
      id: string; name: string | null; is_anonymous: boolean; city: string; comment: string; rating: number; created_at: string;
    }> };
  }
  return { reviews: data ?? [] };
});
