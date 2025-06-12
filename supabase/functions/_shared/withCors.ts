import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { corsHeaders } from "./cors.ts";

export function serveWithCors(
  handler: (req: Request) => Response | Promise<Response>,
) {
  serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    const resp = await handler(req);
    const headers = new Headers(resp.headers);
    for (const [k, v] of Object.entries(corsHeaders)) {
      headers.set(k, v);
    }

    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers,
    });
  });
}
