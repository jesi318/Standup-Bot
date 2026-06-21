import type { ConfigSession } from "../models/ConfigSession.js";

const sessions = new Map<string, ConfigSession>();

function getKey(guildId: string, userId: string): string {
    return `${guildId}:${userId}`;
}

export function createConfigSession(session: ConfigSession): void {
    sessions.set(getKey(session.guildId, session.userId), session);
}

export function getConfigSession(guildId: string, userId: string): ConfigSession | undefined {
    return sessions.get(getKey(guildId, userId));
}

export function deleteConfigSession(guildId: string, userId: string): void {
    sessions.delete(getKey(guildId, userId));
}