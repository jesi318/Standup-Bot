
import type { StandupConfig } from "../../domain/models/StandupConfig.js";
import { db } from "./db.js";

export function createorUpdateStandupConfig(settings: StandupConfig) {
    const stmt = db.prepare(`
        INSERT INTO guild_settings (
            guild_id,
            channel_id,
            frequency,
            schedule_time,
            timezone,
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
    stmt.run(settings.workspaceId, settings.channelId, settings.frequency, settings.scheduleTime, settings.timezone, settings.participantGroupId);
}

export function getStandupConfig(
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

    return toStandupConfig(row);
}

export function getAllStandupConfigs() {
    const statement = db.prepare(`
        SELECT *
        FROM guild_settings
    `);

    return statement.all().map(toStandupConfig);
}

function toStandupConfig(row: any): StandupConfig {
    return {
        workspaceId: row.guild_id,
        platform: "discord",
        channelId: row.channel_id,
        frequency: row.frequency,
        scheduleTime: row.schedule_time,
        timezone: row.timezone,
        participantGroupId: row.role_id
    };
}
