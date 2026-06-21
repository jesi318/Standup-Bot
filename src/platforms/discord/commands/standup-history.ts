import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/client.js";
import { getStandupHistory } from "../../../app/services/standupService.js";
import { createHistoryEmbed } from "../components/historyEmbed.js";
import { createHistoryPagination } from "../components/historyPagination.js";
const PAGE_SIZE = 5;

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("standup-history")
        .setDescription("View your recent standups."),
        // .addIntegerOption(option =>
        //     option.setName("count")
        //         .setDescription("Number of recent standups to display (default 5)")
        //         .setRequired(false)
        //         .setMinValue(1)
        //         .setMaxValue(20)
        // ),

    async execute(interaction) {
        if (!interaction.inGuild()) {
            await interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
            return;
        }

        const history = getStandupHistory(interaction.guildId, interaction.user.id, PAGE_SIZE + 1, 0);

        if (history.length === 0) {
            await interaction.reply({
                content: "No standup history found.",
                ephemeral: true,
            });
            return;
        }

        const hasNextPage =
            history.length > PAGE_SIZE;

        const pageItems =
            history.slice(0, PAGE_SIZE);

        const embed  = createHistoryEmbed(pageItems, 1);
        const pagebuttons = createHistoryPagination(1, hasNextPage);

        await interaction.reply({ embeds: [embed], components: [pagebuttons] });
    }
  
};

export default command;