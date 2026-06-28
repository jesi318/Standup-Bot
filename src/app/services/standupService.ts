import { getStandupConfig } from "../../infrastructure/database/standupConfigRepository.js";
import {
  upsertStandup,
  getLatestStandupforWorkspace,
  getLatestStandupforUser,
  getWorkspaceStandupHistory,
} from "../../infrastructure/database/standupRepository.js";
import type { StandupSubmission } from "../../domain/models/StandupSubmission.js";
import { getLocalDate } from "../../utils/dateTimeUtils.js";
import { validateStandup } from "../validators/standupValidator.js";

export function submitStandup(submission: StandupSubmission) {
  const settings = getStandupConfig(submission.workspaceId);

  validateStandup(submission);

  if (!settings) {
    throw new Error(
      "Standup settings not configured. use /standup-config to set up the bot for your server.",
    );
  }

  const standupDate = getLocalDate(settings.timezone);
  return upsertStandup(submission, standupDate);
}

export function getLatestStandupUser(workspaceId: string, userId: string) {
  return getLatestStandupforUser(workspaceId, userId);
}

export function getLatestStandupWorkspace(workspaceId: string) {
  return getLatestStandupforWorkspace(workspaceId);
}

export function getStandupHistory(
  workspaceId: string,
  userId: string,
  limit: number = 5,
  offset: number = 0,
) {
  return getWorkspaceStandupHistory(workspaceId, userId, limit, offset);
}
