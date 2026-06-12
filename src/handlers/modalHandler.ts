import type { ModalSubmitInteraction } from "discord.js";
import { submitStandup } from "../services/standupService.js";
import { STANDUP_MODAL_ID } from "../components/standupModal.js";

export async function handleModalSubmit(interaction: ModalSubmitInteraction) {
    switch (interaction.customId) {
        case STANDUP_MODAL_ID:
            await handleStandupModalSubmit(interaction);
            break;
        default:
            await interaction.reply({
                content: "Unknown modal submitted.",
                ephemeral: true,
            });
    }
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