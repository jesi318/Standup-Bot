import type { ConfigSession } from "../../domain/models/ConfigSession.js";

const sessions = new Map<string, ConfigSession>();

function getKey(workspaceId: string, userId: string): string {
    return `${workspaceId}:${userId}`;
}

export function createConfigSession(session: ConfigSession): void {
    sessions.set(getKey(session.workspaceId, session.userId), session);
}

export function getConfigSession(workspaceId: string, userId: string): ConfigSession | undefined {
    return sessions.get(getKey(workspaceId, userId));
}

export function deleteConfigSession(workspaceId: string, userId: string): void {
    sessions.delete(getKey(workspaceId, userId));
}