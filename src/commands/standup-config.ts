import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/client.js";
import { createStandupConfigModal } from "../components/standupConfigModal.js";
import { ensureAdministrator } from "../utils/permissions.js";

const command : SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("standup-config")
        .setDescription("Configure your standup settings."),

    async execute(interaction) {
       const isAdmin = await ensureAdministrator(interaction);
        
       if (!isAdmin) {
            return;
        }
        
        await interaction.showModal(
            createStandupConfigModal()
        );
    }
}

export default command;