import type { StandupConfig } from "../../../domain/models/StandupConfig.js";

export interface StandupConfigRow {
    guild_id: string;
    channel_id: string;
    role_id: string;
    frequency: string;
    schedule_time: string;
    timezone: string;
}

export function toStandupConfig(row: StandupConfigRow): StandupConfig { 
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

export function toStandupConfigParams(config: StandupConfig) {
return {
    workspaceId: config.workspaceId,
    channelId: config.channelId,
    frequency: config.frequency,
    scheduleTime: config.scheduleTime,
    timezone: config.timezone,
    participantGroupId: config.participantGroupId,
};
}