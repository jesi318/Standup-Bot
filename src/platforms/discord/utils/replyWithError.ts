import type { Interaction } from "discord.js";
    
export async function replyWithError(interaction: Interaction) {
    const content =
        "Something went wrong. Please try again.";

    if (!interaction.isRepliable()) {
        return;
    }

    if (
        interaction.replied ||
        interaction.deferred
    ) {

        await interaction.followUp({
            content,
            ephemeral: true,
        });

        return;
    }

    await interaction.reply({
        content,
        ephemeral: true,
    });
}