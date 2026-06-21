import { SlashCommandBuilder } from "discord.js";
import {type SlashCommand } from "../types/client.js";
import { createStandupModal } from "../components/standupModal.js";

const command : SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("standup-submit")
        .setDescription("Submit your standup report for the day."),

    async execute(interaction) {
        await interaction.showModal(
            createStandupModal()
        );
    }

};

export default command;