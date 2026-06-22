import { Client, Events } from "discord.js"
import { startStandupScheduler } from "../../../schedulers/standupScheduler.js"

const readyEvent = {
  name: Events.ClientReady,
  once: true,

  execute(client: Client<true>) {
    console.log(
      `Ready! Logged in as ${client.user.tag}`
    )

    startStandupScheduler(client)
  },
}

export default readyEvent