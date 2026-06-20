import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function createHistoryPagination(page: number, hasNextPage: boolean) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`history:${page - 1}`)
            .setLabel("◀ Previous")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(page === 1),

        new ButtonBuilder()
            .setCustomId(`history:${page + 1}`)
            .setLabel("Next ▶")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(!hasNextPage)
    );
}