import { db } from "./db.js";

export function migrate() {
    db.exec(`
CREATE TABLE IF NOT EXISTS standups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  guild_id TEXT NOT NULL,
  
  user_id TEXT NOT NULL,

  username TEXT NOT NULL,

  yesterday TEXT NOT NULL,

  today TEXT NOT NULL,

  blockers TEXT NOT NULL,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`)

db.exec(`
CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    frequency TEXT NOT NULL,
    schedule_time TEXT NOT NULL,
    timezone TEXT NOT NULL
);
`);
}