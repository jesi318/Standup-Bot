import type { StandupConfig } from "../../../domain/models/StandupConfig.js";

export interface DiscordStandupConfigInput {
    guildId: string;
    channelId: string;
    roleId: string;
    frequency: string;
    scheduleTime: string;
    timezone: string;
}

export function toStandupConfigFromDiscord(input: DiscordStandupConfigInput) : StandupConfig {
    return {
        workspaceId: input.guildId,
        platform: "discord",
        channelId: input.channelId,
        frequency: input.frequency,
        scheduleTime: input.scheduleTime,
        timezone: input.timezone,
        participantGroupId: input.roleId
    };
}