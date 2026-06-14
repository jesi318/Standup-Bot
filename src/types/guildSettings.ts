export interface GuildSettings {
    guildId: string;
    channelId: string;
    frequency: Frequency;
    scheduleTime: string;
    timezone: string;
}

export type Frequency =
    | "daily"
    | `weekly:${string}`;