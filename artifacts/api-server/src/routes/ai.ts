import { Router, type IRouter } from "express";
import { ScanDocumentBody } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { requireAuth } from "../lib/auth-middleware";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are an expert document verification assistant for a study-abroad consultancy.
Your job is to analyze images of official documents (passports, academic transcripts, IELTS/PTE score cards, bank statements, degree certificates, etc.) and extract key information.

Respond ONLY with a valid JSON object in this exact format:
{
  "documentType": "string (e.g. Passport, IELTS Score Card, 10th Marksheet, Bank Statement)",
  "fields": [
    { "label": "Field Name", "value": "extracted value", "status": "ok" | "warning" | "error" }
  ],
  "verdict": "ready" | "needs_attention" | "not_suitable",
  "verdictMessage": "1–2 sentence summary for the student",
  "tips": ["Tip 1", "Tip 2"]
}

Rules:
- Extract every meaningful field visible in the document.
- status "ok" = valid / looks good; "warning" = expiring soon / borderline; "error" = expired / invalid / missing.
- verdict "ready" = document is suitable for overseas university applications.
- verdict "needs_attention" = minor issues but may still be usable.
- verdict "not_suitable" = serious problem (expired passport, very low score, etc.).
- tips should be concise, actionable advice for a student applying abroad.
- If the image is not a document or is unreadable, set documentType to "Unknown" and verdict to "not_suitable".
- Never include markdown, code fences, or any text outside the JSON object.`;

router.post("/ai/scan-document", requireAuth, async (req, res): Promise<void> => {
  const parsed = ScanDocumentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request: " + parsed.error.message });
    return;
  }

  const { imageBase64, mimeType, documentHint } = parsed.data;

  const userContent: Parameters<typeof openai.chat.completions.create>[0]["messages"][0]["content"] = [
    {
      type: "image_url",
      image_url: {
        url: `data:${mimeType};base64,${imageBase64}`,
        detail: "high",
      },
    },
    ...(documentHint
      ? [{ type: "text" as const, text: `Document hint: ${documentHint}` }]
      : []),
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-5.6-luna",
      max_completion_tokens: 1024,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";

    // Strip any accidental markdown fences
    const cleaned = raw
      .replace(/^```[a-z]*\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
    const result = JSON.parse(cleaned);

    res.json(result);
  } catch (err: unknown) {
    req.log.error({ err }, "AI scan failed");
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "AI scan failed: " + message });
  }
});

const CHAT_SYSTEM_PROMPT = 'You are GlobeTrek AI, a helpful study-abroad assistant for GlobeTrek Overseas. Answer questions about university selection across 25 countries, applications, documents, visas, scholarships, IELTS/PTE, costs, accommodation and pre-departure support. Be concise, practical and friendly. Never guarantee admission, scholarships or visas.';

router.post("/ai/chat", async (req, res): Promise<void> => {
  const message = String(req.body?.message || '').trim();
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
  if (!message) { res.status(400).json({ error: 'A message is required' }); return; }
  try {
    const completion = await openai.chat.completions.create({ model: 'gpt-5.6-luna', max_completion_tokens: 450, messages: [{ role: 'system', content: CHAT_SYSTEM_PROMPT }, ...history.map((item: { role?: string; content?: string }) => ({ role: item.role === 'user' ? 'user' as const : 'assistant' as const, content: String(item.content || '') })), { role: 'user', content: message }] });
    res.json({ reply: completion.choices[0]?.message?.content || 'I could not prepare a response. Please try again.', source: 'ai' });
  } catch (error) {
    const q = message.toLowerCase();
    const reply = q === 'uk' || q.includes('united kingdom') ? 'The UK is a strong choice for one-year master’s degrees and globally recognised universities. Browse the UK filter in Universities, compare intakes and fees, then save your shortlist.' : q.includes('visa') ? 'For a visa checklist, keep your passport, offer letter, financial proof, English-test score report, medical documents and photos ready. A GlobeTrek counsellor can confirm country-specific requirements.' : 'I can help with universities, visas, applications, scholarships, English tests, costs and travel preparation. Tell me your preferred country, course, budget or intake.';
    res.json({ reply, source: 'globetrek-knowledge-base' });
  }
});
export default router;
