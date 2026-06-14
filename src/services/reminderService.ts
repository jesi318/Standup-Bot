import type { Client } from "discord.js";
import { fetchAllGuildSettings } from "./guildSettingsService.js";
import { createSubmitStandupButton } from "../components/submitStandupButton.js";

export async function sendStandupReminder(client: Client, channelId: string) {
    
    const channel = await client.channels.fetch(channelId);

    if(!channel || !channel.isTextBased() || channel.isDMBased()) {
        return;
    }
    
    await channel.send({
        content: "## 👥💬 Daily Standup\n\nClick below to submit your standup.",
        components: [
            createSubmitStandupButton()
        ]
    });
}