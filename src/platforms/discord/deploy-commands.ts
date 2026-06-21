import path from "node:path"
import "dotenv/config"
import fs from "node:fs"
import { REST, Routes } from "discord.js";

const commands = []

const commandPath = path.join(process.cwd(), "src", "platforms", "discord", "commands")

const commandFiles = await fs.readdirSync(commandPath).filter(file => file.endsWith(".ts"));

for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const commandModule = await import(filePath);
    const command = commandModule.default;
    commands.push(command.data.toJSON());
}

const token = process.env.DISCORD_TOKEN;

if (!token) {
    throw new Error("DISCORD_TOKEN is not set");
}

const rest = new REST({ version: "10" }).setToken(token);

try {
    console.log("Started deploying (/) commands.");
    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!),
        { body: commands }
    )
    console.log("Successfully deployed (/) commands.");
} catch (error) {
    console.error(error);
}