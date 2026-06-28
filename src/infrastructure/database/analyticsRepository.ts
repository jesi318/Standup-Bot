import { db } from "./db.js";

export interface StandupAnalyticsRow {
    id: number;
    guild_id: string;
    user_id : string;
    username: string;
    yesterday: string;
    today: string;
    blockers: string;
    standup_date: string;
}

export function getStandupsForWorkspaceInRange(workspaceId: string, fromDate: string, toDate: string): StandupAnalyticsRow[] {
    const stmt = db.prepare(`
        SELECT * FROM standups
        WHERE guild_id = ? AND standup_date >= ? AND standup_date <= ?
        ORDER BY standup_date DESC
    `);
    return stmt.all(workspaceId, fromDate, toDate) as StandupAnalyticsRow[];
}

export function getStandupsForUserInRange(workspaceId: string, userId: string, fromDate: string, toDate: string): StandupAnalyticsRow[] {
    const stmt = db.prepare(`
        SELECT * FROM standups
        WHERE guild_id = ? AND user_id = ? AND standup_date >= ? AND standup_date <= ?
        ORDER BY standup_date DESC
    `);
    return stmt.all(workspaceId, userId, fromDate, toDate) as StandupAnalyticsRow[];
}