import { Client, Events } from "discord.js"
import { startStandupScheduler } from "../../../schedulers/standupScheduler.js"
import { createDiscordAdapter } from "../discordAdapter.js"
import { createReminderService } from "../../../app/services/reminderService.js"
import { fetchAllStandupConfigs } from "../../../app/services/standupConfigService.js"
import { shouldSendMissingReminder, shouldSendReminder } from "../../../app/services/scheduleService.js"

const readyEvent = {
  name: Events.ClientReady,
  once: true,

  execute(client: Client<true>) {
    console.log(
      `Ready! Logged in as ${client.user.tag}`
    )

    const discordAdapter = createDiscordAdapter(client)
    const reminderService = createReminderService({ platformAdapter: discordAdapter })
    startStandupScheduler({ fetchAllStandupConfigs, shouldSendReminder, shouldSendMissingReminder, reminderService })
  },
}

export default readyEvent