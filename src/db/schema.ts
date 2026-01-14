import {
  pgTable,
  text,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    firebaseUid: text("firebase_uid").notNull(),

    email: text("email"),

    name: text("name"),

    avatarUrl: text("avatar_url"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    lastLogin: timestamp("last_login").defaultNow(),
  },
  (table) => ({
    firebaseUidIdx: index("users_firebase_uid_idx").on(table.firebaseUid),
  })
);
