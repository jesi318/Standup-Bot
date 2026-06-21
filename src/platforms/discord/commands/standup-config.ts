import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "../types/client.js";
import { createStandupConfigModal } from "../components/standupConfigModal.js";
import { ensureAuthorized } from "../../../utils/permissions.js";
import { createStandupRoleSelect } from "../components/standupRoleSelect.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("standup-config")
    .setDescription("Configure your standup settings."),

  async execute(interaction) {
    const isAuthorized = await ensureAuthorized(interaction);

    if (!isAuthorized) {
      return;
    }

    await interaction.reply({
      content: "Please selct the role that should submit standups",
      components: [createStandupRoleSelect()],
      ephemeral: true,
    });
  },
};

export default command;
