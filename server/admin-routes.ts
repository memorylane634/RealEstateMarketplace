import { Express, Request, Response } from "express";
import { storage } from "./storage";
import fs from "fs";
import path from "path";

// Admin authentication middleware using .env
const isAdminPassword = (req: Request, res: Response, next: any) => {
  const { authorization } = req.headers;
  
  if (!authorization) {
    return res.status(401).json({ message: "Authorization header is required" });
  }
  
  const [scheme, token] = authorization.split(' ');
  
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }
  
  if (token !== process.env.VITE_ADMIN_PASSWORD) {
    return res.status(403).json({ message: "Invalid admin password" });
  }
  
  next();
};

export function registerAdminRoutes(app: Express) {
  // Admin routes for the dashboard
  
  // Get all deals/properties
  app.get("/api/admin/deals", isAdminPassword, async (req, res) => {
    try {
      const properties = await storage.getProperties({});
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get all unverified buyers (users with type cash_buyer and not verified)
  app.get("/api/admin/buyers", isAdminPassword, async (req, res) => {
    try {
      const allUsers = await storage.getUsers();
      const users = Array.from(allUsers)
        .filter(user => user.userType === "cash_buyer" && !user.isVerified);
      
      // Filter out passwords
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get all unverified sellers (users with type wholesaler and not verified)
  app.get("/api/admin/sellers", isAdminPassword, async (req, res) => {
    try {
      const allUsers = await storage.getUsers();
      const users = Array.from(allUsers)
        .filter(user => user.userType === "wholesaler" && !user.isVerified);
      
      // Filter out passwords
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Verify a buyer
  app.patch("/api/admin/verify-buyer/:id", isAdminPassword, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.userType !== "cash_buyer") {
        return res.status(400).json({ message: "User is not a cash buyer" });
      }
      
      const updatedUser = await storage.updateUser(userId, {
        verificationStatus: "verified",
        isVerified: true,
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
  
  // Verify a seller
  app.patch("/api/admin/verify-seller/:id", isAdminPassword, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.userType !== "wholesaler") {
        return res.status(400).json({ message: "User is not a wholesaler" });
      }
      
      const updatedUser = await storage.updateUser(userId, {
        verificationStatus: "verified",
        isVerified: true,
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
  
  // Get verification documents
  app.get("/api/admin/verification-documents", isAdminPassword, async (req, res) => {
    try {
      // We need to get all documents for all users - not implemented in storage
      // Let's get all users and for each user get their documents
      const allUsers = await storage.getUsers();
      const users = Array.from(allUsers);
      let allDocuments: any[] = [];
      
      for (const user of users) {
        const userDocuments = await storage.getVerificationDocuments(user.id);
        allDocuments = [...allDocuments, ...userDocuments];
      }
      
      res.json(allDocuments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Serve proof files
  app.get("/api/admin/proof/:type/:filename", isAdminPassword, (req, res) => {
    const { type, filename } = req.params;
    const filePath = path.join(process.cwd(), "uploads", filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    
    // Determine content type
    let contentType = "application/octet-stream";
    if (filename.endsWith(".pdf")) {
      contentType = "application/pdf";
    } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (filename.endsWith(".png")) {
      contentType = "image/png";
    }
    
    res.set("Content-Type", contentType);
    res.sendFile(filePath);
  });
}