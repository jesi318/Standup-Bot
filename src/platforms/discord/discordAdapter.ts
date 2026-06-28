import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type Client } from "discord.js";
import type { PlatformAdapter } from "../../platform/PlatformAdapter.js";
import type { PlatformMessage } from "../../platform/PlatformMessage.js";
import type { PlatformAction } from "../../platform/PlatformAction.js";
import type { PlatformUser } from "../../platform/PlatformUser.js";

export function createDiscordAdapter(client: Client): PlatformAdapter {
    return {
        sendChannelMessage: async (channelId: string, message: PlatformMessage): Promise<void> => {
            const channel = await client.channels.fetch(channelId);

            if (!channel || !channel.isTextBased() || channel.isDMBased()) {
                throw new Error(`Channel not found or not text-based: ${channelId}`);
            }

            await channel.send({
                content: message.text,
                components: message.actions ? [createActionRow(message.actions)] : []
            });
        },

        getParticipants: async (workspaceId: string, participantGroupId: string): Promise<PlatformUser[]> => {
            const guild = await client.guilds.fetch(workspaceId);

            const role = await guild.roles.fetch(participantGroupId);
            if (!role) {
                throw new Error(`Role not found: ${participantGroupId}`);
            }

            return role.members.map(member => ({
                id: member.id,
                displayName: member.displayName,
                isBot: member.user.bot
            }));
        },

    formatMention(userId: string): string {
            return `<@${userId}>`;
        }
    }
}

function createActionRow(actions: PlatformAction[]) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        actions.map(action => new ButtonBuilder()
            .setCustomId(action.id)
            .setLabel(action.label)
            .setStyle(ButtonStyle.Primary)
        ));
}