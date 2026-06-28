import type { PlatformMessage } from "./PlatformMessage.js";
import type { PlatformUser } from "./PlatformUser.js";

export interface PlatformAdapter {
    sendChannelMessage(channelId: string, message: PlatformMessage): Promise<void>;

    getParticipants(workspaceId: string, participantGroupId: string): Promise<PlatformUser[]>;

    formatMention(userId: string): string;
}