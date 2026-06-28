import { createorUpdateStandupConfig, getAllStandupConfigs, getStandupConfig, } from "../../infrastructure/database/standupConfigRepository.js";
import { validateStandupConfig } from "../validators/standupConfigValidator.js";
import { normalizeStandupConfig } from "../normalizers/standupConfigNormalizer.js";
import type { StandupConfig } from "../../domain/models/StandupConfig.js";

export function saveStandupConfig(settings: StandupConfig) {

    const normalizedSettings: StandupConfig = normalizeStandupConfig(settings);

    validateStandupConfig(normalizedSettings);

    return createorUpdateStandupConfig(normalizedSettings);
}

export function fetchStandupConfig(workspaceId: string) {
    return getStandupConfig(workspaceId);
}

export function fetchAllStandupConfigs() {
    return getAllStandupConfigs();
}

