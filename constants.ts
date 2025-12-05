import { FoodItem, Restaurant, User } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Super Admin',
    email: 'admin@foodie.com',
    phone: '1234567890',
    hostelRoom: 'Office',
    role: 'admin',
    password: 'admin'
  },
  {
    id: 'rest_admin1',
    name: 'Spice Owner',
    email: 'owner@spice.com',
    phone: '1112223333',
    hostelRoom: 'Spice Garden Office',
    role: 'admin',
    password: 'spice',
    restaurantId: 'r1' // Linked to Spice Garden
  },
  {
    id: 'student1',
    name: 'John Doe',
    email: 'john@student.com',
    phone: '9876543210',
    hostelRoom: 'Block A - 101',
    role: 'student',
    password: 'user'
  }
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Spice Garden',
    image: 'https://picsum.photos/800/600?random=1',
    rating: 4.5,
    category: 'North Indian',
    deliveryTime: '30-40 min',
    description: 'Authentic North Indian curries and breads.'
  },
  {
    id: 'r2',
    name: 'Burger Point',
    image: 'https://picsum.photos/800/600?random=2',
    rating: 4.2,
    category: 'Fast Food',
    deliveryTime: '20-30 min',
    description: 'Juicy burgers and crispy fries.'
  },
  {
    id: 'r3',
    name: 'Green Leaf',
    image: 'https://picsum.photos/800/600?random=3',
    rating: 4.8,
    category: 'Healthy / Veg',
    deliveryTime: '35-45 min',
    description: 'Fresh salads and pure veg delights.'
  }
];

export const INITIAL_MENU: FoodItem[] = [
  {
    id: 'f1',
    restaurantId: 'r1',
    name: 'Paneer Butter Masala',
    description: 'Rich creamy tomato gravy with cottage cheese cubes.',
    price: 180,
    image: 'https://picsum.photos/200/200?random=10',
    type: 'veg',
    isAvailable: true
  },
  {
    id: 'f2',
    restaurantId: 'r1',
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken pieces.',
    price: 220,
    image: 'https://picsum.photos/200/200?random=11',
    type: 'non-veg',
    isAvailable: true
  },
  {
    id: 'f3',
    restaurantId: 'r2',
    name: 'Classic Cheese Burger',
    description: 'Grilled patty with melted cheese and fresh veggies.',
    price: 120,
    image: 'https://picsum.photos/200/200?random=12',
    type: 'non-veg',
    isAvailable: true
  },
  {
    id: 'f4',
    restaurantId: 'r2',
    name: 'Veggie Supreme',
    description: 'Loaded with vegetable patty and special sauces.',
    price: 100,
    image: 'https://picsum.photos/200/200?random=13',
    type: 'veg',
    isAvailable: true
  }
];