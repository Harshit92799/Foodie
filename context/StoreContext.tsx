import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Restaurant, FoodItem, CartItem, Order, OrderStatus } from '../types';
import { INITIAL_RESTAURANTS, INITIAL_MENU } from '../constants';

interface StoreContextType {
  restaurants: Restaurant[];
  menuItems: FoodItem[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (userId: string, address: string, userDetails: { name: string; phone: string }) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addRestaurant: (rest: Restaurant) => void;
  updateRestaurant: (rest: Restaurant) => void;
  deleteRestaurant: (id: string) => void;
  addFoodItem: (item: FoodItem) => void;
  updateFoodItem: (item: FoodItem) => void;
  deleteFoodItem: (id: string) => void;
  submitFeedback: (orderId: string, rating: number, feedback: string) => void;
  getRestaurantMenu: (restaurantId: string) => FoodItem[];
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [menuItems, setMenuItems] = useState<FoodItem[]>(INITIAL_MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Simulate Data Persistence
  useEffect(() => {
    const storedOrders = localStorage.getItem('foodie_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    
    const storedRest = localStorage.getItem('foodie_restaurants');
    if (storedRest) setRestaurants(JSON.parse(storedRest));

    const storedMenu = localStorage.getItem('foodie_menu');
    if (storedMenu) setMenuItems(JSON.parse(storedMenu));
  }, []);

  useEffect(() => {
    localStorage.setItem('foodie_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('foodie_restaurants', JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    localStorage.setItem('foodie_menu', JSON.stringify(menuItems));
  }, [menuItems]);

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (userId: string, address: string, userDetails: { name: string; phone: string }) => {
    if (cart.length === 0) return;
    
    const itemsByRestaurant = cart.reduce((acc, item) => {
      if (!acc[item.restaurantId]) acc[item.restaurantId] = [];
      acc[item.restaurantId].push(item);
      return acc;
    }, {} as Record<string, CartItem[]>);

    const newOrders: Order[] = Object.keys(itemsByRestaurant).map(restId => ({
      id: `ord-${Date.now()}-${restId}`,
      userId,
      restaurantId: restId,
      items: itemsByRestaurant[restId],
      totalAmount: itemsByRestaurant[restId].reduce((sum, i) => sum + (i.price * i.quantity), 0),
      status: 'placed',
      timestamp: Date.now(),
      deliveryAddress: address,
      userName: userDetails.name,
      userPhone: userDetails.phone,
    }));

    setOrders(prev => [...newOrders, ...prev]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addRestaurant = (rest: Restaurant) => {
    setRestaurants(prev => [...prev, rest]);
  };

  const updateRestaurant = (rest: Restaurant) => {
    setRestaurants(prev => prev.map(r => r.id === rest.id ? rest : r));
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== id));
    // Also delete associated menu items
    setMenuItems(prev => prev.filter(item => item.restaurantId !== id));
  };

  const addFoodItem = (item: FoodItem) => {
    setMenuItems(prev => [...prev, item]);
  };

  const updateFoodItem = (item: FoodItem) => {
    setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
  };

  const deleteFoodItem = (id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
  };

  const submitFeedback = (orderId: string, rating: number, feedback: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, rating, feedback } : o));
  };

  const getRestaurantMenu = (restaurantId: string) => {
    return menuItems.filter(i => i.restaurantId === restaurantId);
  };

  return (
    <StoreContext.Provider value={{
      restaurants, menuItems, cart, orders,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, updateOrderStatus, 
      addRestaurant, updateRestaurant, deleteRestaurant,
      addFoodItem, updateFoodItem, deleteFoodItem,
      submitFeedback, getRestaurantMenu
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};