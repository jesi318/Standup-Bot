export interface AttendanceStats {
    workspaceId: string;
    userId?: string;
    fromDate: string;
    toDate: string;
    totalStandups: number;
    submittedDays: number;
}