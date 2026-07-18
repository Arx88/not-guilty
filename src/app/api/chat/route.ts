/**
 * API Route: POST /api/chat
 * Proxy al NVIDIA NIM (Llama 3.1 Nemotron 70B Instruct) para NPCs conversacionales.
 * Recibe: { messages, systemPrompt, npc, gameState }
 * Devuelve: { reply, latencyMs, tokensUsed }
 */
import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '';
const NVIDIA_CHAT_MODEL = process.env.NVIDIA_CHAT_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  messages: ChatMessage[];
  systemPrompt: string;
  npc?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  const body = (await req.json()) as RequestBody;

  if (!NVIDIA_API_KEY) {
    return NextResponse.json(
      { error: 'NVIDIA_API_KEY no configurada en .env.local' },
      { status: 500 }
    );
  }

  const fullMessages: ChatMessage[] = [
    { role: 'system', content: body.systemPrompt },
    ...body.messages,
  ];

  try {
    const response = await fetch(`${NVIDIA_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        model: NVIDIA_CHAT_MODEL,
        messages: fullMessages,
        temperature: body.temperature ?? 0.7,
        top_p: 0.9,
        max_tokens: body.maxTokens ?? 350,
        stream: false,
        // Desactivar reasoning/thinking en Nemotron Ultra (evita que filtre chain-of-thought en inglés)
        chat_template_kwargs: { thinking: false },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[NVIDIA API ERROR]', response.status, errText);
      return NextResponse.json(
        { error: `NVIDIA API ${response.status}`, detail: errText.slice(0, 500) },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '';
    const tokensUsed = data.usage?.total_tokens ?? 0;
    const latencyMs = Date.now() - t0;

    return NextResponse.json({ reply, latencyMs, tokensUsed, npc: body.npc });
  } catch (err: any) {
    console.error('[CHAT API FATAL]', err);
    return NextResponse.json(
      { error: 'Fatal', detail: err.message },
      { status: 500 }
    );
  }
}
