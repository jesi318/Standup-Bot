import type { ButtonInteraction, CacheType } from "discord.js";
import { SUBMIT_STANDUP_BUTTON_ID } from "../components/submitStandupButton.js";
import { createStandupModal } from "../components/standupModal.js";
import { getStandupHistory } from "../../../app/services/standupService.js";
import { createHistoryEmbed } from "../components/historyEmbed.js";
import { createHistoryPagination } from "../components/historyPagination.js";

const PAGE_SIZE = 5;

export async function handleButton(interaction: ButtonInteraction) {
    if (interaction.isButton()) {
        switch (true) {
            case interaction.customId === SUBMIT_STANDUP_BUTTON_ID:
                await interaction.showModal(createStandupModal());
                break;
            case interaction.customId.startsWith("history:"):
                await handleHistoryPagination(interaction);
                break;
            default:
                await interaction.reply({
                    content: "Unknown button clicked.",
                    ephemeral: true,
                });
        }
    }
}

async function handleHistoryPagination(interaction: ButtonInteraction<CacheType>) {
    if(!interaction.inGuild()) {
        return;
    }

    const page = Number(interaction.customId.split(":")[1]);

    const offset = (page - 1) * PAGE_SIZE;

    const history = getStandupHistory(interaction.guildId, interaction.user.id, PAGE_SIZE + 1, offset);

    const hasNextPage = history.length > PAGE_SIZE;
    
    const pageItems = history.slice(0, PAGE_SIZE);

    await interaction.update({
        embeds: [createHistoryEmbed(pageItems, page)],
        components: [createHistoryPagination(page, hasNextPage)],
    });


}
