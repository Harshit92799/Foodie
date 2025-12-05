import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Star, Clock } from 'lucide-react';

const RestaurantList = () => {
  const { restaurants } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Restaurants Nearby</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map(restaurant => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-gray-900">{restaurant.name}</h3>
                <span className="flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  <Star className="h-3 w-3 mr-1 fill-current" /> {restaurant.rating}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{restaurant.category}</p>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{restaurant.description}</p>
              
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600 border-t pt-3">
                 <div className="flex items-center">
                   <Clock className="h-4 w-4 mr-1" /> {restaurant.deliveryTime}
                 </div>
                 <Link 
                   to={`/restaurant/${restaurant.id}`}
                   className="text-orange-600 font-semibold hover:text-orange-800"
                 >
                   View Menu &rarr;
                 </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
