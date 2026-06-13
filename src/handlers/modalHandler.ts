import type { ModalSubmitInteraction } from "discord.js";
import { submitStandup } from "../services/standupService.js";
import { STANDUP_MODAL_ID } from "../components/standupModal.js";
import { STANDUP_CONFIG_MODAL_ID } from "../components/standupConfigModal.js";
import { saveGuildSettings } from "../services/guildSettingsService.js";

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
    const frequency = interaction.fields.getTextInputValue('frequency');
    const time = interaction.fields.getTextInputValue('time');
    const timezone = interaction.fields.getTextInputValue('timezone');

    const inGuild = await checkifinGuild(interaction);
    if (!inGuild) return;

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
}

async function handleStandupModalSubmit(interaction: ModalSubmitInteraction) {
    const yesterday = interaction.fields.getTextInputValue('yesterday');
    const today = interaction.fields.getTextInputValue('today');
    const blockers = interaction.fields.getTextInputValue('blockers');

    const inGuild = await checkifinGuild(interaction);
    if (!inGuild) return;
    
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