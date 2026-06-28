import { getLocalDate } from "../../utils/dateTimeUtils.js";
import type { StandupConfig } from "../../domain/models/StandupConfig.js";
import type { PlatformAdapter } from "../../platform/PlatformAdapter.js";
import { getSubmittedUserIdsForDate } from "../../infrastructure/database/standupRepository.js";

export interface ReminderService {
    sendStandupReminder(config: StandupConfig): Promise<void>;
    sendMissingStandupReminder(config: StandupConfig): Promise<void>;
}


export function createReminderService(dependencies: { platformAdapter: PlatformAdapter }): ReminderService {const {
    platformAdapter,
} = dependencies;

    return {
        async sendStandupReminder(config: StandupConfig): Promise<void> {
            await platformAdapter.sendChannelMessage(config.channelId, {
                text: "## 👥💬 Daily Standup\n\nClick below to submit your standup.",
                actions: [
                    {
                        id: "submit_standup",
                        label: "Submit Standup"
                    }
                ]
            });
        },

        async sendMissingStandupReminder(config: StandupConfig): Promise<void> {
            const participants = await platformAdapter.getParticipants(config.workspaceId, config.participantGroupId);

            const expectedParticipants = participants.filter(participant => !participant.isBot);
            
            if (expectedParticipants.length === 0) {
                return;
            }

            const standupDate = getLocalDate(config.timezone);
            const submittedUserIds =  new Set (getSubmittedUserIdsForDate(config.workspaceId, standupDate));

            const missingParticipants = expectedParticipants.filter(participant => !submittedUserIds.has(participant.id));

            if (missingParticipants.length === 0) {
                return;
            }
            
            const mentions = missingParticipants.map(participant => platformAdapter.formatMention(participant.id)).join(", ");

            await platformAdapter.sendChannelMessage(config.channelId, {
                text: `Standup reminder: ${mentions}\n\nYou have not submitted today's standup yet.`
            });
        }
    };
}