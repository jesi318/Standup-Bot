import { createStandup, getLatestStandupforGuild, getLatestStandupforUser } from "../database/standupRepository.js";


export function submitStandup(guildId: string, userId: string, username: string, yesterday: string, today: string, blockers: string) {
    return createStandup(guildId, userId, username, yesterday, today, blockers);
}

export function getLatestStandupUser(guildId: string, userId: string) {
    return getLatestStandupforUser(guildId, userId);
}

export function getLatestStandupGuild(guildId: string) {
    return getLatestStandupforGuild(guildId);
}


