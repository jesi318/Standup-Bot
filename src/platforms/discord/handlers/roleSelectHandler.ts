import type { RoleSelectMenuInteraction } from "discord.js";
import { STANDUP_ROLE_SELECT_ID } from "../components/standupRoleSelect.js";
import { ensureAuthorized } from "../utils/permissions.js";
import { createConfigSession } from "../../../app/sessions/configSessionStore.js";
import type { ConfigSession } from "../../../domain/models/ConfigSession.js";
import { createStandupConfigModal } from "../components/standupConfigModal.js";

export async function handleRoleSelect(interaction: RoleSelectMenuInteraction) {
    if (interaction.customId !== STANDUP_ROLE_SELECT_ID) {
        return;
    }

    const authorized = await ensureAuthorized(interaction);
    if (!authorized) {
        return;
    }

    if (!interaction.inGuild()) {
        await interaction.reply({
            content: "This command can only be used in a server.",
            ephemeral: true,
        });
        return;
    }

    const roleid = interaction.values[0];

    if (!roleid) {
        await interaction.reply({
            content: "No role selected.",
            ephemeral: true,
        });
        return;
    }

    const session: ConfigSession = { workspaceId: interaction.guildId, userId: interaction.user.id, participantGroupId: roleid };

    createConfigSession(session);

    await interaction.showModal(createStandupConfigModal());
}