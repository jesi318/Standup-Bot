import { SlashCommandBuilder } from "@discordjs/builders";
import { type SlashCommand } from "../types/client.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  
    async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

export default command;