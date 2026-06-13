import { db } from "./db.js";

export function createorUpdateGuildSettings(guildId: string, channelId: string, frequency: string, scheduleTime: string, timezone: string) {
    const stmt = db.prepare(`
        INSERT INTO guild_settings (
            guild_id,
            channel_id,
            frequency,
            schedule_time,
            timezone
        )
        VALUES (?, ?, ?, ?, ?)

        ON CONFLICT(guild_id)
        DO UPDATE SET
            channel_id = excluded.channel_id,
            frequency = excluded.frequency,
            schedule_time = excluded.schedule_time,
            timezone = excluded.timezone
    `);
    stmt.run(guildId, channelId, frequency, scheduleTime, timezone);
}

export function getGuildSettings(
    guildId: string
) {
    const statement = db.prepare(`
        SELECT *
        FROM guild_settings
        WHERE guild_id = ?
    `);

    return statement.get(guildId);
}

export function getAllGuildSettings() {
    const statement = db.prepare(`
        SELECT *
        FROM guild_settings
    `);

    return statement.all();
}