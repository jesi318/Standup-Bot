import type { ChatInputCommandInteraction } from "discord.js";

export async function handleCommand(interaction: ChatInputCommandInteraction) {

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);

            if (interaction.replied) {
                await interaction.followUp({
                    content:
                        'There was an error executing this command.',
                })
            } else {
                await interaction.reply({
                    content:
                        'There was an error executing this command.',
                    ephemeral: true,
                })
            }
        }

    }