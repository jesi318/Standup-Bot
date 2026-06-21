import type { GuildSettings } from "../models/GuildSettings.js";
import { db } from "./db.js";

export function createorUpdateGuildSettings(settings: GuildSettings) {
    const stmt = db.prepare(`
        INSERT INTO guild_settings (
            guild_id,
            channel_id,
            frequency,
            schedule_time,
            timezone
            role_id
        )
        VALUES (?, ?, ?, ?, ?, ?)

        ON CONFLICT(guild_id)
        DO UPDATE SET
            channel_id = excluded.channel_id,
            frequency = excluded.frequency,
            schedule_time = excluded.schedule_time,
            timezone = excluded.timezone,
            role_id = excluded.role_id
    `);
    stmt.run(settings.guildId, settings.channelId, settings.frequency, settings.scheduleTime, settings.timezone, settings.roleId);
}

export function getGuildSettings(
    guildId: string
) {
    const statement = db.prepare(`
        SELECT *
        FROM guild_settings
        WHERE guild_id = ?
    `);

    const row = statement.get(guildId);

    if (!row) {
        return undefined;
    }

    return toGuildSettings(row);
}

export function getAllGuildSettings() {
    const statement = db.prepare(`
        SELECT *
        FROM guild_settings
    `);

    return statement.all().map(toGuildSettings);
}

function toGuildSettings(row: any): GuildSettings {
    return {
        guildId: row.guild_id,
        channelId: row.channel_id,
        frequency: row.frequency,
        scheduleTime: row.schedule_time,
        timezone: row.timezone,
        roleId: row.role_id
    };
}
