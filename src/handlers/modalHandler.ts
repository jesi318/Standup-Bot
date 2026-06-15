import { PermissionFlagsBits, type ModalSubmitInteraction } from "discord.js";
import { submitStandup } from "../services/standupService.js";
import { STANDUP_MODAL_ID } from "../components/standupModal.js";
import { STANDUP_CONFIG_MODAL_ID } from "../components/standupConfigModal.js";
import { saveGuildSettings } from "../services/guildSettingsService.js";
import { VALID_WEEKDAYS } from "../utils/constants/weekdays.js";

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

async function handleStandupConfigModalSubmit(interaction: ModalSubmitInteraction) {
    if (
    !interaction.memberPermissions?.has(
        PermissionFlagsBits.ManageGuild
    )
) {
    await interaction.reply({
        content:
            "❌ Only server managers can configure standups.",
        ephemeral: true,
    });

    return;
}
    
    const frequency = interaction.fields.getTextInputValue('frequency').trim().toLowerCase();
    const time = interaction.fields.getTextInputValue('time').trim();
    const timezone = interaction.fields.getTextInputValue('timezone').trim();

    const inGuild = await checkifinGuild(interaction);
    if (!inGuild) return;

    if (!isValidFrequencyInput(frequency)) {
        await interaction.reply({
            content: "Invalid frequency. Please enter 'daily' or 'weekly:weekday'.",
            ephemeral: true,
        });
        return;
    }

    if (!isValidTimeInput(time)) {
        await interaction.reply({
            content: "Invalid time format. Please enter time in HH:mm format (24-hour).",
            ephemeral: true,
        });
        return;
    }

    if (!isValidTimezoneInput(timezone)) {
        await interaction.reply({
            content: "Invalid timezone. Please enter a valid timezone ('America/New_York').",
            ephemeral: true,
        });
        return;
    }

    try {
        saveGuildSettings(
            interaction.guildId!,
            interaction.channelId!,
            frequency,
            time,
            timezone
        );

        await interaction.reply({
            content: `Standup settings updated successfully to **${frequency}** at **${time}** ${timezone} 🗓️`,
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
    const yesterday = interaction.fields.getTextInputValue('yesterday');
    const today = interaction.fields.getTextInputValue('today');
    const blockers = interaction.fields.getTextInputValue('blockers');

    const inGuild = await checkifinGuild(interaction);
    if (!inGuild) return;

    try{

    submitStandup(
        interaction.guildId!,
        interaction.user.id,
        interaction.user.username,
        yesterday,
        today,
        blockers
    );

    await interaction.reply({
        content:
            "Standup submitted successfully! 🫡",
        ephemeral: true,
    });
} catch (error) {
    await interaction.reply({
        content:
            error instanceof Error
                ? error.message
                : "Failed to submit standup.",
        ephemeral: true,
    });
}
}

async function checkifinGuild(interaction: ModalSubmitInteraction) {
    if (!interaction.inGuild()) {
        await interaction.reply({
            content:
                "This action can only be used in a server.",
            ephemeral: true,
        });

        return false;
    }
    return true;
}


// #region helpers
function isValidFrequencyInput(frequency: string): boolean {
    if (frequency === "daily") {
        return true;
    }
    if (frequency.startsWith("weekly:")) {
        const [, day] = frequency.split(":");
        return VALID_WEEKDAYS.includes(day as typeof VALID_WEEKDAYS[number])

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
// #endregion