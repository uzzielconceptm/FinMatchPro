import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendFreeTrialConfirmation, sendSubscriptionConfirmation } from "./email-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Free trial signup endpoint
  app.post("/api/signup/trial", async (req, res) => {
    try {
      const { firstName, lastName, email, userType, company, monthlyExpenses, currentTool } = req.body;
      
      if (!firstName || !lastName || !email || !userType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Send confirmation email
      await sendFreeTrialConfirmation(email, firstName, userType);
      
      console.log("Free trial signup:", { firstName, lastName, email, userType, company, monthlyExpenses });
      
      res.json({ 
        success: true, 
        message: "Free trial signup successful! Check your email for confirmation." 
      });
    } catch (error) {
      console.error("Free trial signup error:", error);
      res.status(500).json({ 
        error: "Failed to process signup. Please try again." 
      });
    }
  });

  // Subscription signup endpoint
  app.post("/api/signup/subscription", async (req, res) => {
    try {
      const { firstName, lastName, email, userType, planType, company, clientCount, referralSource } = req.body;
      
      if (!firstName || !lastName || !email || !userType || !planType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Send confirmation email
      await sendSubscriptionConfirmation(email, firstName, userType, planType);
      
      console.log("Subscription signup:", { firstName, lastName, email, userType, planType, company, clientCount });
      
      res.json({ 
        success: true, 
        message: "Subscription signup successful! Check your email for confirmation." 
      });
    } catch (error) {
      console.error("Subscription signup error:", error);
      res.status(500).json({ 
        error: "Failed to process signup. Please try again." 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
