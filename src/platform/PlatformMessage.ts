export interface PlatformMessage {
    text: string;
    actions?: PlatformAction[];
}

export interface PlatformAction {
    id: string;
    label: string;
}