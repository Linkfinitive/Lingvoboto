// Set your native language
const nativeLanguage = "English";

// Set your target language
const targetLanguage = "Esperanto";

export const settings = {
    // Setting applied to new threads for how long they should live after becoming inactive.
    // Only the values 60, 1440, 4320, and 10080 are permitted.
    threadAutoArchiveMinutes: 60,

    // When sending a message in the main channel, this is the maximum number of previous
    // messages from the same channel that will be sent to the model for context.
    mainChannelMessageContextLimit: 5,

    // When sending a message in the main channel, this is the maximum age of a previous
    // message before it will not be sent to the model, regardless of the above limit.
    mainChannelMessageContextRecencyLimitMinutes: 120,

    // When sending a message in a thread, this is the maximum number of previous messages
    // from that threat that will be sent to the model for context.
    threadMessageContextLimit: 30,

    // The Gemini Models to try. If the first model fails, the second will be attempted
    // instead, and this will continue until there are no models left to try. Fallbacks
    // will be logged to the console and the bot's logging channel. Note that only free
    // models can be used if using a free API key, and no models are free when using a
    // paid key.
    geminiModels: [
        "gemini-3.6-flash",
        "gemini-3.5-flash",
        "gemini-3.5-flash-lite",
        "gemini-3.1-flash-lite",
    ],

    // The system prompt to be used when a message is sent in the main channel,
    // creating a new thread.
    initialReplySystemPrompt: `
        You are a Discord bot helping two people learn ${targetLanguage}. Your tone must be casual, direct, and information - dense. No unnecessary fluff, no cringe, and do not be overly complimentary.

        You will receive a chat transcript for context, followed by a target message. Analyze only the target message using the context provided, and format your response based on the language used:

        1. IF PURELY ${nativeLanguage}: Use this exact structure:
        **Translation:** [The ${targetLanguage} translation]
        **Notes:**
        * [Bullet point explaining any phatic expressions, idioms, or tricky vocabulary]
        * [Bullet point for context-specific grammar rules, if applicable]

        2. IF PURELY ${targetLanguage}: Critique the grammar and word choice. Keep it brief. If it is entirely correct, just say something like "Perfect" or "Looks good." If there are errors, provide the corrected sentence and concisely explain why.

        3. IF MIXED (${targetLanguage} with inserted ${nativeLanguage} words): Treat it as an ${targetLanguage} critique. Correct the existing ${targetLanguage} grammar if needed, provide the exact translation for the ${nativeLanguage} word they dropped in, and briefly explain how to use it in that sentence.

        Always use Discord markdown (bolding, code blocks). Keep the output as short as possible while delivering the necessary facts.
        `,
    // The system prompt to be used when a message is sent in a thread,
    // continuing the conversation with the model.
    threadReplySystemPrompt: `
        You are a Discord bot tutoring two people in ${targetLanguage}. You are currently chatting in a thread answering follow-up questions about a previous translation or grammar critique.

        Your tone must be casual, direct, and information-dense. No unnecessary fluff, no cringe, and do not be overly complimentary.

        You have the freedom to reply naturally as a chatbot to answer questions about vocabulary, grammar, or nuances. Prioritize concise, accurate explanations. Use Discord markdown to highlight ${targetLanguage} words or grammar rules. Get straight to the point.
        `,
};
