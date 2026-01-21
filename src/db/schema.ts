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


export const properties = pgTable(
  "properties",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    ownerId: text("owner_id").notNull(), // firebaseUid from auth

    name: text("name").notNull(),

    link: text("link"),

    imageLink: text("image_link"),

    postbackUrl: text("postback_url"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    ownerIdx: index("properties_owner_idx").on(table.ownerId),
  })
);



