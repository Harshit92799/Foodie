import React from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Plus, Star } from 'lucide-react';

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { restaurants, getRestaurantMenu, addToCart } = useStore();
  
  const restaurant = restaurants.find(r => r.id === id);
  const menu = getRestaurantMenu(id || '');

  if (!restaurant) return <div className="text-center py-10">Restaurant not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Restaurant Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-6">
         <img src={restaurant.image} alt={restaurant.name} className="w-full md:w-64 h-48 object-cover rounded-lg" />
         <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            <p className="text-gray-500 mt-2">{restaurant.category} • {restaurant.deliveryTime}</p>
            <div className="mt-2 flex items-center">
               <Star className="h-5 w-5 text-yellow-400 fill-current" />
               <span className="ml-1 font-bold text-gray-700">{restaurant.rating}</span>
               <span className="ml-2 text-gray-400 text-sm">(100+ ratings)</span>
            </div>
            <p className="mt-4 text-gray-600">{restaurant.description}</p>
         </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {menu.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4">
              <div className="flex-1">
                 <div className="flex items-center">
                    <img 
                      src={item.type === 'veg' ? "https://img.icons8.com/color/48/000000/vegetarian-food-symbol.png" : "https://img.icons8.com/color/48/000000/non-vegetarian-food-symbol.png"} 
                      alt={item.type}
                      className="w-4 h-4 mr-2"
                    />
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                 </div>
                 <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                 <div className="mt-2 font-semibold">₹{item.price}</div>
              </div>
              <div className="relative">
                 <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                 <button 
                   onClick={() => addToCart(item)}
                   className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-green-600 border border-gray-200 px-4 py-1 rounded shadow text-sm font-bold hover:bg-green-50 uppercase"
                 >
                   ADD
                 </button>
              </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default RestaurantDetails;
