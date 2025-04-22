import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  userType: text("user_type").notNull(), // "wholesaler" or "cash_buyer"
  isVerified: boolean("is_verified").default(false),
  verificationStatus: text("verification_status").default("pending"), // "pending", "verified", "rejected"
  createdAt: timestamp("created_at").defaultNow(),
});

export const verificationDocuments = pgTable("verification_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  documentType: text("document_type").notNull(), // "id", "proof_of_funds", "contract"
  filePath: text("file_path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  status: text("status").default("pending"), // "pending", "approved", "rejected"
});

export const buyerCriteria = pgTable("buyer_criteria", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  locations: text("locations").array(),
  propertyTypes: text("property_types").array(),
  minPrice: integer("min_price"),
  maxPrice: integer("max_price"),
  financingType: text("financing_type").notNull(), // "cash", "financing"
  exitStrategy: text("exit_strategy"), // "flip", "buy_and_hold", etc.
  closingTimeframe: text("closing_timeframe"), // "30_days", "60_days", etc.
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  propertyType: text("property_type").notNull(), // "single_family", "multi_family", etc.
  contractPrice: integer("contract_price").notNull(),
  arv: integer("arv").notNull(), // After Repair Value
  repairCost: integer("repair_cost").notNull(),
  assignmentFee: integer("assignment_fee").notNull(),
  notes: text("notes"),
  images: text("images").array(),
  contractDocument: text("contract_document"),
  isApproved: boolean("is_approved").default(false),
  status: text("status").default("available"), // "available", "under_contract", "closed"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const closedDeals = pgTable("closed_deals", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  sellerId: integer("seller_id").notNull().references(() => users.id),
  buyerId: integer("buyer_id").notNull().references(() => users.id),
  assignmentFee: integer("assignment_fee").notNull(),
  commissionPaid: boolean("commission_paid").default(false),
  commissionAmount: integer("commission_amount").notNull(),
  proofDocument: text("proof_document").notNull(),
  closedAt: timestamp("closed_at").defaultNow(),
});

export const savedDeals = pgTable("saved_deals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  savedAt: timestamp("saved_at").defaultNow(),
});

export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  recipientId: integer("recipient_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isRead: boolean("is_read").default(false),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isVerified: true,
  verificationStatus: true,
  createdAt: true,
});

export const insertVerificationDocumentSchema = createInsertSchema(verificationDocuments).omit({
  id: true, 
  uploadedAt: true,
  status: true,
});

export const insertBuyerCriteriaSchema = createInsertSchema(buyerCriteria).omit({
  id: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  isApproved: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClosedDealSchema = createInsertSchema(closedDeals).omit({
  id: true,
  commissionPaid: true,
  closedAt: true,
});

export const insertSavedDealSchema = createInsertSchema(savedDeals).omit({
  id: true,
  savedAt: true,
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

// Select types
export type User = typeof users.$inferSelect;
export type VerificationDocument = typeof verificationDocuments.$inferSelect;
export type BuyerCriteria = typeof buyerCriteria.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type ClosedDeal = typeof closedDeals.$inferSelect;
export type SavedDeal = typeof savedDeals.$inferSelect;
export type ContactRequest = typeof contactRequests.$inferSelect;

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertVerificationDocument = z.infer<typeof insertVerificationDocumentSchema>;
export type InsertBuyerCriteria = z.infer<typeof insertBuyerCriteriaSchema>;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type InsertClosedDeal = z.infer<typeof insertClosedDealSchema>;
export type InsertSavedDeal = z.infer<typeof insertSavedDealSchema>;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
