import {
    PermissionFlagsBits,
    type CommandInteraction,
    type ModalSubmitInteraction,
} from "discord.js";

export async function ensureAdministrator(
    interaction:
        | CommandInteraction
        | ModalSubmitInteraction
) {

    if (
        !interaction.memberPermissions?.has(
            PermissionFlagsBits.ManageGuild
        )
    ) {
        await interaction.reply({
            content:
                "✋ You need the **Manage Guild** permission to perform this action.",
            ephemeral: true,
        });

        return false;
    }

    return true;
}