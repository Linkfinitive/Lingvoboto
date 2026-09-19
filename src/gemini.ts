import { ApiError, GoogleGenAI } from "@google/genai";
import { settings } from "./settings.ts";
import { log } from "./console.ts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateWithFallbacks(
    contents: any[] | string,
    systemInstruction: string,
    attemptNumber: number = 0
) {
    if (attemptNumber >= settings.geminiModels.length) return;
    try {
        const response = await ai.models.generateContent({
            model: settings.geminiModels[attemptNumber],
            contents: contents,
            config: { systemInstruction: systemInstruction },
        });

        return response.text;
    } catch (error: unknown) {
        if (
            error instanceof ApiError &&
            (error.status === 429 || error.status === 503)
        ) {
            await log(
                `Generation Failed with ${settings.geminiModels[attemptNumber]}. Trying with next model.`
            );
            return await generateWithFallbacks(
                contents,
                systemInstruction,
                attemptNumber + 1
            );
        }
    }
}

export async function generateThreadReply(geminiHistory: any[]) {
    return generateWithFallbacks(
        geminiHistory,
        settings.threadReplySystemPrompt
    );
}

export async function generateInitialTranslation(content: string) {
    return generateWithFallbacks(content, settings.initialReplySystemPrompt);
}
