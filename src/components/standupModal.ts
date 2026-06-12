import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const STANDUP_MODAL_ID = "standup_modal";

export function createStandupModal() {
    const yesterdayInput = new TextInputBuilder()
        .setCustomId("yesterday")
        .setLabel("What did you do yesterday?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const todayInput = new TextInputBuilder()
        .setCustomId("today")
        .setLabel("What are you working on today?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const blockersInput = new TextInputBuilder()
        .setCustomId("blockers")
        .setLabel("Do you have any blockers?")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false);

    return new ModalBuilder()
        .setCustomId(STANDUP_MODAL_ID)
        .setTitle("Submit Your Standup")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(yesterdayInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(todayInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(blockersInput)
        );

}
