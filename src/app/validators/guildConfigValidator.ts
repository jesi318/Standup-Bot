import type {
    GuildSettings,
} from "../models/GuildSettings.js";
import { VALID_WEEKDAYS } from "../utils/constants/weekdays.js";


export function validateGuildSettings(
    settings: GuildSettings
): void {

    validateFrequency(
        settings.frequency
    );

    validateTime(
        settings.scheduleTime
    );

    validateTimezone(
        settings.timezone
    );
}

function validateFrequency(
    frequency: string
): void {

    if (
        frequency === "daily"
    ) {
        return;
    }

    if (
        frequency.startsWith(
            "weekly:"
        )
    ) {

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

    if (
        !regex.test(
            scheduleTime
        )
    ) {
        throw new Error(
            "Time must be in HH:mm format."
        );
    }
}

function validateTimezone(
    timezone: string
): void {

    try {

        Intl.DateTimeFormat(
            undefined,
            {
                timeZone:
                    timezone,
            }
        );

    } catch {

        throw new Error(
            "Invalid timezone."
        );
    }
}