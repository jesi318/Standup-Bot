import type {
    GuildSettings,
} from "../models/GuildSettings.js";

export function normalizeGuildSettings(
    settings: GuildSettings
): GuildSettings {

    return {

        ...settings,

        frequency:
            normalizeFrequency(
                settings.frequency
            ),

        scheduleTime:
            settings.scheduleTime.trim(),

        timezone:
            settings.timezone.trim(),
    };
}

function normalizeFrequency(
    frequency: string
): string {

    const normalized =
        frequency
            .trim()
            .toLowerCase();

    if (
        normalized === "daily"
    ) {
        return normalized;
    }

    const [, day] =
        normalized.split(":");

    return `weekly:${day}`;
}