import type { Client } from "discord.js";
import cron from "node-cron";
import { fetchAllStandupConfigs } from "../app/services/StandupConfigService.js";
import { sendMissingStandupReminder, sendStandupReminder } from "../app/services/reminderService.js";
import {
  shouldSendMissingReminder,
  shouldSendReminder,
} from "../app/services/scheduleService.js";
import type { StandupConfig } from "../domain/models/StandupConfig.js";

export function startStandupScheduler(client: Client) {
  cron.schedule("* * * * *", async () => {
    const settings: StandupConfig[] = fetchAllStandupConfigs();

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
          `Failed to send reminder for guild ${setting.workspaceId}`,
          error,
        );
      }
    }
  });
}

