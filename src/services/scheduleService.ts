import type { GuildSettings } from "../models/GuildSettings.js";

export function shouldSendReminder(setting: GuildSettings ): boolean {
    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: setting.timezone,
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    });

    const weekdayFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: setting.timezone,
        weekday: "long",
    });


    const currentTime = timeFormatter.format(now);
    const currentWeekday = weekdayFormatter.format(now).toLowerCase();

    if (setting.frequency === "daily") {
        return currentTime === setting.scheduleTime;
    }

    if (setting.frequency.startsWith("weekly:")) {
        const configuredDay =
            setting.frequency.split(":")[1];

        return (
            configuredDay === currentWeekday &&
            currentTime === setting.scheduleTime
        );
    }

     return false;
}