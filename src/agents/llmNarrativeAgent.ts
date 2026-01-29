/**
 * LLM Narrative Agent for REP
 *
 * This agent translates pre-aggregated, governance-approved data into
 * plain-language explanations for users.
 *
 * CRITICAL: This agent ONLY accepts GovernanceApprovedDataset.
 * It cannot and should not access raw data.
 *
 * Key guardrails:
 * - Never make causal or genetic-deterministic claims
 * - Include uncertainty and ethics language
 * - Frame findings in asset-based language
 * - Explain what the data DOES NOT show
 */

import { NarrativeContext, Narrative, GovernanceApprovedDataset } from "./types";

/**
 * System prompt for the LLM
 * This is the core instruction set for the narrative agent
 * It is written to be explicit about what NOT to do
 */
const NARRATIVE_SYSTEM_PROMPT = `You are a health equity communications specialist writing for the REP (Rare Renal Equity Project) platform.

Your job: Translate aggregated data into clear, honest, plain-language explanations.

CRITICAL GUARDRAILS:

1. NEVER make causal claims. Do not say "poverty causes kidney disease." Say "kidney disease and poverty co-occur in this neighborhood" or "we see both kidney disease and poverty in this data."

2. NEVER invoke genetics or individual blame. Do not say "people in this area have a gene." Say "kidney disease is elevated in this geography."

3. ALWAYS explain what the data DOES NOT show:
   - Not individual-level data
   - Not clinical diagnoses
   - Not genetic information
   - Not predictions of who will get sick

4. ALWAYS include uncertainty language:
   - "This snapshot is from [year]"
   - "We aggregated data to protect privacy"
   - "These patterns are associations, not causes"

5. ALWAYS frame with assets and strengths:
   - Mention community resources, food access, transit, schools
   - Do not lead with burden alone
   - Emphasize what communities have, not only what they lack

6. USE plain language:
   - Short sentences
   - Explain technical terms (e.g., "food desert = area with limited fresh food")
   - Avoid jargon

TONE: Clear, respectful, grounded, non-alarmist.

You are writing for people living in these neighborhoods, community partners, researchers, and funders.
`;

/**
 * Initialize the LLM client (placeholder for Claude API)
 * Replace with actual Anthropic SDK call when available
 */
async function callLLM(
  prompt: string,
  systemPrompt: string = NARRATIVE_SYSTEM_PROMPT
): Promise<string> {
  // In production, this would call Anthropic's Claude API:
  // const client = new Anthropic();
  // const response = await client.messages.create({
  //   model: "claude-opus-4-5",
  //   max_tokens: 1024,
  //   system: systemPrompt,
  //   messages: [{ role: "user", content: prompt }],
  // });
  // return response.content[0].type === "text" ? response.content[0].text : "";

  throw new Error("LLM service not yet configured. Configure Anthropic API key.");
}

/**
 * Build a detailed prompt for the LLM based on governance-approved data
 */
function buildNarrativePrompt(context: NarrativeContext): string {
  const metricsDescription = Object.entries(context.metrics)
    .map(([key, value]) => {
      const label = context.metricLabels[key] || key;
      const confidence = context.confidence[key] || "unknown";
      const formattedValue = typeof value === "number" ? `${value.toFixed(1)}%` : "N/A";
      return `- ${label}: ${formattedValue} (confidence: ${confidence})`;
    })
    .join("\n");

  const warningsDescription =
    context.warnings.length > 0
      ? `\nGovernance Notes:\n${context.warnings.map(w => `- ${w.message}`).join("\n")}`
      : "";

  const assetsDescription = context.assets
    ? `\nCommunity Assets & Resources:\n${Object.entries(context.assets)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n")}`
    : "";

  const burdensDescription = context.burdens
    ? `\nEnvironmental & Structural Factors:\n${Object.entries(context.burdens)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n")}`
    : "";

  return `
Geography: ${context.geography.name || context.geography.geoid}
Resolution: ${context.geography.resolutionLevel}

Metrics:
${metricsDescription}
${warningsDescription}
${assetsDescription}
${burdensDescription}

Please write:
1. A 2-3 sentence plain-language summary of what this data shows
2. 3-4 bullet points of "What this map DOES show"
3. 3-4 bullet points of "What this map DOES NOT show" (be explicit about privacy and limitations)
4. 2-3 key insights (qualified, not causal)
5. A short uncertainty statement
6. One sentence about what communities in this area can do or access

Use plain language. No jargon. Assume the reader has not seen health equity data before.
`;
}

/**
 * Main narrative generation function
 * This is the public API for generating narratives
 *
 * @param context Pre-aggregated, governance-approved data context
 * @returns Generated narrative with safeguards
 */
export async function generateNarrative(
  context: NarrativeContext
): Promise<Narrative> {
  // Build the detailed prompt
  const prompt = buildNarrativePrompt(context);

  // Call the LLM with strict system prompt
  const llmResponse = await callLLM(prompt, NARRATIVE_SYSTEM_PROMPT);

  // Parse the LLM response into structured format
  const narrative = parseNarrativeResponse(llmResponse, context);

  return narrative;
}

/**
 * Parse LLM response into structured Narrative object
 * This is where we enforce additional guardrails on the LLM output
 *
 * @param response Raw LLM response text
 * @param context Original context (for reference)
 * @returns Structured Narrative
 */
function parseNarrativeResponse(
  response: string,
  context: NarrativeContext
): Narrative {
  // In production, use a more sophisticated parsing strategy
  // For now, assume the LLM has structured its response

  // IMPORTANT: Always add uncertainty statement
  const uncertaintyStatement = `This snapshot reflects aggregated data from ${new Date().getFullYear()}.
These patterns are associations, not causes. Individual experiences vary greatly.`;

  return {
    summary: extractSection(response, "summary"),
    whatItShows: extractBulletList(response, "What this map DOES show"),
    whatItDoesNotShow: extractBulletList(response, "What this map DOES NOT show"),
    insights: extractBulletList(response, "key insights"),
    uncertaintyStatement,
    assetContext:
      context.assets && Object.keys(context.assets).length > 0
        ? `This neighborhood has resources: ${Object.values(context.assets).join(", ")}`
        : undefined,
  };
}

/**
 * Helper: extract a section from LLM response
 */
function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}[:\n]+(.*?)(?=\n\n|$)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

/**
 * Helper: extract bullet list from LLM response
 */
function extractBulletList(text: string, sectionName: string): string[] {
  const regex = new RegExp(`${sectionName}[:\n]+(.*?)(?=\n\n|$)`, "is");
  const match = text.match(regex);
  if (!match) return [];

  return match[1]
    .split("\n")
    .filter(line => line.trim().startsWith("-") || line.trim().startsWith("•"))
    .map(line => line.replace(/^[-•]\s*/, "").trim())
    .filter(line => line.length > 0);
}

/**
 * Safety check: ensure narrative does not contain causal language
 * This is a defensive check in case the LLM violates guardrails
 *
 * @param narrative Generated narrative
 * @returns Narrative with flagged unsafe language, or original if safe
 */
export function checkNarrativeSafety(narrative: Narrative): {
  isSafe: boolean;
  flaggedPhrases?: string[];
} {
  const unsafePatterns = [
    /causes? kidney disease/i,
    /causes? kidney disease/i,
    /leads? to kidney disease/i,
    /genetic mutation/i,
    /genetic predisposition/i,
    /will develop kidney disease/i,
  ];

  const allText = Object.values(narrative).join(" ");
  const flaggedPhrases: string[] = [];

  unsafePatterns.forEach(pattern => {
    const matches = allText.match(pattern);
    if (matches) flaggedPhrases.push(...matches);
  });

  return {
    isSafe: flaggedPhrases.length === 0,
    flaggedPhrases: flaggedPhrases.length > 0 ? flaggedPhrases : undefined,
  };
}

/**
 * Generate a simple narrative fallback
 * Use this when LLM is unavailable or if the LLM response fails safety checks
 *
 * @param context Governance-approved data context
 * @returns Safe fallback narrative
 */
export function generateFallbackNarrative(context: NarrativeContext): Narrative {
  const metricsSummary = Object.entries(context.metrics)
    .map(([key, value]) => {
      if (value === null) return null;
      const label = context.metricLabels[key] || key;
      return `${label} (${value.toFixed(1)}%)`;
    })
    .filter(Boolean)
    .join(", ");

  return {
    summary: `This map shows aggregated, privacy-protected data for ${
      context.geography.name || context.geography.geoid
    }. The data includes: ${metricsSummary}.`,
    whatItShows: [
      "Aggregated, neighborhood-level data",
      "Population-level patterns, not individual diagnoses",
      "Environmental and social factors alongside health outcomes",
    ],
    whatItDoesNotShow: [
      "Individual-level health data (by design, to protect privacy)",
      "Genetic or family history information",
      "Predictions of who will get sick",
      "Causal relationships (these are associations)",
      "Clinical diagnoses or treatment information",
    ],
    insights: [
      "Multiple factors influence health outcomes",
      "Place and environment matter",
      "Solutions require systemic change, not individual behavior change alone",
    ],
    uncertaintyStatement:
      "This is a snapshot from aggregated data. Individual experiences vary greatly. These patterns show associations, not causes.",
    assetContext: context.assets
      ? `Strengths in this neighborhood include: ${Object.keys(context.assets).join(", ")}`
      : "Every neighborhood has strengths and resources worth recognizing.",
  };
}
