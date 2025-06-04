import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertOrderItemSchema, insertContactSchema } from "@shared/schema";
import { sendProjectEmail } from "./email";
import { z } from "zod";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products;
      
      if (category && typeof category === 'string') {
        products = await storage.getProductsByCategory(category);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Customizations
  app.get("/api/customizations", async (req, res) => {
    try {
      const { productId } = req.query;
      let customizations;
      
      if (productId && typeof productId === 'string') {
        customizations = await storage.getCustomizationsByProduct(parseInt(productId));
      } else {
        customizations = await storage.getCustomizations();
      }
      
      res.json(customizations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customizations" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItems(id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const { items, ...orderInfo } = req.body;
      
      // Create the order
      const order = await storage.createOrder(orderInfo);
      
      // Create order items
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const orderItemData = insertOrderItemSchema.parse({
            ...item,
            orderId: order.id,
          });
          await storage.createOrderItem(orderItemData);
        }
      }
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const order = await storage.updateOrderStatus(id, status);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Contacts
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Download do projeto completo
  app.get("/api/download-project", async (req, res) => {
    try {
      const projectPath = path.join(process.cwd(), 'spoiler-churrasco-project.tar.gz');
      
      if (!fs.existsSync(projectPath)) {
        return res.status(404).json({ message: "Arquivo do projeto não encontrado" });
      }

      const stat = fs.statSync(projectPath);
      
      res.setHeader('Content-Disposition', 'attachment; filename="spoiler-churrasco-project.tar.gz"');
      res.setHeader('Content-Type', 'application/gzip');
      res.setHeader('Content-Length', stat.size.toString());
      
      const readStream = fs.createReadStream(projectPath);
      readStream.pipe(res);
    } catch (error) {
      console.error('Erro ao fazer download do projeto:', error);
      res.status(500).json({ message: "Erro ao baixar o projeto" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
