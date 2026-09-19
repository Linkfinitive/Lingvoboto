import { Message, TextChannel } from "discord.js";
import { generateInitialTranslation, generateThreadReply } from "./gemini.ts";
import { settings } from "./settings.ts";
import { log } from "./console.ts";

export async function handleMessageCreate(message: Message, botId: string) {
    if (message.author.bot || !message.content.trim()) return;

    if (message.channel.isThread()) {
        await handleThreadMessage(message, botId);
    } else {
        await handleChannelMessage(message);
    }
}

async function handleChannelMessage(message: Message) {
    try {
        const thread = await message.startThread({
            name: `${getThreadName(message.content)}`,
            autoArchiveDuration: settings.threadAutoArchiveMinutes,
        });

        // Collect previous messages to give context to the model
        const previousMessages = await message.channel.messages.fetch({
            limit: settings.mainChannelMessageContextLimit,
            before: message.id,
        });

        // Only recent messages should be included
        const recencyLimitMs =
            settings.mainChannelMessageContextRecencyLimitMinutes * 60 * 1000;
        const cutoffTime = message.createdAt.getTime() - recencyLimitMs;

        // Discord messages are in reverse chronological order
        const transcript = previousMessages
            .filter((msg) => msg.createdAt.getTime() > cutoffTime)
            .reverse()
            .map((msg) => `${msg.author.username}: ${msg.content}`)
            .join("\n");

        const prompt = `Recent conversation context:\n${transcript || "(No recent messages)"}\n\nMessage to translate/critique from ${message.author.username}:\n${message.content}`;
        const response = await generateInitialTranslation(prompt);
        if (response) await thread.send(response);
    } catch (error) {
        await log(`${error}`);
    }
}

async function handleThreadMessage(message: Message, botId: string) {
    const discordMessages = await message.channel.messages.fetch({
        limit: settings.threadMessageContextLimit,
    });

    // Discord messages are in reverse chronological order, but Gemini API expects them in regular chronological order
    const geminiHistory = discordMessages.reverse().map((msg) => {
        return {
            role: msg.author.id === botId ? "model" : "user",
            parts: [{ text: msg.content }],
        };
    });

    // Channel must be cast to a text channel to allow the .send() method to be used
    const channel = message.channel as TextChannel;

    try {
        const response = await generateThreadReply(geminiHistory);
        if (response) await channel.send(response);
    } catch (error) {
        await log(`${error}`);
    }
    return;
}

function getThreadName(content: string): string {
    const cleaned = content.trim().replace(/\s+/g, " ");
    if (!cleaned) return "Translation";
    const words = cleaned.split(" ");
    let name = words.slice(0, 6).join(" ");
    name.slice(0, 90);
    if (words.length > 6) {
        name += "...";
    }
    return name;
}
