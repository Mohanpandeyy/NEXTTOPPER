import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { key, deviceFingerprint } = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // key nikaalo
  const { data: keyRow } = await supabase
    .from("access_keys")
    .select("*")
    .eq("key", key)
    .single();

  if (!keyRow || keyRow.status !== "alive") {
    return new Response(
      JSON.stringify({ error: "Key invalid ya used" }),
      { status: 403 }
    );
  }

  // device check
  if (
    keyRow.device_fingerprint &&
    keyRow.device_fingerprint !== deviceFingerprint
  ) {
    return new Response(
      JSON.stringify({ error: "Wrong device" }),
      { status: 403 }
    );
  }

  // key DEAD karo
  const { error } = await supabase
    .from("access_keys")
    .update({
      device_fingerprint: deviceFingerprint,
      status: "dead",
      used_at: new Date()
    })
    .eq("id", keyRow.id)
    .eq("status", "alive");

  if (error) {
    return new Response(
      JSON.stringify({ error: "Conflict" }),
      { status: 409 }
    );
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200 }
  );
});
