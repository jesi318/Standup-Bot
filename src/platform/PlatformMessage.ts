import type { PlatformAction } from "./PlatformAction.js";

export interface PlatformMessage {
    text: string;
    actions?: PlatformAction[];
}

