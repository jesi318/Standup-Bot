import 'dotenv/config'

import {
  Client,
  Collection,
  GatewayIntentBits,
} from 'discord.js'

import {loadCommands} from './platforms/discord/loaders/loadCommands.js'
import {loadEvents} from './platforms/discord/loaders/loadEvents.js'
import { migrate } from './infrastructure/database/migrate.js'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
})

client.commands = new Collection()

migrate()

await loadCommands(client)
await loadEvents(client)

client.login(process.env.DISCORD_TOKEN)