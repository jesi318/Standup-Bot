import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/client.js";
import { getLatestStandupUser } from "../../../app/services/standupService.js";



const command : SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("my-standup")
        .setDescription("Get the latest standup report for a user."),

    async execute(interaction) {
        if (!interaction.inGuild()) {
            await interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
            return;
        }

       const standup = getLatestStandupUser(interaction.guildId, interaction.user.id);

         if (!standup) {
            await interaction.reply({
                content: "No standup report found for you.",
                ephemeral: true,
            });
            return;
        }  

        await interaction.reply({content: `
            ## Your Latest Standup

            **Yesterday**
            ${standup.yesterday}

            **Today**
            ${standup.today}

            **Blockers**
            ${standup.blockers}

            **Submitted At**
            ${standup.standup_date}
            `,
        });
        
    },

};


export default command;