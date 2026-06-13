import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export const STANDUP_CONFIG_MODAL_ID = "standup_config_modal";

export function createStandupConfigModal() {
    const frequency = new TextInputBuilder()
        .setCustomId("frequency")
        .setLabel("Frequency")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("daily, weekly")
        .setRequired(true);

    const time = new TextInputBuilder()
        .setCustomId("time")
        .setLabel("Time")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("14:00")
        .setRequired(true);

    const timezone = new TextInputBuilder()
        .setCustomId("timezone")
        .setLabel("Timezone")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("UTC, GMT, etc.")
        .setRequired(true);

    return new ModalBuilder()
        .setCustomId(STANDUP_CONFIG_MODAL_ID)
        .setTitle("Standup Config")
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(frequency),
            new ActionRowBuilder<TextInputBuilder>().addComponents(time),
            new ActionRowBuilder<TextInputBuilder>().addComponents(timezone)
        )
}