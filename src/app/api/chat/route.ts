/**
 * API Route: POST /api/chat
 * Proxy al NVIDIA NIM para NPCs conversacionales.
 * Incluye retry con backoff exponencial para errores 429/503/timeout.
 */
import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '';
const NVIDIA_CHAT_MODEL = process.env.NVIDIA_CHAT_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b';

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

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function llamarNvidia(payload: any, attempt = 1): Promise<{ reply: string; tokensUsed: number }> {
  const response = await fetch(`${NVIDIA_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NVIDIA_API_KEY}`,
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    const isRetryable = response.status === 429 || response.status === 503 || response.status >= 500;
    if (isRetryable && attempt < 3) {
      const waitMs = Math.min(1000 * Math.pow(2, attempt), 4000); // 1s, 2s, 4s max
      console.warn(`[NVIDIA API ${response.status}] reintentando en ${waitMs}ms (intento ${attempt}/3)`);
      await sleep(waitMs);
      return llamarNvidia(payload, attempt + 1);
    }
    throw new Error(`NVIDIA API ${response.status}: ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim() || '';
  const tokensUsed = data.usage?.total_tokens ?? 0;
  return { reply, tokensUsed };
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

  const payload = {
    model: NVIDIA_CHAT_MODEL,
    messages: fullMessages,
    temperature: body.temperature ?? 0.7,
    top_p: 0.9,
    max_tokens: body.maxTokens ?? 250,
    stream: false,
    chat_template_kwargs: { thinking: false },
  };

  try {
    const { reply, tokensUsed } = await llamarNvidia(payload);
    const latencyMs = Date.now() - t0;
    return NextResponse.json({ reply, latencyMs, tokensUsed, npc: body.npc });
  } catch (err: any) {
    console.error('[CHAT API FATAL]', err.message);
    return NextResponse.json(
      { error: 'NVIDIA no responde tras 3 intentos. Intenta de nuevo.', detail: err.message },
      { status: 502 }
    );
  }
}

