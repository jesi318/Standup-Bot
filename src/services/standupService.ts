import { getGuildSettings } from "../database/guildSettingsRepository.js";
import { upsertStandup, getLatestStandupforGuild, getLatestStandupforUser, getGuildStandupHistory } from "../database/standupRepository.js";
import type { StandupSubmission } from "../models/standupSubmission.js";
import { validateStandup } from "../validators/standupValidator.js";


export function submitStandup(submission: StandupSubmission, ) {
    const settings = getGuildSettings(submission.guildId);

    validateStandup(submission);
    
    if (!settings) {
        throw new Error(
            "Guild settings not configured. use /standup-config to set up the bot for your server."
        );
    }

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: settings.timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const year = parts.find(p => p.type === "year")!.value;
    const month = parts.find(p => p.type === "month")!.value;
    const day = parts.find(p => p.type === "day")!.value;

        const standupDate = `${year}-${month}-${day}`;

    return upsertStandup(submission, standupDate);
}

export function getLatestStandupUser(guildId: string, userId: string) {
    return getLatestStandupforUser(guildId, userId);
}

export function getLatestStandupGuild(guildId: string) {
    return getLatestStandupforGuild(guildId);
}

export function getStandupHistory(guildId: string, userId: string, limit: number = 5, offset: number = 0) {
    return getGuildStandupHistory(guildId, userId, limit, offset);
}


