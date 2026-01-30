import {
  pgTable,
  text,
  varchar,
  timestamp,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { MaxPerTaskTierWise, TierWiseSteps} from "./types";


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


export const offers = pgTable(
  "offers",
  {
    id: varchar("id", { length: 36 }).primaryKey(),

    ownerId: text("owner_id").notNull(), // firebase uid

    title: text("title").notNull(),

    link: text("link").notNull(),

    bannerImage : text("banner_image").notNull(),

    squareImage : text("square_image").notNull(),

    rewardsValue: text("rewards_value").notNull(),

    tierWiseSteps: jsonb("tier_wise_steps").$type<TierWiseSteps>().notNull(),
    
    maxPerTaskTierWise : jsonb("max_per_task_tier_wise").$type<MaxPerTaskTierWise>().notNull(),


    includedCountries: text("included_countries").array().notNull(),


    excludedCountries: text("excluded_countries").array().notNull(),
    

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index("offers_owner_idx").on(table.ownerId),
  })
);


export const visitors = pgTable(
  "visitors",
  {
    clickId: varchar("click_id", { length: 36 }).primaryKey(),

    uid: text("uid").notNull(),

    pid: text("pid").notNull(),

    offerId: varchar("offer_id", { length: 36 })
      .notNull()
      .references(() => offers.id),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    offerIdx: index("visitors_offer_idx").on(table.offerId),
    uidIdx: index("visitors_uid_idx").on(table.uid),
    offerUidIdx: index("visitors_offer_uid_idx").on(
      table.offerId,
      table.uid
    ),
  })
);

