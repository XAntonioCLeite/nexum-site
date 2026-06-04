export default {
  async fetch(request: Request, env: { GEMINI_API_KEY: string }) {
    // Sempre responder CORS (inclusive em erro)
    const cors = corsHeaders();

    // Preflight CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Health check simples no GET (pra você testar no browser)
    if (request.method === "GET") {
      return new Response("OK - use POST", {
        status: 200,
        headers: { ...cors, "content-type": "text/plain; charset=utf-8" },
      });
    }

    if (request.method !== "POST") {
      return new Response("Use POST", {
        status: 405,
        headers: { ...cors, "content-type": "text/plain; charset=utf-8" },
      });
    }

    try {
      const contentType = request.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        return json(
          { error: "Content-Type deve ser application/json" },
          400,
          cors
        );
      }

      if (!env.GEMINI_API_KEY || !env.GEMINI_API_KEY.trim()) {
        return json(
          {
            error:
              "GEMINI_API_KEY não configurada no Worker. Rode: npx wrangler secret put GEMINI_API_KEY",
          },
          500,
          cors
        );
      }

      const { prompt, systemInstruction, history } = (await request.json()) as {
        prompt: string;
        systemInstruction?: string;
        history?: Array<{ role: "user" | "model"; text: string }>;
      };

      if (!prompt?.trim()) return json({ error: "prompt vazio" }, 400, cors);

      const model = "gemini-3.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY.trim()}`;

      const contents = [
        ...(history ?? []).map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
        { role: "user", parts: [{ text: prompt }] },
      ];

      const body: any = { contents };

      if (systemInstruction?.trim()) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] };
      }

      const resp = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const raw = await resp.text();

      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        data = { _raw: raw };
      }

      if (!resp.ok) {
        return json(
          { error: "Gemini error", status: resp.status, data },
          resp.status,
          cors
        );
      }

      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: any) => p?.text)
          .filter(Boolean)
          .join("") ?? "";

      return json({ text }, 200, cors);
    } catch (e: any) {
      return json({ error: e?.message ?? "erro desconhecido" }, 500, cors);
    }
  },
};

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
}

function json(obj: unknown, status = 200, cors: Record<string, string>) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "content-type": "application/json; charset=utf-8" },
  });
}
