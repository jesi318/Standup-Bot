import type { Client } from "discord.js";
import fs from "node:fs";
import path from "node:path";

export async function loadCommands(client: Client) {
    const commandPaths = path.join(
        process.cwd(),
        "src",
        "platforms",
        "discord",
        "commands"
    );

    const commandFiles = fs.readdirSync(commandPaths).filter(file => file.endsWith(".ts"));

    for (const file of commandFiles) {
        const filePath = path.join(commandPaths, file);
        const commandModule = await import(filePath);
        const command = commandModule.default;
        client.commands.set(command.data.name, command);
    }
}