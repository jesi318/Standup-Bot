import type { ButtonInteraction } from "discord.js";
import { SUBMIT_STANDUP_BUTTON_ID } from "../components/submitStandupButton.js";
import { createStandupModal } from "../components/standupModal.js";

export async function handleButton(interaction: ButtonInteraction) {
    if (interaction.isButton()) {
        switch (interaction.customId) {
            case SUBMIT_STANDUP_BUTTON_ID:
                await interaction.showModal(
                    createStandupModal()
                );
                break;
        }
    }
}