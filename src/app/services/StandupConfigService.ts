import { VALID_WEEKDAYS } from "../../domain/constants/weekdays.js";
import { createorUpdateStandupConfig, getAllStandupConfigs, getStandupConfig, } from "../../infrastructure/database/standupConfigRepository.js";
import { validateStandupConfig } from "../validators/standupConfigValidator.js";
import { normalizeStandupConfig } from "../normalizers/standupConfigNormalizer.js";
import type { StandupConfig } from "../../domain/models/StandupConfig.js";

export function saveStandupConfig(settings: StandupConfig) {

    const normalizedSettings: StandupConfig = normalizeStandupConfig(settings);

    validateStandupConfig(normalizedSettings);

    return createorUpdateStandupConfig(normalizedSettings);
}

export function fetchStandupConfig(guildId: string) {
    return getStandupConfig(guildId);
}

export function fetchAllStandupConfigs() {
    return getAllStandupConfigs();
}

