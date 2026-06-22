import type { PlatformMessage } from "./PlatformMessage.js";

export interface PlatformAdapter {
    sendChannelMessage(channelId: string, message: PlatformMessage): Promise<void>;

    getParticipants(workspaceId: string): Promise<string[]>;
    
    formatMention(userId: string): string;
}