import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export const SUBMIT_STANDUP_BUTTON_ID = "submit_standup";

export function createSubmitStandupButton() {
    const button = new ButtonBuilder()
        .setCustomId(SUBMIT_STANDUP_BUTTON_ID)
        .setLabel("Submit Standup")
        .setStyle(ButtonStyle.Primary)

    return new ActionRowBuilder<ButtonBuilder>().addComponents(button);
}