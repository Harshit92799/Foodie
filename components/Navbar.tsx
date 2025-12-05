import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, User, LogOut, Menu, Utensils, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useStore();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path ? 'text-orange-600 font-semibold' : 'text-gray-600 hover:text-orange-600';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Utensils className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold text-gray-800">Foodie</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            
            {user?.role === 'student' && (
              <>
                <Link to="/restaurants" className={isActive('/restaurants')}>Restaurants</Link>
                <Link to="/orders" className={isActive('/orders')}>My Orders</Link>
              </>
            )}

            {user?.role === 'admin' && !user.restaurantId && (
              <Link to="/admin" className={`flex items-center space-x-1 ${isActive('/admin')}`}>
                <LayoutDashboard className="h-4 w-4" />
                <span>Admin Panel</span>
              </Link>
            )}

            {user?.role === 'admin' && user.restaurantId && (
              <Link to="/restaurant-panel" className={`flex items-center space-x-1 ${isActive('/restaurant-panel')}`}>
                <Store className="h-4 w-4" />
                <span>Restaurant Panel</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'student' && (
                  <Link to="/cart" className="relative p-2 text-gray-600 hover:text-orange-600">
                    <ShoppingCart className="h-6 w-6" />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                <div className="flex items-center space-x-2 border-l pl-4 ml-2">
                   <User className="h-5 w-5 text-gray-500" />
                   <div className="flex flex-col">
                     <span className="text-sm font-medium leading-none">{user.name}</span>
                     <span className="text-xs text-gray-400 leading-none mt-1 capitalize">
                        {user.restaurantId ? 'Owner' : user.role}
                     </span>
                   </div>
                </div>
                <button onClick={logout} className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                 {/* Explicit Link for Restaurant Owners */}
                 <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                   Restaurant Login
                 </Link>
                 
                 <div className="flex items-center space-x-4">
                   <Link to="/login" className="text-gray-600 hover:text-orange-600 font-medium">Login</Link>
                   <Link to="/register" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition shadow-sm">Register</Link>
                 </div>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden flex items-center">
             <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
               <Menu className="h-6 w-6" />
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50">Home</Link>
             {user ? (
                <>
                  {user.role === 'student' && <Link to="/restaurants" className="block px-3 py-2 text-base font-medium text-gray-700">Restaurants</Link>}
                  {user.role === 'student' && <Link to="/orders" className="block px-3 py-2 text-base font-medium text-gray-700">My Orders</Link>}
                  {user.role === 'admin' && !user.restaurantId && <Link to="/admin" className="block px-3 py-2 text-base font-medium text-orange-600 bg-orange-50 rounded-md">Admin Dashboard</Link>}
                  {user.role === 'admin' && user.restaurantId && <Link to="/restaurant-panel" className="block px-3 py-2 text-base font-medium text-orange-600 bg-orange-50 rounded-md">Restaurant Panel</Link>}
                  <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600">Logout</button>
                </>
             ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700">Student Login</Link>
                  <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-600">Restaurant Login</Link>
                  <Link to="/register" className="block px-3 py-2 text-base font-medium text-orange-600">Register</Link>
                </>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Store = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

export default Navbar;