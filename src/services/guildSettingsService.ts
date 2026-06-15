import { VALID_WEEKDAYS } from "../utils/constants/weekdays.js";
import { createorUpdateGuildSettings, getAllGuildSettings, getGuildSettings } from "../database/guildSettingsRepository.js";

export function saveGuildSettings(guildId: string, channelId: string, frequency: string, scheduleTime: string, timezone: string) {
    frequency = validateFrequency(frequency);
    scheduleTime = validateTime(scheduleTime);
    timezone = validateTimezone(timezone);

    return createorUpdateGuildSettings(guildId, channelId, frequency, scheduleTime, timezone);
}

export function fetchGuildSettings(guildId: string) {
    return getGuildSettings(guildId);
}

export function fetchAllGuildSettings() {
    return getAllGuildSettings();
}

// #region helpers

function validateTime(
    scheduleTime: string
): string {

    const regex =
        /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!regex.test(scheduleTime)) {
        throw new Error(
            "Time must be in HH:mm format."
        );
    }

    return scheduleTime;
}

function validateTimezone(
    timezone: string
): string {

    const normalized =
        timezone.trim();

    try {

        Intl.DateTimeFormat(
            undefined,
            {
                timeZone: normalized,
            }
        );

        return normalized;

    } catch {

        throw new Error(
            "Invalid timezone."
        );

    }
}


function validateFrequency(
    frequency: string
): string {

    const normalized =
        frequency.trim().toLowerCase();

    if (
        normalized === "daily"
    ) {
        return normalized;
    }

    if (normalized.startsWith("weekly:")) {

        const [, day] =
            normalized.split(":");

        if (
            VALID_WEEKDAYS.includes(
                day as typeof VALID_WEEKDAYS[number]
            )
        ) {
            return `weekly:${day}`;
        }

    }

    throw new Error(
        "Frequency must be either 'daily' or 'weekly:weekday'."
    );
}

// #endregion