import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/client.js";
import { getStandupHistory } from "../services/standupService.js";

const command: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("standup-history")
        .setDescription("View your recent standups.")
        .addIntegerOption(option =>
            option.setName("count")
                .setDescription("Number of recent standups to display (default 5)")
                .setRequired(false)
        ),

    async execute(interaction) {
        if (!interaction.inGuild()) {
            await interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
            return;
        }

        const count = interaction.options.getInteger("count") ?? undefined;
        const history = getStandupHistory(interaction.guildId, interaction.user.id, count, 0)

        if (history.length === 0) {
            await interaction.reply({
                content: "No standup history found.",
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder().setTitle("📜 Recent Standups");

        history.forEach((s: any) => {

            embed.addFields({

                name: `📅 ${s.standup_date}`,

                value:
                    `**Yesterday**
                    ${s.yesterday}

                    **Today**
                    ${s.today}

                    **Blockers**
                    ${s.blockers}`

            });

        });
        await interaction.reply({ embeds: [embed] });
    }
};

export default command;