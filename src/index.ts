import { Client, Events, GatewayIntentBits } from "discord.js";
import { handleMessageCreate } from "./messageCreate.ts";
import { log } from "./console.ts";

export const DISCORD_CLIENT = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

DISCORD_CLIENT.once(Events.ClientReady, async (readyClient) => {
    await log("Online");
});

process.on("uncaughtException", async (error) => {
    await log(`Fatal: ${error}`);
    process.exit(1);
});

DISCORD_CLIENT.on(Events.MessageCreate, async (message) => {
    if (DISCORD_CLIENT.user) {
        await handleMessageCreate(message, DISCORD_CLIENT.user.id);
    }
});

const _ = DISCORD_CLIENT.login(process.env.DISCORD_TOKEN);
