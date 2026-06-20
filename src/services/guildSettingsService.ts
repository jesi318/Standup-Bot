import { VALID_WEEKDAYS } from "../utils/constants/weekdays.js";
import { createorUpdateGuildSettings, getAllGuildSettings, getGuildSettings } from "../database/guildSettingsRepository.js";
import type { GuildSettings } from "../models/GuildSettings.js";
import { validateGuildSettings } from "../validators/guildConfigValidator.js";
import { normalizeGuildSettings } from "../normalizers/guildSettingsNormalizer.js";

export function saveGuildSettings(settings: GuildSettings) {

    const normalizedSettings: GuildSettings = normalizeGuildSettings(settings);

    validateGuildSettings(normalizedSettings);

    return createorUpdateGuildSettings(normalizedSettings);
}

export function fetchGuildSettings(guildId: string) {
    return getGuildSettings(guildId);
}

export function fetchAllGuildSettings() {
    return getAllGuildSettings();
}

