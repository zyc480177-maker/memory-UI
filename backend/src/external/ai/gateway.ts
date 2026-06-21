import { config } from '../../config';

// ─── Provider abstraction ─────────────────────────────────────────────────────

export interface GenerateTextOptions {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AnalyzeImageOptions {
  imageBase64: string;
  mimeType: string;
  prompt: string;
}

export interface AIProvider {
  name: string;
  generateText(opts: GenerateTextOptions): Promise<string>;
  analyzeImage(opts: AnalyzeImageOptions): Promise<string>;
}

// ─── Gemini provider ─────────────────────────────────────────────────────────

class GeminiProvider implements AIProvider {
  name = 'gemini';
  private model = 'gemini-1.5-flash';

  private async callGemini(body: Record<string, unknown>): Promise<string> {
    const apiKey = config.ai.geminiApiKey;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    const data = await res.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }

  async generateText(opts: GenerateTextOptions): Promise<string> {
    const contents: unknown[] = [];

    if (opts.systemPrompt) {
      contents.push({ role: 'user', parts: [{ text: opts.systemPrompt }] });
      contents.push({ role: 'model', parts: [{ text: '好的，我明白了。' }] });
    }

    contents.push({ role: 'user', parts: [{ text: opts.prompt }] });

    return this.callGemini({
      contents,
      generationConfig: {
        maxOutputTokens: opts.maxTokens ?? 4096,
        temperature: opts.temperature ?? 0.7,
      },
    });
  }

  async analyzeImage(opts: AnalyzeImageOptions): Promise<string> {
    return this.callGemini({
      contents: [{
        role: 'user',
        parts: [
          {
            inline_data: {
              mime_type: opts.mimeType,
              data: opts.imageBase64,
            },
          },
          { text: opts.prompt },
        ],
      }],
      generationConfig: { maxOutputTokens: 2048, temperature: 0.3 },
    });
  }
}

// ─── Gateway ─────────────────────────────────────────────────────────────────

class AIGateway {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProviderName: string;

  constructor() {
    this.providers.set('gemini', new GeminiProvider());
    this.defaultProviderName = config.ai.defaultProvider ?? 'gemini';
  }

  getProvider(name?: string): AIProvider {
    const providerName = name ?? this.defaultProviderName;
    const provider = this.providers.get(providerName);
    if (!provider) throw new Error(`AI provider not found: ${providerName}`);
    return provider;
  }

  async generateText(opts: GenerateTextOptions, provider?: string): Promise<string> {
    return this.getProvider(provider).generateText(opts);
  }

  async analyzeImage(opts: AnalyzeImageOptions, provider?: string): Promise<string> {
    return this.getProvider(provider ?? 'gemini').analyzeImage(opts);
  }
}

export const aiGateway = new AIGateway();
