import { TextChannel } from "discord.js";
import { DISCORD_CLIENT } from "./index.ts";

export async function log(message: string) {
    console.log(message);
    try {
        const channel = await DISCORD_CLIENT.channels.fetch(
            `${process.env.LOGGING_CHANNEL_ID}`
        );
        if (channel) {
            const textChannel = channel as TextChannel;
            await textChannel.send(message);
        }
    } catch {
        console.log(
            `Could not log in the channel ${process.env.LOGGING_CHANNEL_ID}`
        );
    }
}
