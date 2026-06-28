import { CardFactory, type TurnContext } from "botbuilder";
import type { PlatformAdapter } from "../../platform/PlatformAdapter.js";
import type { PlatformUser } from "../../platform/PlatformUser.js";
import type { PlatformMessage } from "../../platform/PlatformMessage.js";

interface TeamsAdapterDependencies {
    turnContext: TurnContext;
}

export function createTeamsAdapter(dependencies: TeamsAdapterDependencies): PlatformAdapter {
    const { turnContext } = dependencies;

    return {
        async sendChannelMessage(channelId: string, message: { text: string; actions?: { id: string; label: string }[] }) {
            await turnContext.sendActivity({
                type: "message",
                attachments: message.actions ? [CardFactory.adaptiveCard(buildTeamsAdaptiveCard(message))] : [],
            });
        },
        async getParticipants(workspaceId: string, participantGroupId: string) : Promise<PlatformUser[]> {
            throw new Error(
                "Teams participant lookup is not implemented yet."
            );
        },
        formatMention(
            userId: string
        ): string {
            return `<at>${userId}</at>`;
        },
    };
}

function buildTeamsAdaptiveCard(message: PlatformMessage) {
    return {
        type: "AdaptiveCard",
        version: "1.4",
        body: [
            {
                type: "TextBlock",
                text: message.text,
                wrap: true,
            },
        ],
        actions: message.actions?.map((action) => ({
            type: "Action.Submit",
            title: action.label,
            data: {
                actionId: action.id,
            },
        })),
    };
}