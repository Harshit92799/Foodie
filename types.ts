export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  hostelRoom: string;
  role: UserRole;
  password?: string; // In real app, this is hashed
  restaurantId?: string; // If set, this user is a restaurant owner for this specific restaurant ID
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: 'veg' | 'non-veg';
  isAvailable: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  category: string; // e.g., "Indian", "Chinese"
  deliveryTime: string;
  description: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  timestamp: number;
  deliveryAddress: string;
  rating?: number;
  feedback?: string;
  userName?: string;
  userPhone?: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  timestamp: number;
}