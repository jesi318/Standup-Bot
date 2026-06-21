import { getGuildSettings } from "../database/guildSettingsRepository.js";
import {
  upsertStandup,
  getLatestStandupforGuild,
  getLatestStandupforUser,
  getGuildStandupHistory,
} from "../database/standupRepository.js";
import type { StandupSubmission } from "../models/standupSubmission.js";
import { getLocalDate } from "../utils/dateTimeUtils.js";
import { validateStandup } from "../validators/standupValidator.js";

export function submitStandup(submission: StandupSubmission) {
  const settings = getGuildSettings(submission.guildId);

  validateStandup(submission);

  if (!settings) {
    throw new Error(
      "Guild settings not configured. use /standup-config to set up the bot for your server.",
    );
  }

  const standupDate = getLocalDate(settings.timezone);
  return upsertStandup(submission, standupDate);
}

export function getLatestStandupUser(guildId: string, userId: string) {
  return getLatestStandupforUser(guildId, userId);
}

export function getLatestStandupGuild(guildId: string) {
  return getLatestStandupforGuild(guildId);
}

export function getStandupHistory(
  guildId: string,
  userId: string,
  limit: number = 5,
  offset: number = 0,
) {
  return getGuildStandupHistory(guildId, userId, limit, offset);
}
