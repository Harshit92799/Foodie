import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Clock, Truck, Home, Star } from 'lucide-react';

const Orders = () => {
  const { orders, restaurants, submitFeedback } = useStore();
  const { user } = useAuth();
  
  // Local state for feedback modal
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const myOrders = orders.filter(o => o.userId === user?.id).sort((a, b) => b.timestamp - a.timestamp);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'placed': return <Clock className="text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="text-blue-500" />;
      case 'preparing': return <UtensilsIcon className="text-orange-500" />;
      case 'out_for_delivery': return <Truck className="text-purple-500" />;
      case 'delivered': return <Home className="text-green-500" />;
      default: return <Clock className="text-gray-500" />;
    }
  };

  const UtensilsIcon = ({ className }: { className?: string }) => (
    <svg className={`h-6 w-6 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
  );

  const handleSubmitFeedback = () => {
    if (selectedOrderId) {
      submitFeedback(selectedOrderId, rating, comment);
      setSelectedOrderId(null);
      setComment('');
      setRating(5);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {myOrders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {myOrders.map(order => {
             const rest = restaurants.find(r => r.id === order.restaurantId);
             return (
               <div key={order.id} className="bg-white shadow rounded-lg p-6 border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                     <div>
                       <h3 className="text-lg font-bold text-gray-900">{rest?.name || 'Restaurant'}</h3>
                       <p className="text-sm text-gray-500">Ordered on: {new Date(order.timestamp).toLocaleString()}</p>
                       <p className="text-sm text-gray-500">Order ID: #{order.id.slice(-6)}</p>
                     </div>
                     <div className="mt-2 md:mt-0 flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className="font-semibold uppercase text-sm">{order.status.replace(/_/g, ' ')}</span>
                     </div>
                  </div>
                  
                  <div className="border-t border-b border-gray-100 py-3 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                         <span>{item.quantity} x {item.name}</span>
                         <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total: ₹{order.totalAmount}</span>
                    
                    {order.status === 'delivered' && !order.rating && (
                       <button 
                         onClick={() => setSelectedOrderId(order.id)}
                         className="text-orange-600 font-medium hover:underline text-sm"
                       >
                         Rate Order
                       </button>
                    )}
                    {order.rating && (
                      <div className="flex items-center text-yellow-500">
                        <span className="text-sm text-gray-600 mr-2">You rated:</span>
                        {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`h-4 w-4 ${i < order.rating! ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    )}
                  </div>
               </div>
             );
          })}
        </div>
      )}

      {/* Feedback Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
           <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">Rate your food</h3>
              <div className="flex space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star className={`h-8 w-8 ${rating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full border rounded p-2 text-sm mb-4"
                rows={3}
                placeholder="How was the food?"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                 <button onClick={() => setSelectedOrderId(null)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
                 <button onClick={handleSubmitFeedback} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Submit</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
