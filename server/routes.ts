import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { 
  insertPropertySchema, 
  insertBuyerCriteriaSchema,
  insertVerificationDocumentSchema,
  insertContactRequestSchema,
  insertClosedDealSchema,
  insertSavedDealSchema
} from "@shared/schema";

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ 
  storage: storage_config,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (
      file.mimetype === "image/jpeg" || 
      file.mimetype === "image/png" || 
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Please upload an image or PDF.") as any, false);
    }
  }, 
});

// Authentication middleware
const isAuthenticated = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

const isAdmin = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated() && req.user.userType === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};

const isVerified = (req: Request, res: Response, next: any) => {
  if (req.isAuthenticated() && req.user.isVerified) {
    return next();
  }
  res.status(403).json({ message: "Your account must be verified to access this feature" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Serve uploaded files
  app.use("/uploads", express.static(uploadsDir));

  // User verification routes
  app.post(
    "/api/upload-verification", 
    isAuthenticated, 
    upload.single("document"), 
    async (req, res) => {
      try {
        const file = req.file;
        if (!file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const { documentType } = req.body;
        if (!documentType) {
          return res.status(400).json({ message: "Document type is required" });
        }

        const document = insertVerificationDocumentSchema.parse({
          userId: req.user.id,
          documentType,
          filePath: file.path,
        });

        const savedDocument = await storage.createVerificationDocument(document);
        res.status(201).json(savedDocument);
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({ message: error.errors });
        } else {
          res.status(500).json({ message: "Server error" });
        }
      }
    }
  );

  app.get("/api/verification-documents", isAuthenticated, async (req, res) => {
    try {
      const documents = await storage.getVerificationDocuments(req.user.id);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin routes for verification
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = Array.from((await storage.getUsers()) || []);
      // Filter out passwords
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/admin/verify-user/:userId", isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { verificationStatus } = req.body;
      
      if (!verificationStatus || !["verified", "rejected"].includes(verificationStatus)) {
        return res.status(400).json({ message: "Invalid verification status" });
      }

      const updatedUser = await storage.updateUser(userId, {
        verificationStatus,
        isVerified: verificationStatus === "verified",
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Filter out password
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/admin/verify-document/:documentId", isAdmin, async (req, res) => {
    try {
      const documentId = parseInt(req.params.documentId);
      const { status } = req.body;
      
      if (!status || !["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedDocument = await storage.updateVerificationDocumentStatus(documentId, status);
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json(updatedDocument);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Buyer criteria routes
  app.post("/api/buyer-criteria", isAuthenticated, async (req, res) => {
    try {
      const buyerCriteria = insertBuyerCriteriaSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const existingCriteria = await storage.getBuyerCriteria(req.user.id);
      
      let savedCriteria;
      if (existingCriteria) {
        savedCriteria = await storage.updateBuyerCriteria(existingCriteria.id, buyerCriteria);
      } else {
        savedCriteria = await storage.createBuyerCriteria(buyerCriteria);
      }

      res.status(201).json(savedCriteria);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.get("/api/buyer-criteria", isAuthenticated, async (req, res) => {
    try {
      const criteria = await storage.getBuyerCriteria(req.user.id);
      res.json(criteria || {});
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Property routes
  app.post(
    "/api/properties", 
    isAuthenticated, 
    isVerified, 
    upload.fields([
      { name: "images", maxCount: 10 },
      { name: "contractDocument", maxCount: 1 },
    ]), 
    async (req, res) => {
      try {
        // Check if user is a wholesaler
        if (req.user.userType !== "wholesaler") {
          return res.status(403).json({ message: "Only wholesalers can post properties" });
        }

        const images = (req.files as any)?.images?.map((file: Express.Multer.File) => file.path) || [];
        const contractDocument = (req.files as any)?.contractDocument?.[0]?.path;

        if (!contractDocument) {
          return res.status(400).json({ message: "Contract document is required" });
        }

        const propertyData = {
          ...req.body,
          userId: req.user.id,
          images,
          contractDocument,
          contractPrice: parseInt(req.body.contractPrice),
          arv: parseInt(req.body.arv),
          repairCost: parseInt(req.body.repairCost),
          assignmentFee: parseInt(req.body.assignmentFee),
        };

        const property = insertPropertySchema.parse(propertyData);
        const savedProperty = await storage.createProperty(property);
        
        res.status(201).json(savedProperty);
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({ message: error.errors });
        } else {
          console.error(error);
          res.status(500).json({ message: "Server error" });
        }
      }
    }
  );

  app.get("/api/properties", async (req, res) => {
    try {
      const filters: any = {};
      
      // Apply filters if provided
      if (req.query.propertyType) filters.propertyType = req.query.propertyType;
      if (req.query.state) filters.state = req.query.state;
      if (req.query.city) filters.city = req.query.city;
      
      // Min/max price filters
      if (req.query.minPrice) {
        filters.contractPrice = (property: any) => property.contractPrice >= parseInt(req.query.minPrice as string);
      }
      if (req.query.maxPrice) {
        filters.contractPrice = (property: any) => property.contractPrice <= parseInt(req.query.maxPrice as string);
      }
      
      // Only return approved properties for non-admin users
      if (!req.isAuthenticated() || req.user.userType !== "admin") {
        filters.isApproved = true;
      }
      
      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Only allow viewing unapproved properties if user is admin or the owner
      if (
        !property.isApproved && 
        (!req.isAuthenticated() || (req.user.id !== property.userId && req.user.userType !== "admin"))
      ) {
        return res.status(403).json({ message: "You don't have permission to view this property" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/properties/:id", isAuthenticated, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Only allow updates by owner or admin
      if (req.user.id !== property.userId && req.user.userType !== "admin") {
        return res.status(403).json({ message: "You don't have permission to update this property" });
      }
      
      const updatedProperty = await storage.updateProperty(propertyId, req.body);
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Admin approve property
  app.patch("/api/admin/approve-property/:id", isAdmin, async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const { isApproved } = req.body;
      
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const updatedProperty = await storage.updateProperty(propertyId, { isApproved });
      res.json(updatedProperty);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Contact request routes
  app.post("/api/contact-requests", isAuthenticated, isVerified, async (req, res) => {
    try {
      const { propertyId, message } = req.body;
      
      // Get the property to find the owner
      const property = await storage.getProperty(parseInt(propertyId));
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      // Prevent sending contact request to yourself
      if (property.userId === req.user.id) {
        return res.status(400).json({ message: "You cannot contact yourself" });
      }
      
      const contactRequest = insertContactRequestSchema.parse({
        propertyId: parseInt(propertyId),
        senderId: req.user.id,
        recipientId: property.userId,
        message,
      });
      
      const savedRequest = await storage.createContactRequest(contactRequest);
      res.status(201).json(savedRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.get("/api/contact-requests", isAuthenticated, async (req, res) => {
    try {
      const requests = await storage.getContactRequestsByUser(req.user.id);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/contact-requests/:id/read", isAuthenticated, async (req, res) => {
    try {
      const requestId = parseInt(req.params.id);
      const request = await storage.getContactRequest(requestId);
      
      if (!request) {
        return res.status(404).json({ message: "Contact request not found" });
      }
      
      // Only recipient can mark as read
      if (request.recipientId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to update this request" });
      }
      
      const updatedRequest = await storage.updateContactRequest(requestId, { isRead: true });
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Saved deals routes
  app.post("/api/saved-deals", isAuthenticated, async (req, res) => {
    try {
      const { propertyId } = req.body;
      
      // Check if property exists
      const property = await storage.getProperty(parseInt(propertyId));
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const savedDeal = insertSavedDealSchema.parse({
        userId: req.user.id,
        propertyId: parseInt(propertyId),
      });
      
      const saved = await storage.createSavedDeal(savedDeal);
      res.status(201).json(saved);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  app.get("/api/saved-deals", isAuthenticated, async (req, res) => {
    try {
      const savedDeals = await storage.getSavedDealsByUser(req.user.id);
      res.json(savedDeals);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/saved-deals/:id", isAuthenticated, async (req, res) => {
    try {
      const dealId = parseInt(req.params.id);
      const deleted = await storage.deleteSavedDeal(dealId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Saved deal not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Closed deals routes
  app.post(
    "/api/closed-deals", 
    isAuthenticated, 
    isVerified, 
    upload.single("proofDocument"), 
    async (req, res) => {
      try {
        const file = req.file;
        if (!file) {
          return res.status(400).json({ message: "Proof document is required" });
        }

        const { propertyId, buyerId, assignmentFee } = req.body;
        
        // Verify property exists and belongs to user
        const property = await storage.getProperty(parseInt(propertyId));
        if (!property) {
          return res.status(404).json({ message: "Property not found" });
        }
        
        if (property.userId !== req.user.id) {
          return res.status(403).json({ message: "You don't have permission to close this deal" });
        }
        
        // Calculate 7% commission
        const commissionAmount = Math.round(parseInt(assignmentFee) * 0.07);
        
        const closedDeal = insertClosedDealSchema.parse({
          propertyId: parseInt(propertyId),
          sellerId: req.user.id,
          buyerId: parseInt(buyerId),
          assignmentFee: parseInt(assignmentFee),
          commissionAmount,
          proofDocument: file.path,
        });
        
        // Update property status to closed
        await storage.updateProperty(parseInt(propertyId), { status: "closed" });
        
        const savedDeal = await storage.createClosedDeal(closedDeal);
        res.status(201).json(savedDeal);
      } catch (error) {
        if (error instanceof z.ZodError) {
          res.status(400).json({ message: error.errors });
        } else {
          res.status(500).json({ message: "Server error" });
        }
      }
    }
  );

  app.get("/api/closed-deals", isAuthenticated, async (req, res) => {
    try {
      const closedDeals = await storage.getClosedDealsByUser(req.user.id);
      res.json(closedDeals);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/closed-deals/:id/pay-commission", isAuthenticated, async (req, res) => {
    try {
      const dealId = parseInt(req.params.id);
      const deal = await storage.getClosedDeal(dealId);
      
      if (!deal) {
        return res.status(404).json({ message: "Closed deal not found" });
      }
      
      // Only the seller can pay commission
      if (deal.sellerId !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to pay commission for this deal" });
      }
      
      const updatedDeal = await storage.updateClosedDeal(dealId, { commissionPaid: true });
      res.json(updatedDeal);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Import express for static file serving
import express from "express";
