import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/client.js";
import { createStandupConfigModal } from "../components/standupConfigModal.js";

const command : SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("standup-config")
        .setDescription("Configure your standup settings."),

    async execute(interaction) {
        await interaction.showModal(
            createStandupConfigModal()
        );
    }
}

export default command;