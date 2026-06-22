import type { Client } from "discord.js";
import { createSubmitStandupButton } from "../../platforms/discord/components/submitStandupButton.js";
import { getLocalDate } from "../../utils/dateTimeUtils.js";
import { getSubmittedUserIdsForDate } from "../../infrastructure/database/standupRepository.js";
import type { StandupConfig } from "../../domain/models/StandupConfig.js";

export async function sendStandupReminder(client: Client, channelId: string) {
    
    const channel = await client.channels.fetch(channelId);

    if(!channel || !channel.isTextBased() || channel.isDMBased()) {
        throw new Error(`Channel not found or not text-based: ${channelId}`);
    }
    
    await channel.send({
        content: "## 👥💬 Daily Standup\n\nClick below to submit your standup.",
        components: [
            createSubmitStandupButton()
        ]
    });
}

export async function sendMissingStandupReminder(client: Client, setting: StandupConfig) {
    const guild = await client.guilds.fetch(setting.workspaceId);
    const channel = await guild.channels.fetch(setting.channelId);
    
    if (!channel || !channel.isTextBased() || channel.isDMBased()) {
        throw new Error(`Channel not found or not text-based: ${setting.channelId}`);
    }

    const role = await guild.roles.fetch(setting.participantGroupId);
    
    if (!role) {
        throw new Error(`Role  ${setting.participantGroupId} configured for standup not found`);
    }
    
    const expectedMembers = role.members.filter(member => !member.user.bot && member.roles.cache.has(role.id));

    if (expectedMembers.size === 0) {
        return;
    }

    const standupDate = getLocalDate(setting.timezone);
    const submittedUserIds = await getSubmittedUserIdsForDate(setting.workspaceId, standupDate);

    const missingMembers = expectedMembers.filter(member => !submittedUserIds.includes(member.id));

    if (missingMembers.size === 0) {
        return;
    }

    const mentions = missingMembers.map(member => `<@${member.id}>`).join(", ");

    await channel.send({
        content:
            `Standup reminder: ${mentions}\n\nYou have not submitted today's standup yet.`,
    });
}