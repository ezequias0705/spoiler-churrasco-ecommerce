import {
  products,
  customizations,
  orders,
  orderItems,
  contacts,
  type Product,
  type InsertProduct,
  type Customization,
  type InsertCustomization,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Contact,
  type InsertContact,
} from "@shared/schema";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Customizations
  getCustomizations(): Promise<Customization[]>;
  getCustomizationsByProduct(productId: number): Promise<Customization[]>;
  createCustomization(customization: InsertCustomization): Promise<Customization>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private customizations: Map<number, Customization>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private contacts: Map<number, Contact>;
  private currentProductId: number;
  private currentCustomizationId: number;
  private currentOrderId: number;
  private currentOrderItemId: number;
  private currentContactId: number;

  constructor() {
    this.products = new Map();
    this.customizations = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.contacts = new Map();
    this.currentProductId = 1;
    this.currentCustomizationId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;
    this.currentContactId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed products
    const sampleProducts: InsertProduct[] = [
      {
        name: "Tábua Rústica Grande",
        description: "Tábua artesanal de 60x40cm, ideal para churrascos em família",
        price: "89.90",
        category: "cutting-boards",
        imageUrl: "https://pixabay.com/get/g7d5005b3342b77885acbc4221cc58a6ab4b871cc1b4f528e195f409adf0908ea0467ed472511c32bfae3b77b6b58ae2fec646d13621f304120fd1c1a29d21a88_1280.jpg",
        inStock: true,
        featured: false,
      },
      {
        name: "Tábua com Alças",
        description: "Tábua prática de 45x30cm com alças para fácil manuseio",
        price: "69.90",
        category: "cutting-boards",
        imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: false,
      },
      {
        name: "Kit Utensílios Premium",
        description: "Conjunto completo com garfo, espátula e pegador de madeira",
        price: "149.90",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: false,
      },
      {
        name: "Kit Master Churrasco",
        description: "Kit completo: tábua + utensílios + suporte personalizado",
        price: "199.90",
        category: "sets",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        inStock: true,
        featured: true,
      },
    ];

    sampleProducts.forEach((product) => {
      const id = this.currentProductId++;
      this.products.set(id, { 
        ...product, 
        id,
        inStock: product.inStock ?? true,
        featured: product.featured ?? false
      });
    });

    // Seed customizations
    const sampleCustomizations: InsertCustomization[] = [
      {
        productId: 1,
        name: "Gravação de Nome/Logo",
        description: "Personalize com seu nome, logotipo ou frase especial",
        additionalPrice: "25.00",
        type: "engraving",
      },
      {
        productId: 1,
        name: "Tamanhos Customizados",
        description: "Dimensões especiais para suas necessidades específicas",
        additionalPrice: "35.00",
        type: "size",
      },
      {
        productId: 1,
        name: "Acabamentos Especiais",
        description: "Verniz premium, bordas arredondadas ou detalhes únicos",
        additionalPrice: "45.00",
        type: "finish",
      },
    ];

    sampleCustomizations.forEach((customization) => {
      const id = this.currentCustomizationId++;
      this.customizations.set(id, { 
        ...customization, 
        id,
        description: customization.description ?? null,
        productId: customization.productId ?? null
      });
    });
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      inStock: insertProduct.inStock ?? true,
      featured: insertProduct.featured ?? false
    };
    this.products.set(id, product);
    return product;
  }

  // Customizations
  async getCustomizations(): Promise<Customization[]> {
    return Array.from(this.customizations.values());
  }

  async getCustomizationsByProduct(productId: number): Promise<Customization[]> {
    return Array.from(this.customizations.values()).filter(
      (customization) => customization.productId === productId
    );
  }

  async createCustomization(
    insertCustomization: InsertCustomization
  ): Promise<Customization> {
    const id = this.currentCustomizationId++;
    const customization: Customization = { 
      ...insertCustomization, 
      id,
      description: insertCustomization.description ?? null,
      productId: insertCustomization.productId ?? null
    };
    this.customizations.set(id, customization);
    return customization;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      ...insertOrder,
      id,
      status: insertOrder.status ?? 'processing',
      customerPhone: insertOrder.customerPhone ?? null,
      createdAt: new Date(),
      deliveryDate: null,
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentOrderItemId++;
    const orderItem: OrderItem = { 
      ...insertOrderItem, 
      id,
      productId: insertOrderItem.productId ?? null,
      customizations: insertOrderItem.customizations ?? null,
      orderId: insertOrderItem.orderId ?? null
    };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentContactId++;
    const contact: Contact = {
      ...insertContact,
      id,
      phone: insertContact.phone ?? null,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();
