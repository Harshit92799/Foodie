import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { OrderStatus, FoodItem, Restaurant, User } from '../types';
import { generateFoodDescription } from '../services/geminiService';
import { 
  LayoutDashboard, Store, UtensilsCrossed, ShoppingBag, Users, MessageSquare, Settings, 
  LogOut, Plus, Trash2, Edit2, Search, Check, X, Sparkles, ChevronRight
} from 'lucide-react';

type Tab = 'dashboard' | 'restaurants' | 'menu' | 'orders' | 'students' | 'feedback' | 'settings';

const AdminDashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Render specific section based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardHome onChangeTab={setActiveTab} />;
      case 'restaurants': return <RestaurantManager />;
      case 'menu': return <MenuManager />;
      case 'orders': return <OrderManager />;
      case 'students': return <StudentManager />;
      case 'feedback': return <FeedbackManager />;
      case 'settings': return <SettingsManager />;
      default: return <DashboardHome onChangeTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700">
           <div className="flex items-center gap-2 font-bold text-white text-xl">
             <UtensilsCrossed className="text-orange-500" />
             Foodie Admin
           </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
           <SidebarItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
           <SidebarItem icon={<Store />} label="Restaurants" active={activeTab === 'restaurants'} onClick={() => setActiveTab('restaurants')} />
           <SidebarItem icon={<UtensilsCrossed />} label="Menu Items" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
           <SidebarItem icon={<ShoppingBag />} label="Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
           <SidebarItem icon={<Users />} label="Students" active={activeTab === 'students'} onClick={() => setActiveTab('students')} />
           <SidebarItem icon={<MessageSquare />} label="Feedback" active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} />
           <div className="border-t border-slate-700 my-4 pt-4">
              <SidebarItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
           </div>
        </nav>

        <div className="p-4 border-t border-slate-700">
           <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
                 {user?.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                 <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                 <p className="text-xs text-slate-400">Administrator</p>
              </div>
           </div>
           <button 
             onClick={logout}
             className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-md transition-colors"
           >
             <LogOut size={16} /> Logout
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
         {/* Mobile Header (visible only on small screens) */}
         <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
            <span className="font-bold">Foodie Admin</span>
            <button onClick={logout}><LogOut size={20} /></button>
         </div>

         {/* Content Area */}
         <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {renderContent()}
         </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
        : 'hover:bg-slate-800 hover:text-white'
    }`}
  >
    {React.cloneElement(icon, { size: 18 })}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

// --- SECTIONS ---

const DashboardHome = ({ onChangeTab }: { onChangeTab: (t: Tab) => void }) => {
  const { restaurants, menuItems, orders } = useStore();
  const { getAllUsers } = useAuth();
  
  const pendingOrders = orders.filter(o => ['placed', 'confirmed', 'preparing'].includes(o.status)).length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const students = getAllUsers().filter(u => u.role === 'student');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatsCard label="Total Orders" value={orders.length} color="bg-blue-500" icon={<ShoppingBag className="text-white" />} />
         <StatsCard label="Pending Delivery" value={pendingOrders} color="bg-orange-500" icon={<UtensilsCrossed className="text-white" />} />
         <StatsCard label="Total Revenue" value={`₹${totalRevenue}`} color="bg-green-600" icon={<span className="text-white font-bold text-xl">₹</span>} />
         <StatsCard label="Active Students" value={students.length} color="bg-purple-600" icon={<Users className="text-white" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Recent Orders */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-800">Recent Orders</h3>
               <button onClick={() => onChangeTab('orders')} className="text-sm text-orange-600 hover:underline">View All</button>
            </div>
            <div className="space-y-3">
               {orders.slice(0, 5).map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                     <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${order.status === 'delivered' ? 'bg-green-500' : 'bg-orange-500'}`} />
                        <div>
                           <p className="text-sm font-bold text-gray-900">#{order.id.slice(-6)}</p>
                           <p className="text-xs text-gray-500">{order.userName}</p>
                        </div>
                     </div>
                     <span className="text-sm font-bold">₹{order.totalAmount}</span>
                  </div>
               ))}
               {orders.length === 0 && <p className="text-gray-500 text-sm">No orders yet.</p>}
            </div>
         </div>

         {/* Restaurant Stats */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-gray-800">Restaurant Overview</h3>
               <button onClick={() => onChangeTab('restaurants')} className="text-sm text-orange-600 hover:underline">Manage</button>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-600">Total Restaurants</span>
                  <span className="font-bold text-gray-900">{restaurants.length}</span>
               </div>
               <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-600">Total Menu Items</span>
                  <span className="font-bold text-gray-900">{menuItems.length}</span>
               </div>
               <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                  <span className="text-gray-600">Avg. Rating</span>
                  <span className="font-bold text-yellow-600">4.5 ★</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const StatsCard = ({ label, value, color, icon }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
     <div>
       <p className="text-sm font-medium text-gray-500">{label}</p>
       <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
     </div>
     <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shadow-md`}>
       {icon}
     </div>
  </div>
);

const RestaurantManager = () => {
  const { restaurants, addRestaurant, updateRestaurant, deleteRestaurant } = useStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Restaurant>>({});

  const handleEdit = (rest: Restaurant) => {
    setFormData(rest);
    setEditingId(rest.id);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setFormData({
      name: '', category: '', deliveryTime: '', description: '', 
      image: 'https://picsum.photos/800/600', rating: 0 
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateRestaurant({ ...formData, id: editingId } as Restaurant);
    } else {
      addRestaurant({ ...formData, id: Date.now().toString(), rating: 4.0 } as Restaurant);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Restaurants</h2>
        <button onClick={handleAddNew} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700">
           <Plus size={18} /> Add Restaurant
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Time</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restaurants.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center">
                     <img className="h-10 w-10 rounded-full object-cover" src={r.image} alt="" />
                     <div className="ml-4">
                       <div className="text-sm font-medium text-gray-900">{r.name}</div>
                       <div className="text-sm text-gray-500">{r.rating} ★</div>
                     </div>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.deliveryTime}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(r)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                  <button onClick={() => { if(window.confirm('Delete restaurant?')) deleteRestaurant(r.id) }} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Restaurant' : 'Add Restaurant'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input required className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input required className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Delivery Time</label>
                    <input required className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.deliveryTime} onChange={e => setFormData({...formData, deliveryTime: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea required className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                 </div>
                 <div className="flex justify-end gap-2 mt-6">
                    <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-md text-gray-700">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md">{editingId ? 'Update' : 'Add'}</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const MenuManager = () => {
  const { menuItems, restaurants, addFoodItem, updateFoodItem, deleteFoodItem } = useStore();
  const [filterRest, setFilterRest] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<FoodItem>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const filteredItems = menuItems.filter(item => {
    const matchesRest = filterRest === 'all' || item.restaurantId === filterRest;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRest && matchesSearch;
  });

  const handleEdit = (item: FoodItem) => {
    setFormData(item);
    setEditingId(item.id);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({
       name: '', price: 0, type: 'veg', description: '', 
       restaurantId: restaurants[0]?.id || '', image: 'https://picsum.photos/200/200',
       isAvailable: true
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const handleGenerateDesc = async () => {
    if (!formData.name || !formData.type) return;
    setIsGenerating(true);
    const desc = await generateFoodDescription(formData.name, formData.type);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData, price: Number(formData.price) } as FoodItem;
    if (editingId) {
      updateFoodItem(payload);
    } else {
      addFoodItem({ ...payload, id: Date.now().toString() });
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Manage Menu</h2>
        <div className="flex gap-2 w-full md:w-auto">
           <input 
             placeholder="Search items..." 
             className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-64"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
           <button onClick={handleAdd} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 whitespace-nowrap">
             <Plus size={18} /> Add Item
           </button>
        </div>
      </div>

      <div className="mb-4">
         <div className="flex overflow-x-auto gap-2 pb-2">
            <button 
               onClick={() => setFilterRest('all')}
               className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${filterRest === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-gray-600 border'}`}
            >
               All Restaurants
            </button>
            {restaurants.map(r => (
               <button 
                  key={r.id} 
                  onClick={() => setFilterRest(r.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${filterRest === r.id ? 'bg-slate-800 text-white' : 'bg-white text-gray-600 border'}`}
               >
                  {r.name}
               </button>
            ))}
         </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center">
                      <img src={item.image} className="h-8 w-8 rounded object-cover mr-3" alt="" />
                      <span className="font-medium text-gray-900">{item.name}</span>
                   </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {restaurants.find(r => r.id === item.restaurantId)?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.type === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.type}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-3"><Edit2 size={16} /></button>
                  <button onClick={() => { if(window.confirm('Delete item?')) deleteFoodItem(item.id) }} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg p-6">
               <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Item' : 'Add Item'}</h3>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Restaurant</label>
                        <select className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.restaurantId} onChange={e => setFormData({...formData, restaurantId: e.target.value})}>
                           {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                     </div>
                     <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Food Name</label>
                        <input required className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                        <input type="number" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                           <option value="veg">Veg</option>
                           <option value="non-veg">Non-Veg</option>
                        </select>
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">Description</label>
                     <div className="flex gap-2">
                        <textarea className="mt-1 block w-full border border-gray-300 rounded-md p-2" rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                        <button type="button" onClick={handleGenerateDesc} disabled={isGenerating} className="mt-1 px-3 border rounded-md bg-gray-50 hover:bg-gray-100 flex items-center justify-center">
                           {isGenerating ? '...' : <Sparkles className="text-purple-600" />}
                        </button>
                     </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input className="mt-1 block w-full border border-gray-300 rounded-md p-2" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                 </div>
                  <div className="flex justify-end gap-2 mt-6">
                     <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded-md text-gray-700">Cancel</button>
                     <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-md">{editingId ? 'Update' : 'Add'}</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

const OrderManager = () => {
  const { orders, updateOrderStatus, restaurants } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter(o => filterStatus === 'all' || o.status === filterStatus).sort((a,b) => b.timestamp - a.timestamp);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Orders</h2>
      
      <div className="mb-4 overflow-x-auto pb-2">
         <div className="flex gap-2">
           {['all', 'placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'].map(status => (
             <button
               key={status}
               onClick={() => setFilterStatus(status)}
               className={`px-3 py-1 rounded-full text-sm font-medium capitalize whitespace-nowrap ${filterStatus === status ? 'bg-orange-600 text-white' : 'bg-white border text-gray-600'}`}
             >
               {status.replace(/_/g, ' ')}
             </button>
           ))}
         </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{order.id.slice(-6)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                   <div className="text-xs text-gray-500">{order.userPhone} | {order.deliveryAddress}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {restaurants.find(r => r.id === order.restaurantId)?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{order.totalAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${
                     order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                     order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                     {order.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   <select 
                      className="text-xs border-gray-300 rounded-md shadow-sm p-1"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                   >
                     <option value="placed">Placed</option>
                     <option value="confirmed">Confirmed</option>
                     <option value="preparing">Preparing</option>
                     <option value="out_for_delivery">Out for Delivery</option>
                     <option value="delivered">Delivered</option>
                   </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StudentManager = () => {
  const { getAllUsers } = useAuth();
  const { orders } = useStore();
  const students = getAllUsers().filter(u => u.role === 'student');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Students</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email / Phone</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hostel</th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Orders</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
             {students.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                   <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                         <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold mr-3">
                            {s.name.charAt(0)}
                         </div>
                         <span className="text-sm font-medium text-gray-900">{s.name}</span>
                      </div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{s.email}</div>
                      <div className="text-xs text-gray-500">{s.phone}</div>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.hostelRoom}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {orders.filter(o => o.userId === s.id).length}
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FeedbackManager = () => {
   const { orders, restaurants } = useStore();
   const feedbackOrders = orders.filter(o => o.rating && o.rating > 0).sort((a,b) => b.timestamp - a.timestamp);

   return (
      <div>
         <h2 className="text-2xl font-bold text-gray-900 mb-6">Feedback & Ratings</h2>
         <div className="grid grid-cols-1 gap-4">
            {feedbackOrders.map(order => (
               <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <span className="font-bold text-gray-900">{order.userName}</span>
                           <span className="text-gray-400 text-sm">•</span>
                           <span className="text-orange-600 font-medium text-sm">{restaurants.find(r => r.id === order.restaurantId)?.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{new Date(order.timestamp).toDateString()}</p>
                     </div>
                     <div className="flex bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-bold">
                        {order.rating} ★
                     </div>
                  </div>
                  <p className="text-gray-700 italic bg-gray-50 p-3 rounded border border-gray-100">
                     "{order.feedback}"
                  </p>
               </div>
            ))}
            {feedbackOrders.length === 0 && <p className="text-gray-500">No feedback received yet.</p>}
         </div>
      </div>
   );
};

const SettingsManager = () => {
   return (
      <div className="max-w-2xl">
         <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Settings</h2>
         <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <div>
               <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
               <p className="mt-1 text-sm text-gray-500">Update your account's profile information and email address.</p>
               <div className="mt-4 grid grid-cols-1 gap-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700">Name</label>
                     <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" defaultValue="Admin User" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700">Email</label>
                     <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" defaultValue="admin@foodie.com" />
                  </div>
               </div>
            </div>
            <div className="pt-6 border-t border-gray-200">
               <h3 className="text-lg font-medium leading-6 text-gray-900">Security</h3>
               <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
               </div>
            </div>
            <div className="flex justify-end">
               <button className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700">Save Changes</button>
            </div>
         </div>
      </div>
   );
};

export default AdminDashboard;