import type { StandupSubmission } from "../models/standupSubmission.js";

export function validateStandup(submission: StandupSubmission): boolean {
    if (!submission.yesterday.trim()) {
        throw new Error("Yesterday's input cannot be empty.");
    }
    if (!submission.today.trim()) {
        throw new Error("Today's input cannot be empty.");
    }
    if (
        submission.yesterday.length > 1000
    ) {
        throw new Error(
            "Yesterday is too long. Be concise."
        );
    }

    if (
        submission.today.length > 1000
    ) {
        throw new Error(
            "Today is too long. Be concise."
        );
    }

    if (
        submission.blockers.length > 1000
    )
    {
        throw new Error(
            "Blockers is too long. Be concise."
        );
    }

    return true;
}