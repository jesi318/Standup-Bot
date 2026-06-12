import { db } from "./db.js";

export function createStandup(guildId: string, userId: string, username: string, yesterday: string, today: string, blockers: string) {
  const stmt = db.prepare(`
    INSERT INTO standups (guild_id, user_id, username, yesterday, today, blockers)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(guildId, userId, username, yesterday, today, blockers);
}

export function getLatestStandupforUser(guildId: string, userId: string) {
  const stmt = db.prepare(`
    SELECT * FROM standups
    WHERE guild_id = ? AND user_id = ?
    ORDER BY created_at DESC
    LIMIT 1
  `);
  return stmt.get(guildId, userId);
}

export function getLatestStandupforGuild(guildId: string) {
  const stmt = db.prepare(`
    SELECT s1.*
    FROM standups s1
    WhERE s1.guild_id = ?
    AND s1.created_at = (
      SELECT MAX(s2.created_at)
      FROM standups s2
      WHERE s2.guild_id = s1.guild_id
      AND s2.user_id = s1.user_id
    )
    ORDER BY s1.username 
  `);
  return stmt.all(guildId);
}