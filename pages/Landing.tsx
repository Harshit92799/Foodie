import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, Truck, Store, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-orange-50 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-orange-50 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Delicious food delivered</span>{' '}
                  <span className="block text-orange-600 xl:inline">to your hostel door</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Late night cravings? Exam stress hunger? We've got you covered. Order from the best local restaurants and get it delivered straight to your room.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <div className="rounded-md shadow">
                    <Link
                      to={user?.role === 'admin' ? "/admin" : (user ? "/restaurants" : "/register")}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 md:py-4 md:text-lg"
                    >
                      {user?.role === 'admin' ? "Go to Admin Panel" : "Order Now"} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                  {!user && (
                    <div className="rounded-md shadow">
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg"
                      >
                        Restaurant Login
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Food spread"
          />
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why use Foodie?
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Room Delivery</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Direct delivery to your specific hostel block and room number.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Fast Service</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  Optimized for student schedules. Get food while it's hot.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">Hygienic</h3>
                <p className="mt-2 text-base text-gray-500 text-center">
                  We partner only with rated and hygiene-checked restaurants.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Partner Section */}
      <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Partner with Foodie
              </h2>
              <p className="mt-4 text-lg text-slate-300">
                Are you a restaurant owner? Join our platform to reach thousands of students. 
                Manage your menu, track orders in real-time, and grow your business with our dedicated Admin Panel.
              </p>
              <div className="mt-8 flex gap-4">
                 <div className="flex items-center gap-2 text-slate-300">
                    <Store className="text-orange-500" />
                    <span>Manage Restaurants</span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-300">
                    <BarChart className="text-orange-500" />
                    <span>Track Orders</span>
                 </div>
              </div>
              <div className="mt-8">
                <Link
                  to={user?.role === 'admin' ? "/admin" : "/login"}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-900 bg-white hover:bg-gray-100 transition"
                >
                  {user?.role === 'admin' ? "Go to Dashboard" : "Login as Restaurant Admin"}
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 relative">
               <div className="absolute inset-0 bg-orange-500 rounded-lg transform rotate-3 opacity-20"></div>
               <div className="relative bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl">
                  {/* Mock UI of Admin Panel */}
                  <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                     </div>
                     <div className="text-xs text-slate-400">Admin Dashboard</div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                        <span className="text-slate-300 text-sm">New Order #1234</span>
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">Pending</span>
                     </div>
                     <div className="flex justify-between items-center bg-slate-700 p-3 rounded">
                        <span className="text-slate-300 text-sm">New Order #1235</span>
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Delivered</span>
                     </div>
                     <div className="h-20 bg-slate-700 rounded w-full flex items-center justify-center text-slate-500 text-sm">
                        Chart / Analytics
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;