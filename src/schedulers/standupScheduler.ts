import type { Client } from "discord.js";
import cron from "node-cron";
import { fetchAllGuildSettings } from "../app/services/guildSettingsService.js";
import { sendMissingStandupReminder, sendStandupReminder } from "../app/services/reminderService.js";
import {
  shouldSendMissingReminder,
  shouldSendReminder,
} from "../app/services/scheduleService.js";
import type { GuildSettings } from "../domain/models/GuildSettings.js";

export function startStandupScheduler(client: Client) {
  cron.schedule("* * * * *", async () => {
    const settings: GuildSettings[] = fetchAllGuildSettings();

    for (const setting of settings) {
      try {
        if (shouldSendReminder(setting)) {
           await sendStandupReminder(client, setting.channelId);
        }

        if (shouldSendMissingReminder(setting)) {
          await sendMissingStandupReminder(
            client,
            setting,
          );
        }
      } catch (error) {
        console.error(
          `Failed to send reminder for guild ${setting.guildId}`,
          error,
        );
      }
    }
  });
}
