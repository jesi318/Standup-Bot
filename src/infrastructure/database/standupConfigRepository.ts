
import type { StandupConfig } from "../../domain/models/StandupConfig.js";
import { toStandupConfig, toStandupConfigParams, type StandupConfigRow } from "../../platforms/discord/mappers/standupConfigRowMapper.js";
import { db } from "./db.js";

export function createorUpdateStandupConfig(config: StandupConfig) {
    const row = toStandupConfigParams(config);
    
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
    stmt.run(row.workspaceId, row.channelId, row.frequency, row.scheduleTime, row.timezone, row.participantGroupId);
}

export function getStandupConfig(
    workspaceId: string
) : StandupConfig | undefined {
    const statement = db.prepare(`
        SELECT *
        FROM guild_settings
        WHERE guild_id = ?
    `);

    const row = statement.get(workspaceId) as StandupConfigRow | undefined;

    if (!row) {
        return undefined;
    }

    return toStandupConfig(row);
}

export function getAllStandupConfigs() : StandupConfig[] {
    const statement = db.prepare(`
        SELECT *
        FROM guild_settings
    `);

    const rows = statement.all() as StandupConfigRow[];
    return rows.map(toStandupConfig);
}

