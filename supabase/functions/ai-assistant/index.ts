// Supabase Edge Function: ai-assistant
// Handles secure EchoLeaf AI interactions using OpenAI Responses API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// In-memory rate limiting map (per-user IP/token timestamp sliding window)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

function checkRateLimit(identifier) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitMap.get(identifier) || []).filter((t) => t > windowStart);
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  timestamps.push(now);
  rateLimitMap.set(identifier, timestamps);
  return true;
}

const SYSTEM_PROMPT = `You are EchoLeaf AI, the intelligent virtual copilot for the EchoLeaf satellite forest surveillance platform.
EchoLeaf utilizes Sentinel-1 SAR (cloud-piercing radar) and Sentinel-2 Multispectral Optical imagery powered by zero-pretrain machine learning to detect illegal deforestation across 8 major Indian forest reserves (including Hasdeo Arand, Keonjhar Mining Corridor, Saranda Forest, Similipal Tiger Reserve, and others).
Your role is to assist forest rangers, researchers, and administrators:
- Explain satellite metrics like NDVI (optical leaf greenness), VH backscatter dB (radar tree canopy volume), and RFDI (radar forest degradation index).
- Answer questions on deforestation alerts, active loss sites, time comparisons, and field inspection workflows.
- Provide general helpful, concise, well-structured, and accurate technical advice.
- Maintain a professional, crisp, and eco-vigilant tone.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key is not configured in Supabase secrets." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Verify User Session with Supabase Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header. Please log in to use EchoLeaf AI." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session. Please re-authenticate." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Enforce Rate Limiting
    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please wait a minute before sending more queries." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Parse and Validate Payload
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Malformed JSON payload." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, model = "gpt-4o-mini" } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Guard rails: maximum 15 conversation turns, message length limits
    const sanitizedMessages = [];
    const boundedHistory = messages.slice(-10); // Keep last 10 messages for context

    for (const msg of boundedHistory) {
      if (!msg || typeof msg !== "object") continue;
      const role = msg.role === "assistant" ? "assistant" : "user";
      const content = String(msg.content || "").trim();
      if (!content) continue;
      if (content.length > 4000) {
        return new Response(
          JSON.stringify({ error: "Individual message length exceeds 4,000 characters limit." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      sanitizedMessages.push({ role, content });
    }

    if (sanitizedMessages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid user messages found." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Call OpenAI API
    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openAIApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...sanitizedMessages,
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errText = await openAIResponse.text();
      console.error("[EchoLeaf AI Edge] OpenAI Error:", openAIResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable. Please try again shortly." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openAIData = await openAIResponse.json();
    const replyText = openAIData.choices?.[0]?.message?.content?.trim() || "";

    return new Response(
      JSON.stringify({
        reply: replyText,
        model: openAIData.model || model,
        usage: openAIData.usage,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("[EchoLeaf AI Edge] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "An unexpected internal server error occurred." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
