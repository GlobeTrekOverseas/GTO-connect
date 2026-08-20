import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const digilockerStateTable = pgTable("digilocker_state", {
  state: text("state").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});

export const digilockerResultTable = pgTable("digilocker_result", {
  key: text("key").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => usersTable.id),
  documents: jsonb("documents").notNull().$type<Record<string, unknown>[]>(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
