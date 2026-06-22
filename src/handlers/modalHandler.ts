import { PermissionFlagsBits, type ModalSubmitInteraction } from "discord.js";
import { submitStandup } from "../app/services/standupService.js";
import { STANDUP_MODAL_ID } from "../platforms/discord/components/standupModal.js";
import { STANDUP_CONFIG_MODAL_ID } from "../platforms/discord/components/standupConfigModal.js";
import { saveGuildSettings } from "../app/services/guildSettingsService.js";
import { VALID_WEEKDAYS } from "../domain/constants/weekdays.js";
import type { StandupSubmission } from "../domain/models/StandupSubmission.js";
import type { GuildSettings } from "../domain/models/GuildSettings.js";
import { ensureAuthorized } from "../platforms/discord/utils/permissions.js";
import {
  deleteConfigSession,
  getConfigSession,
} from "../app/sessions/configSessionStore.js";

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
  switch (interaction.customId) {
    case STANDUP_MODAL_ID:
      await handleStandupModalSubmit(interaction);
      break;
    case STANDUP_CONFIG_MODAL_ID:
      await handleStandupConfigModalSubmit(interaction);
      break;
    default:
      await interaction.reply({
        content: "Unknown modal submitted.",
        ephemeral: true,
      });
  }
}

async function handleStandupConfigModalSubmit(
  interaction: ModalSubmitInteraction,
) {
  try {
    const isAdmin = await ensureAuthorized(interaction);
    if (!isAdmin) return;

    const inGuild = await checkifinGuild(interaction);
    if (!inGuild) return;

    const session = getConfigSession(interaction.guildId!, interaction.user.id);

    if (!session) {
      await interaction.reply({
        content:
          "Configuration session expired. Please run /standup-config again.",

        ephemeral: true,
      });
      return;
    }

    const settings: GuildSettings = {
      guildId: interaction.guildId!,
      channelId: interaction.channelId!,
      frequency: interaction.fields
        .getTextInputValue("frequency")
        .trim()
        .toLowerCase(),
      scheduleTime: interaction.fields.getTextInputValue("time").trim(),
      timezone: interaction.fields.getTextInputValue("timezone").trim(),
      roleId: session.roleId,
    };

    const validationError = ValidateGuildSettingsInput(settings);

    if (validationError) {
      await interaction.reply({
        content: validationError,
        ephemeral: true,
      });
      return;
    }
    saveGuildSettings(settings);

    deleteConfigSession(interaction.guildId!, interaction.user.id);
    await interaction.reply({
      content: `Standup settings updated successfully to **${settings.frequency}** at **${settings.scheduleTime}** ${settings.timezone} 🗓️`,
    });
  } catch (error) {
    await interaction.reply({
      content:
        error instanceof Error
          ? error.message
          : "Failed to save standup settings.",
    });
  }
}

async function handleStandupModalSubmit(interaction: ModalSubmitInteraction) {
  try {
    const inGuild = await checkifinGuild(interaction);
    if (!inGuild) return;

    const submission: StandupSubmission =
      constructStandupSubmission(interaction);

    submitStandup(submission);

    await interaction.reply({
      content: "Standup submitted successfully! 🫡",
      ephemeral: true,
    });
  } catch (error) {
    await interaction.reply({
      content:
        error instanceof Error ? error.message : "Failed to submit standup.",
      ephemeral: true,
    });
  }
}

// #region helpers
async function checkifinGuild(interaction: ModalSubmitInteraction) {
  if (!interaction.inGuild()) {
    await interaction.reply({
      content: "This action can only be used in a server.",
      ephemeral: true,
    });

    return false;
  }
  return true;
}

function isValidFrequencyInput(frequency: string): boolean {
  if (frequency === "daily") {
    return true;
  }
  if (frequency.startsWith("weekly:")) {
    const [, day] = frequency.split(":");
    return VALID_WEEKDAYS.includes(day as (typeof VALID_WEEKDAYS)[number]);
  }
  return false;
}

function isValidTimeInput(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

function isValidTimezoneInput(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (e) {
    return false;
  }
}
function constructStandupSubmission(
  interaction: ModalSubmitInteraction,
): StandupSubmission {
  return {
    guildId: interaction.guildId!,
    userId: interaction.user.id,
    username: interaction.user.username,
    yesterday: interaction.fields.getTextInputValue("yesterday"),
    today: interaction.fields.getTextInputValue("today"),
    blockers: interaction.fields.getTextInputValue("blockers"),
  };
}

function ValidateGuildSettingsInput(settings: GuildSettings): string | null {
  if (!isValidFrequencyInput(settings.frequency)) {
    return "Invalid frequency. Please enter 'daily' or 'weekly:weekday'.";
  }

  if (!isValidTimeInput(settings.scheduleTime)) {
    return "Invalid time format. Please enter time in HH:mm format (24-hour).";
  }

  if (!isValidTimezoneInput(settings.timezone)) {
    return "Invalid timezone. Please enter a valid timezone ('America/New_York').";
  }

  return null;
}

// #endregion
