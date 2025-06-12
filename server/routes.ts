import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sendFreeTrialConfirmation, sendSubscriptionConfirmation, sendAdminNotification } from "./email-service";
import { createUser, getUserByEmail, checkDatabaseHealth } from "./db";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    const dbHealthy = await checkDatabaseHealth();
    res.json({ 
      status: "ok",
      database: dbHealthy ? "connected" : "disconnected",
      timestamp: new Date().toISOString()
    });
  });

  // Free trial signup endpoint
  app.post("/api/signup/trial", async (req, res) => {
    try {
      const { firstName, lastName, email, password, userType, company, monthlyExpenses, currentTool } = req.body;
      
      if (!firstName || !lastName || !email || !userType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if user already exists
      if (process.env.DATABASE_URL) {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ error: "User already exists with this email" });
        }

        // Create user in database if password provided
        if (password) {
          await createUser({
            email,
            password,
            firstName,
            lastName,
            company,
            userType,
            monthlyExpenses,
            currentTool,
            marketingEmails: false
          });
        }
      }

      // Send confirmation email to user
      await sendFreeTrialConfirmation(email, firstName, userType);
      
      // Send notification email to admin
      await sendAdminNotification('trial', { firstName, lastName, email, userType, company, monthlyExpenses, currentTool });
      
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
      const { firstName, lastName, email, password, userType, planType, company, clientCount, phoneNumber, referralSource, marketingEmails } = req.body;
      
      if (!firstName || !lastName || !email || !userType || !planType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if user already exists
      if (process.env.DATABASE_URL) {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ error: "User already exists with this email" });
        }

        // Create user in database if password provided
        if (password) {
          await createUser({
            email,
            password,
            firstName,
            lastName,
            company,
            userType,
            planType,
            clientCount,
            phoneNumber,
            referralSource,
            marketingEmails: marketingEmails || false
          });
        }
      }

      // Send confirmation email to user
      await sendSubscriptionConfirmation(email, firstName, userType, planType);
      
      // Send notification email to admin
      await sendAdminNotification('subscription', { firstName, lastName, email, userType, planType, company, clientCount, referralSource });
      
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
