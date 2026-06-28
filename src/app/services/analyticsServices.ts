import type { AttendanceStats } from "../../domain/models/AttendanceStats.js";
import { getStandupsForUserInRange, getStandupsForWorkspaceInRange } from "../../infrastructure/database/analyticsRepository.js";

export function getWorkspaceAttendanceStats(workspaceId: string, fromDate: string, toDate: string): AttendanceStats {
    const standups = getStandupsForWorkspaceInRange(workspaceId, fromDate, toDate);
    
    const submittedDays = new Set(standups.map(standup => standup.standup_date)).size;
    return {
        workspaceId,
        fromDate,
        toDate,
        totalStandups: standups.length,
        submittedDays
    };
}

export function getUserAttendanceStats(workspaceId: string, userId: string, fromDate: string, toDate: string): AttendanceStats {
    const standups = getStandupsForUserInRange(workspaceId, userId, fromDate, toDate);

    const submittedDays = new Set(standups.map(standup => standup.standup_date)).size;
    return {
        workspaceId,
        userId,
        fromDate,
        toDate,
        totalStandups: standups.length,
        submittedDays
    };
}