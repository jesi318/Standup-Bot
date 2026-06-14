import type { Client } from "discord.js";
import cron from "node-cron";
import { fetchAllGuildSettings } from "../services/guildSettingsService.js";
import type { GuildSettings } from "../types/guildSettings.js";
import { sendStandupReminder } from "../services/reminderService.js";
import { shouldSendReminder } from "../services/scheduleService.js";

export function startStandupScheduler(client: Client) {
    cron.schedule("* * * * *", async () => {
        const settings: GuildSettings[] = fetchAllGuildSettings();


        for (const setting of settings) {
            if (!shouldSendReminder(setting)) {
                continue;
            }

            await sendStandupReminder(
                client,
                setting.channelId
            );
        }
    });


}