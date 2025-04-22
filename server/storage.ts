import { 
  users, 
  verificationDocuments, 
  buyerCriteria, 
  properties, 
  closedDeals,
  savedDeals,
  contactRequests,
  type User, 
  type InsertUser,
  type VerificationDocument,
  type InsertVerificationDocument,
  type BuyerCriteria,
  type InsertBuyerCriteria,
  type Property,
  type InsertProperty,
  type ClosedDeal,
  type InsertClosedDeal,
  type SavedDeal,
  type InsertSavedDeal,
  type ContactRequest,
  type InsertContactRequest
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Verification document methods
  getVerificationDocuments(userId: number): Promise<VerificationDocument[]>;
  getVerificationDocument(id: number): Promise<VerificationDocument | undefined>;
  createVerificationDocument(doc: InsertVerificationDocument): Promise<VerificationDocument>;
  updateVerificationDocumentStatus(id: number, status: string): Promise<VerificationDocument | undefined>;
  
  // Buyer criteria methods
  getBuyerCriteria(userId: number): Promise<BuyerCriteria | undefined>;
  createBuyerCriteria(criteria: InsertBuyerCriteria): Promise<BuyerCriteria>;
  updateBuyerCriteria(id: number, criteria: Partial<BuyerCriteria>): Promise<BuyerCriteria | undefined>;
  
  // Property methods
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(filters?: Partial<Property>): Promise<Property[]>;
  getPropertiesByUser(userId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<Property>): Promise<Property | undefined>;
  
  // Closed deal methods
  getClosedDeal(id: number): Promise<ClosedDeal | undefined>;
  getClosedDealsByProperty(propertyId: number): Promise<ClosedDeal[]>;
  getClosedDealsByUser(userId: number): Promise<ClosedDeal[]>;
  createClosedDeal(deal: InsertClosedDeal): Promise<ClosedDeal>;
  updateClosedDeal(id: number, deal: Partial<ClosedDeal>): Promise<ClosedDeal | undefined>;
  
  // Saved deal methods
  getSavedDealsByUser(userId: number): Promise<SavedDeal[]>;
  createSavedDeal(deal: InsertSavedDeal): Promise<SavedDeal>;
  deleteSavedDeal(id: number): Promise<boolean>;
  
  // Contact request methods
  getContactRequest(id: number): Promise<ContactRequest | undefined>;
  getContactRequestsByUser(userId: number): Promise<ContactRequest[]>;
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  updateContactRequest(id: number, request: Partial<ContactRequest>): Promise<ContactRequest | undefined>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private verificationDocuments: Map<number, VerificationDocument>;
  private buyerCriteria: Map<number, BuyerCriteria>;
  private properties: Map<number, Property>;
  private closedDeals: Map<number, ClosedDeal>;
  private savedDeals: Map<number, SavedDeal>;
  private contactRequests: Map<number, ContactRequest>;
  
  private userIdCounter: number;
  private verificationDocIdCounter: number;
  private buyerCriteriaIdCounter: number;
  private propertyIdCounter: number;
  private closedDealIdCounter: number;
  private savedDealIdCounter: number;
  private contactRequestIdCounter: number;
  
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.verificationDocuments = new Map();
    this.buyerCriteria = new Map();
    this.properties = new Map();
    this.closedDeals = new Map();
    this.savedDeals = new Map();
    this.contactRequests = new Map();
    
    this.userIdCounter = 1;
    this.verificationDocIdCounter = 1;
    this.buyerCriteriaIdCounter = 1;
    this.propertyIdCounter = 1;
    this.closedDealIdCounter = 1;
    this.savedDealIdCounter = 1;
    this.contactRequestIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      isVerified: false,
      verificationStatus: "pending",
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Verification document methods
  async getVerificationDocuments(userId: number): Promise<VerificationDocument[]> {
    return Array.from(this.verificationDocuments.values()).filter(
      (doc) => doc.userId === userId
    );
  }
  
  async getVerificationDocument(id: number): Promise<VerificationDocument | undefined> {
    return this.verificationDocuments.get(id);
  }
  
  async createVerificationDocument(doc: InsertVerificationDocument): Promise<VerificationDocument> {
    const id = this.verificationDocIdCounter++;
    const now = new Date();
    const verificationDoc: VerificationDocument = {
      ...doc,
      id,
      uploadedAt: now,
      status: "pending"
    };
    this.verificationDocuments.set(id, verificationDoc);
    return verificationDoc;
  }
  
  async updateVerificationDocumentStatus(id: number, status: string): Promise<VerificationDocument | undefined> {
    const doc = this.verificationDocuments.get(id);
    if (!doc) return undefined;
    
    const updatedDoc: VerificationDocument = { ...doc, status };
    this.verificationDocuments.set(id, updatedDoc);
    return updatedDoc;
  }
  
  // Buyer criteria methods
  async getBuyerCriteria(userId: number): Promise<BuyerCriteria | undefined> {
    return Array.from(this.buyerCriteria.values()).find(
      (criteria) => criteria.userId === userId
    );
  }
  
  async createBuyerCriteria(criteria: InsertBuyerCriteria): Promise<BuyerCriteria> {
    const id = this.buyerCriteriaIdCounter++;
    const buyerCriteria: BuyerCriteria = { ...criteria, id };
    this.buyerCriteria.set(id, buyerCriteria);
    return buyerCriteria;
  }
  
  async updateBuyerCriteria(id: number, criteriaData: Partial<BuyerCriteria>): Promise<BuyerCriteria | undefined> {
    const criteria = this.buyerCriteria.get(id);
    if (!criteria) return undefined;
    
    const updatedCriteria: BuyerCriteria = { ...criteria, ...criteriaData };
    this.buyerCriteria.set(id, updatedCriteria);
    return updatedCriteria;
  }
  
  // Property methods
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }
  
  async getProperties(filters?: Partial<Property>): Promise<Property[]> {
    let properties = Array.from(this.properties.values());
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          properties = properties.filter(prop => 
            // @ts-ignore - We're filtering dynamically
            prop[key] === value
          );
        }
      });
    }
    
    return properties;
  }
  
  async getPropertiesByUser(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.userId === userId
    );
  }
  
  async createProperty(propertyData: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const now = new Date();
    const property: Property = {
      ...propertyData,
      id,
      isApproved: false,
      status: "available",
      createdAt: now,
      updatedAt: now
    };
    this.properties.set(id, property);
    return property;
  }
  
  async updateProperty(id: number, propertyData: Partial<Property>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const now = new Date();
    const updatedProperty: Property = { 
      ...property, 
      ...propertyData,
      updatedAt: now
    };
    this.properties.set(id, updatedProperty);
    return updatedProperty;
  }
  
  // Closed deal methods
  async getClosedDeal(id: number): Promise<ClosedDeal | undefined> {
    return this.closedDeals.get(id);
  }
  
  async getClosedDealsByProperty(propertyId: number): Promise<ClosedDeal[]> {
    return Array.from(this.closedDeals.values()).filter(
      (deal) => deal.propertyId === propertyId
    );
  }
  
  async getClosedDealsByUser(userId: number): Promise<ClosedDeal[]> {
    return Array.from(this.closedDeals.values()).filter(
      (deal) => deal.sellerId === userId || deal.buyerId === userId
    );
  }
  
  async createClosedDeal(dealData: InsertClosedDeal): Promise<ClosedDeal> {
    const id = this.closedDealIdCounter++;
    const now = new Date();
    const deal: ClosedDeal = {
      ...dealData,
      id,
      commissionPaid: false,
      closedAt: now
    };
    this.closedDeals.set(id, deal);
    return deal;
  }
  
  async updateClosedDeal(id: number, dealData: Partial<ClosedDeal>): Promise<ClosedDeal | undefined> {
    const deal = this.closedDeals.get(id);
    if (!deal) return undefined;
    
    const updatedDeal: ClosedDeal = { ...deal, ...dealData };
    this.closedDeals.set(id, updatedDeal);
    return updatedDeal;
  }
  
  // Saved deal methods
  async getSavedDealsByUser(userId: number): Promise<SavedDeal[]> {
    return Array.from(this.savedDeals.values()).filter(
      (deal) => deal.userId === userId
    );
  }
  
  async createSavedDeal(dealData: InsertSavedDeal): Promise<SavedDeal> {
    const id = this.savedDealIdCounter++;
    const now = new Date();
    const deal: SavedDeal = {
      ...dealData,
      id,
      savedAt: now
    };
    this.savedDeals.set(id, deal);
    return deal;
  }
  
  async deleteSavedDeal(id: number): Promise<boolean> {
    return this.savedDeals.delete(id);
  }
  
  // Contact request methods
  async getContactRequest(id: number): Promise<ContactRequest | undefined> {
    return this.contactRequests.get(id);
  }
  
  async getContactRequestsByUser(userId: number): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values()).filter(
      (request) => request.recipientId === userId || request.senderId === userId
    );
  }
  
  async createContactRequest(requestData: InsertContactRequest): Promise<ContactRequest> {
    const id = this.contactRequestIdCounter++;
    const now = new Date();
    const request: ContactRequest = {
      ...requestData,
      id,
      createdAt: now,
      isRead: false
    };
    this.contactRequests.set(id, request);
    return request;
  }
  
  async updateContactRequest(id: number, requestData: Partial<ContactRequest>): Promise<ContactRequest | undefined> {
    const request = this.contactRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest: ContactRequest = { ...request, ...requestData };
    this.contactRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
