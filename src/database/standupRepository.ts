import { db } from "./db.js";

export function upsertStandup(guildId: string, userId: string, username: string, yesterday: string, today: string, blockers: string, standupDate: string) {
  const stmt = db.prepare(`
    INSERT INTO standups (guild_id, user_id, username, yesterday, today, blockers, standup_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(

            guild_id,
            user_id,
            standup_date

        )

        DO UPDATE SET

            username = excluded.username,
            yesterday = excluded.yesterday,
            today = excluded.today,
            blockers = excluded.blockers
  `);
  stmt.run(guildId, userId, username, yesterday, today, blockers, standupDate);
}

export function getStandupByDate(guildId: string, userId: string, standupDate: string) {
  const stmt = db.prepare(`
    SELECT * FROM standups
    WHERE guild_id = ? AND user_id = ? AND standup_date = ?
  `);
  return stmt.get(guildId, userId, standupDate);
}

export function getLatestStandupforUser(guildId: string, userId: string) {
  const stmt = db.prepare(`
    SELECT * FROM standups
    WHERE guild_id = ? AND user_id = ?
    ORDER BY standup_date DESC
    LIMIT 1
  `);
  return stmt.get(guildId, userId);
}

export function getLatestStandupforGuild(guildId: string) {
  const stmt = db.prepare(`
    SELECT s1.*
    FROM standups s1
    WhERE s1.guild_id = ?
    AND s1.standup_date = (
      SELECT MAX(s2.standup_date)
      FROM standups s2
      WHERE s2.guild_id = s1.guild_id
      AND s2.user_id = s1.user_id
    )
    ORDER BY s1.username 
  `);
  return stmt.all(guildId);
}

export function getGuildStandupHistory(guildId: string, userId: string, limit: number, offset: number) {
  const stmt = db.prepare(`
    SELECT * FROM standups
    WHERE guild_id = ? AND user_id = ?
    ORDER BY standup_date DESC
    LIMIT ?
    OFFSET ?
  `);
  return stmt.all(guildId, userId, limit, offset);
}