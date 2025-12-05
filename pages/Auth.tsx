import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthProps {
  mode: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hostelRoom, setHostelRoom] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'login') {
      const loggedUser = login(email, password);
      if (loggedUser) {
        if (loggedUser.role === 'admin') {
           if (loggedUser.restaurantId) {
             navigate('/restaurant-panel');
           } else {
             navigate('/admin');
           }
        } else {
           navigate('/');
        }
      } else {
        setError('Invalid credentials');
      }
    } else {
      if (!name || !email || !password || !phone || !hostelRoom) {
        setError('All fields are required');
        return;
      }
      register({
        name,
        email,
        password, // In real app, don't store plain text
        phone,
        hostelRoom,
        role
      });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          {mode === 'login' && (
             <p className="mt-2 text-center text-sm text-gray-500">
               Test Restaurant Owner: owner@spice.com / spice
             </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          
          <div className="rounded-md shadow-sm -space-y-px">
            {mode === 'register' && (
              <>
                <div className="mb-2">
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="tel"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                    placeholder="Hostel & Room No (e.g., Block A 101)"
                    value={hostelRoom}
                    onChange={(e) => setHostelRoom(e.target.value)}
                  />
                </div>
                 <div className="mb-2">
                   <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                   >
                     <option value="student">Student</option>
                     {/* For real app, admins are usually created by super admin */}
                     <option value="admin">Restaurant Admin</option>
                   </select>
                </div>
              </>
            )}
            
            <div className="mb-2">
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {mode === 'login' ? 'Sign in' : 'Register'}
            </button>
          </div>
          
          <div className="text-center">
             <button
               type="button"
               onClick={() => navigate(mode === 'login' ? '/register' : '/login')}
               className="text-sm text-orange-600 hover:text-orange-500"
             >
               {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;