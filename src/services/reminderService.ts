import type { Client } from "discord.js";
import { createSubmitStandupButton } from "../components/submitStandupButton.js";

export async function sendStandupReminder(client: Client, channelId: string) {
    
    const channel = await client.channels.fetch(channelId);

    if(!channel || !channel.isTextBased() || channel.isDMBased()) {
        throw new Error(`Channel not found or not text-based: ${channelId}`);
    }
    
    await channel.send({
        content: "## 👥💬 Daily Standup\n\nClick below to submit your standup.",
        components: [
            createSubmitStandupButton()
        ]
    });
}