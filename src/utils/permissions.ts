import {
    PermissionFlagsBits,
    type CommandInteraction,
    type ModalSubmitInteraction,
    type ButtonInteraction,
} from "discord.js";

export async function ensureAuthorized(
    interaction:
        | CommandInteraction
        | ModalSubmitInteraction
        | ButtonInteraction
) : Promise<boolean> {

    if (
        !interaction.memberPermissions?.has(
            PermissionFlagsBits.ManageGuild
        )
    ) {
        await interaction.reply({
            content:
                "✋ You need the **Manage Guild** permission to perform this action.",
        });

        return false;
    }
    return true;
}