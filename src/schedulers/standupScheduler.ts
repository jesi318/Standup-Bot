import cron from "node-cron";

import type { StandupConfig } from "../domain/models/StandupConfig.js";
import type { ReminderService } from "../app/services/reminderService.js";

interface StandupSchedulerDependencies {
    fetchAllStandupConfigs: () => StandupConfig[];
    shouldSendReminder: (config: StandupConfig) => boolean;
    shouldSendMissingReminder: (config: StandupConfig) => boolean;
    reminderService: ReminderService;
}

export function startStandupScheduler(dependencies: StandupSchedulerDependencies) {
    const { fetchAllStandupConfigs,
        shouldSendReminder,
        shouldSendMissingReminder,
        reminderService, } = dependencies;
        
  cron.schedule("* * * * *", async () => {
    const configs: StandupConfig[] = fetchAllStandupConfigs();

    for (const config of configs) {
      try {
        if (shouldSendReminder(config)) {
          await reminderService.sendStandupReminder(config);
        }

        if (shouldSendMissingReminder(config)) {
          await reminderService.sendMissingStandupReminder(config);
        }
      } catch (error) {
        console.error(
          `Scheduler failed for workspace ${config.workspaceId}`,
          error,
        );
      }
    }
  });
}
