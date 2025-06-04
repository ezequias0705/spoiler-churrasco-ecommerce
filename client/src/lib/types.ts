export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  customizations?: {
    engraving?: string;
    size?: { width: number; height: number };
    finishes?: string[];
    instructions?: string;
    additionalCost: number;
  };
}

export interface CustomizationOption {
  id: number;
  productId: number;
  name: string;
  description?: string;
  additionalPrice: number;
  type: 'engraving' | 'size' | 'finish';
}

export interface OrderSummary {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}
