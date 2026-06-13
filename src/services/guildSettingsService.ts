import { createorUpdateGuildSettings, getAllGuildSettings, getGuildSettings } from "../database/guildSettingsRepository.js";

export function saveGuildSettings(guildId: string, channelId: string, frequency: string, scheduleTime: string, timezone: string) {
    return createorUpdateGuildSettings(guildId, channelId, frequency, scheduleTime, timezone);
}

export function fetchGuildSettings(guildId: string) {
    return getGuildSettings(guildId);
}

export function fetchAllGuildSettings() {
    return getAllGuildSettings();
}