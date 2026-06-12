import { SlashCommandBuilder } from "discord.js";
import {type SlashCommand } from "../types/client.js";
import { submitStandup } from "../services/standupService.js";

const command : SlashCommand = {
    data: new SlashCommandBuilder()
        .setName("standup-submit")
        .setDescription("Submit your standup report for the day.")
        .addStringOption(option =>
            option.setName("yesterday")
                .setDescription("What did you work on yesterday?")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("today")
                .setDescription("What will you work on today?")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("blockers")
                .setDescription("What are you facing as blockers?")
                .setRequired(true)
        ) as SlashCommandBuilder,

    async execute(interaction) {
        if (!interaction.inGuild()) {
            await interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
            return;
        }

        const yesterday = interaction.options.getString("yesterday", true);
        const today = interaction.options.getString("today", true);
        const blockers = interaction.options.getString("blockers", true);


        submitStandup(interaction.guildId, interaction.user.id, interaction.user.username, yesterday, today, blockers);

        await interaction.reply("Standup submitted!");
    }

};

export default command;