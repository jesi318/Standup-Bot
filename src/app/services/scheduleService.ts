import type { GuildSettings } from "../../domain/models/GuildSettings.js";
import { addMinutesToTime } from "../../utils/dateTimeUtils.js";

const MISSING_REMINDER_DELAY_MINUTES = 1;

export function shouldSendReminder(setting: GuildSettings ): boolean {
    return isScheduleDue(setting, setting.scheduleTime)
}

export function shouldSendMissingReminder(setting: GuildSettings): boolean {
    const missingReminderTime = addMinutesToTime(setting.scheduleTime, MISSING_REMINDER_DELAY_MINUTES);
    return isScheduleDue(setting, missingReminderTime);
}

function isScheduleDue(setting: GuildSettings, targetTime: string): boolean {
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
        return currentTime === targetTime;
    }

    if (setting.frequency.startsWith("weekly:")) {
        const configuredDay =
            setting.frequency.split(":")[1];

        return (
            configuredDay === currentWeekday &&
            currentTime === targetTime
        );
    }

     return false;
}