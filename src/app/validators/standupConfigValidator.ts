import type { StandupConfig } from "../../domain/models/StandupConfig.js";
import { VALID_WEEKDAYS } from "../../domain/constants/weekdays.js";

export function validateStandupConfig(
    config: StandupConfig
): void {
    validateWorkspaceId(config.workspaceId);
    validatePlatform(config.platform);
    validateChannelId(config.channelId);
    validateParticipantGroupId(config.participantGroupId);
    validateFrequency(config.frequency);
    validateTime(config.scheduleTime);
    validateTimezone(config.timezone);
}

function validateWorkspaceId(
    workspaceId: string
): void {
    if (!workspaceId.trim()) {
        throw new Error("Workspace id is required.");
    }
}

function validatePlatform(
    platform: string
): void {
    if (
        platform !== "discord" &&
        platform !== "slack" &&
        platform !== "teams"
    ) {
        throw new Error("Invalid platform.");
    }
}

function validateChannelId(
    channelId: string
): void {
    if (!channelId.trim()) {
        throw new Error("Channel id is required.");
    }
}

function validateParticipantGroupId(
    participantGroupId: string
): void {
    if (!participantGroupId.trim()) {
        throw new Error("Participant group id is required.");
    }
}

function validateFrequency(
    frequency: string
): void {
    if (frequency === "daily") {
        return;
    }

    if (frequency.startsWith("weekly:")) {
        const [, day] =
            frequency.split(":");

        if (
            VALID_WEEKDAYS.includes(
                day as typeof VALID_WEEKDAYS[number]
            )
        ) {
            return;
        }
    }

    throw new Error(
        "Frequency must be either 'daily' or 'weekly:weekday'."
    );
}

function validateTime(
    scheduleTime: string
): void {
    const regex =
        /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!regex.test(scheduleTime)) {
        throw new Error("Time must be in HH:mm format.");
    }
}

function validateTimezone(
    timezone: string
): void {
    try {
        Intl.DateTimeFormat(
            undefined,
            {
                timeZone: timezone,
            }
        );
    } catch {
        throw new Error("Invalid timezone.");
    }
}