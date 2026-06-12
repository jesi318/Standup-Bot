import path from "node:path";
import fs from "node:fs";
import type { Client } from "discord.js";

export async function loadEvents(client: Client) {
    const eventPaths = path.join(
        process.cwd(),
        "src",
        "events"
    );

    const eventFiles = fs.readdirSync(eventPaths).filter(file => file.endsWith(".ts"));

    for (const file of eventFiles) {
        const filePath = path.join(eventPaths, file);
        const eventModule = await import(filePath);
        const event = eventModule.default;

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }   
}