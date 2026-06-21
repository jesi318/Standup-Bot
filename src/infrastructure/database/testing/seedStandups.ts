import { db } from "../db.js";
import { migrate } from "../migrate.js";

type SeedOptions = {
    guildId: string;
    userId: string;
    username: string;
    days: number;
    clearExisting: boolean;
};

function parseBoolean(value: string | undefined, defaultValue: boolean) {
    if (value === undefined) {
        return defaultValue;
    }

    return value.toLowerCase() !== "false";
}

function getSeedOptions(): SeedOptions {
    return {
        guildId: process.env.SEED_GUILD_ID ?? "test-guild-id",
        userId: process.env.SEED_USER_ID ?? "test-user-id",
        username: process.env.SEED_USERNAME ?? "Test User",
        days: Number.parseInt(process.env.SEED_DAYS ?? "12", 10),
        clearExisting: parseBoolean(process.env.SEED_CLEAR_EXISTING, true),
    };
}

function toStandupDate(date: Date) {
    return date.toISOString().slice(0, 10);
}

function seedStandups() {
    migrate();

    const options = getSeedOptions();

    if (!Number.isFinite(options.days) || options.days < 1) {
        throw new Error("SEED_DAYS must be a positive integer.");
    }

    const insert = db.prepare(`
        INSERT INTO standups (
            guild_id,
            user_id,
            username,
            yesterday,
            today,
            blockers,
            standup_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(guild_id, user_id, standup_date)
        DO UPDATE SET
            username = excluded.username,
            yesterday = excluded.yesterday,
            today = excluded.today,
            blockers = excluded.blockers
    `);

    const deleteExisting = db.prepare(
        "DELETE FROM standups WHERE guild_id = ? AND user_id = ?"
    );

    const transaction = db.transaction(() => {
        if (options.clearExisting) {
            deleteExisting.run(options.guildId, options.userId);
        }

        for (let offset = 0; offset < options.days; offset += 1) {
            const standupDate = new Date();
            standupDate.setUTCDate(standupDate.getUTCDate() - offset);

            const dateLabel = toStandupDate(standupDate);

            insert.run(
                options.guildId,
                options.userId,
                options.username,
                `Completed work for ${dateLabel}`,
                `Planned work for ${dateLabel}`,
                offset % 4 === 0 ? `Blocker note for ${dateLabel}` : "None",
                dateLabel
            );
        }
    });

    transaction();

    console.log(
        `Seeded ${options.days} standups for guild ${options.guildId} and user ${options.userId}.`
    );
}

seedStandups();