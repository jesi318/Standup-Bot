import 'dotenv/config'

import {
  Client,
  Collection,
  GatewayIntentBits,
} from 'discord.js'

import {loadCommands} from './loaders/loadCommands.js'
import {loadEvents} from './loaders/loadEvents.js'
import { migrate } from './database/migrate.js'

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
})

client.commands = new Collection()

migrate()

await loadCommands(client)
await loadEvents(client)

client.login(process.env.DISCORD_TOKEN)