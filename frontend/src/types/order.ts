export type PaymentMethod = 'mobile-money' | 'orange-money' | 'delivery';

export interface CheckoutCustomer {
  fullName: string;
  email: string;
  phone: string;
  region: string;
  city: string;
  address: string;
}

export interface CheckoutItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customer: CheckoutCustomer;
  paymentMethod: PaymentMethod;
  items: CheckoutItem[];
}

export interface CreateOrderResponse {
  success: boolean;
  message?: string;
  data: {
    orderId: number;
    totalAmount: string;
    status: string;
    customer: {
      fullName: string;
      email: string;
    };
  };
}
