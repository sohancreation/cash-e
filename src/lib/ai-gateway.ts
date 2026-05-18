import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const createAiGatewayProvider = (apiKey: string) =>
  createOpenAICompatible({
    name: "ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });

// Deprecated fallback for backward compatibility
export const createLovableAiGatewayProvider = createAiGatewayProvider;
