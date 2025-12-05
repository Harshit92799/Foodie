import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, placeOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (!user) return;
    placeOrder(user.id, user.hostelRoom, { name: user.name, phone: user.phone });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate('/orders');
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
         <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
         </div>
         <h2 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
         <p className="text-gray-500 mt-2">Redirecting to your orders...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-8">Good food is always cooking! Go ahead and order some yummy items from the menu.</p>
        <button onClick={() => navigate('/restaurants')} className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700">Browse Restaurants</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {cart.map(item => (
            <li key={item.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center">
                <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-md" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="text-gray-500">₹{item.price}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                   <button 
                     onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                     className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                   >
                     <Minus className="h-4 w-4" />
                   </button>
                   <span className="px-2 font-medium">{item.quantity}</span>
                   <button 
                     onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                     className="px-2 py-1 text-green-600 hover:bg-green-50"
                   >
                     <Plus className="h-4 w-4" />
                   </button>
                </div>
                <div className="w-20 text-right font-bold">
                   ₹{item.price * item.quantity}
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        
        <div className="p-6 bg-gray-50 border-t border-gray-200">
           <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
             <p>Subtotal</p>
             <p>₹{totalAmount}</p>
           </div>
           <p className="mt-0.5 text-sm text-gray-500 mb-6">Delivery to: <span className="font-semibold">{user?.hostelRoom}</span></p>
           
           <button
             onClick={handleCheckout}
             className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
           >
             Checkout & Pay ₹{totalAmount}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;