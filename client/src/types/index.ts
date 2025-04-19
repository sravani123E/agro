export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  stock: number;
  category: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  _id: string;
  customerName: string;
  contactNumber: string;
  deliveryAddress: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'In Progress' | 'Delivered';
  createdAt: string;
} 