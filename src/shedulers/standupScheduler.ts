import type { Client } from "discord.js";
import cron from "node-cron";
import { fetchAllGuildSettings } from "../services/guildSettingsService.js";
import type { GuildSettings } from "../types/guildSettings.js";
import { sendStandupReminder } from "../services/reminderService.js";

export function startStandupScheduler(client: Client) {
    cron.schedule("* * * * *", async () => {
        const settings: GuildSettings[] = fetchAllGuildSettings();

        const currentTime = new Date().toTimeString().slice(0, 5);

        for (const setting of settings) {
            if (setting.scheduleTime !== currentTime) {
                continue;
            }

            await sendStandupReminder(
                client,
                setting.channelId
            );
        }
    });


}