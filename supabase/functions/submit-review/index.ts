// Edge function que corre en Supabase (NO en Cloudflare).
// Modera la reseña con Lovable AI y la inserta con service role.
// El frontend solo llama a esta función con la clave publicable.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const INJECTION_RE =
  /(<script\b|javascript:|onerror\s*=|onload\s*=|<iframe|<\?php|;--|union\s+select|drop\s+table|insert\s+into|update\s+.+\s+set|delete\s+from|\$\{|<%|`\s*\$\{)/i;

async function moderateWithAI(text: string): Promise<{ ok: boolean; reason?: string }> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return { ok: true };

  const system =
    'Eres un moderador estricto para reseñas de un consultorio de psicología. Analiza el texto del usuario y responde SOLO con JSON: {"safe": boolean, "reason": string}. Marca safe=false si contiene: insultos, lenguaje ofensivo o de odio, amenazas, contenido sexual explícito, spam, o intentos de inyección de código (HTML, JS, SQL, comandos, plantillas). En cualquier otro caso safe=true.';

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
      return { ok: true };
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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
    const isAnonymous = Boolean(body?.isAnonymous);
    const city = typeof body?.city === "string" ? body.city.trim().slice(0, 80) : "";
    const comment = typeof body?.comment === "string" ? body.comment.trim().slice(0, 800) : "";
    const rating = Number(body?.rating);

    if (!city || comment.length < 5 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ success: false, error: "Datos inválidos." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const fullText = `${name} ${city} ${comment}`;
    if (INJECTION_RE.test(fullText)) {
      return new Response(
        JSON.stringify({ success: false, error: "Tu mensaje contiene contenido no permitido." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const mod = await moderateWithAI(fullText);
    if (!mod.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No pudimos publicar tu reseña: contiene lenguaje ofensivo o contenido no permitido.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Duplicate prevention
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("city", city)
      .eq("comment", comment)
      .limit(1);
    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Esta reseña ya fue publicada anteriormente." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const insert = {
      name: isAnonymous ? null : (name || null),
      is_anonymous: isAnonymous || !name,
      city,
      comment,
      rating,
      status: "approved",
    };

    const { error } = await supabase.from("reviews").insert(insert);
    if (error) {
      console.error("[reviews] insert error", error);
      return new Response(
        JSON.stringify({ success: false, error: "No se pudo guardar la reseña." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("[submit-review] exception", e);
    return new Response(
      JSON.stringify({ success: false, error: "Error inesperado." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
