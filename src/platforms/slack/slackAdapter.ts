import { WebClient } from "@slack/web-api";
import type { PlatformMessage } from "../../platform/PlatformMessage.js";
import type { PlatformAdapter } from "../../platform/PlatformAdapter.js";
import type { PlatformUser } from "../../platform/PlatformUser.js";

interface SlackAdapterDependencies {
    token: string;
}

export function createSlackAdapter(dependencies: SlackAdapterDependencies): PlatformAdapter {

    const client = new WebClient(dependencies.token);

    return {
        async sendChannelMessage(channelId: string, message: PlatformMessage): Promise<void> {
            await client.chat.postMessage({
                channel: channelId,
                text: message.text,
                blocks: buildSlackBlocks(message),
            });
        },  
        async getParticipants(workspaceId: string, _participantGroupId: string): Promise<PlatformUser[]> {
            throw new Error(

                "Slack participant lookup is not implemented yet."

            );
        },
        formatMention(userId: string): string {
            return `<@${userId}>`;
        }
    }
}

function buildSlackBlocks(message: PlatformMessage) {
    if (!message.actions || message.actions.length === 0) {
        return undefined;
    }

    return [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: message.text,
            },
        },
        {
            type: "actions",
            elements: message.actions.map(action => ({
                type: "button",
                text: {
                    type: "plain_text",
                    text: action.label,
                },
                value: action.id,
                action_id: action.id,
            })),
        }
    ]
}
