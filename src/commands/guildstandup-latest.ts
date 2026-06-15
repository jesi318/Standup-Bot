import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/client.js";
import { getLatestStandupGuild } from "../services/standupService.js";

const command : SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("standup-latest")
        .setDescription("Get the latest standup report for a guild."),

    async execute(interaction) {
        if (!interaction.inGuild()) {
            await interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
            return;
        }

       const standup = getLatestStandupGuild(interaction.guildId);

         if (standup.length === 0) {
            await interaction.reply({
                content: "No standups have been submitted yet!",
            });
            return;
        }  

        const formattedStandups = standup.map((s: any) => `
            ## ${s.username}'s Latest Standup

            **Yesterday**
            ${s.yesterday}

            **Today**
            ${s.today}

            **Blockers**
            ${s.blockers}

            **Submitted At**
            ${s.standup_date}
        `).join("\n--------------------------\n");

        await interaction.reply({content: formattedStandups});
        
    },

};

export default command;