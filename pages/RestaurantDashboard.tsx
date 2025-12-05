import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { OrderStatus, FoodItem } from '../types';
import { generateFoodDescription } from '../services/geminiService';
import { 
  LayoutDashboard, ShoppingBag, MessageSquare, LogOut, 
  Plus, Trash2, Edit2, Sparkles, ChefHat, CheckCircle, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

type Tab = 'dashboard' | 'menu' | 'orders' | 'reviews';

const RestaurantDashboard = () => {
  const { logout, user } = useAuth();
  const { restaurants } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  
  // Find the restaurant owned by this user
  const myRestaurant = restaurants.find(r => r.id === user?.restaurantId);

  if (!myRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">No Restaurant Found</h2>
        <p className="text-gray-600 mb-6">Your account is not linked to any restaurant.</p>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
      </div>
    );
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <RestDashboardHome restaurantId={myRestaurant.id} onChangeTab={setActiveTab} />;
      case 'menu': return <RestMenuManager restaurantId={myRestaurant.id} />;
      case 'orders': return <RestOrderManager restaurantId={myRestaurant.id} />;
      case 'reviews': return <RestReviewManager restaurantId={myRestaurant.id} />;
      default: return <RestDashboardHome restaurantId={myRestaurant.id} onChangeTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700">
           <div className="flex items-center gap-2 font-bold text-white text-lg">
             <ChefHat className="text-orange-500" />
             {myRestaurant.name}
           </div>
           <p className="text-xs text-slate-500 mt-1">Restaurant Partner</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
           <SidebarItem icon={<LayoutDashboard />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
           <SidebarItem icon={<ShoppingBag />} label="Live Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
           <SidebarItem icon={<ChefHat />} label="Menu Management" active={activeTab === 'menu'} onClick={() => setActiveTab('menu')} />
           <SidebarItem icon={<MessageSquare />} label="Reviews" active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} />
        </nav>

        <div className="p-4 border-t border-slate-700">
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
         <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
            <span className="font-bold">{myRestaurant.name}</span>
            <button onClick={logout}><LogOut size={20} /></button>
         </div>

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

// --- Sections ---

const RestDashboardHome = ({ restaurantId, onChangeTab }: { restaurantId: string, onChangeTab: (t: Tab) => void }) => {
  const { orders } = useStore();
  
  const myOrders = orders.filter(o => o.restaurantId === restaurantId);
  const pending = myOrders.filter(o => ['placed', 'confirmed', 'preparing'].includes(o.status)).length;
  const todayRevenue = myOrders.reduce((sum, o) => sum + o.totalAmount, 0); // Simplified total
  const completed = myOrders.filter(o => o.status === 'delivered').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Restaurant Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Pending Orders</p>
            <p className="text-3xl font-bold text-orange-600 mt-1">{pending}</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600 mt-1">₹{todayRevenue}</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">Completed Orders</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{completed}</p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Recent Orders</h3>
            <button onClick={() => onChangeTab('orders')} className="text-sm text-orange-600 hover:underline">Manage Orders</button>
        </div>
        <div className="space-y-3">
            {myOrders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p className="text-sm font-bold text-gray-900">#{order.id.slice(-6)} <span className="text-gray-400 font-normal">by {order.userName}</span></p>
                        <p className="text-xs text-gray-500">{new Date(order.timestamp).toLocaleTimeString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                             order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' : 
                             order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                         }`}>
                             {order.status}
                         </span>
                         <span className="font-bold text-gray-800">₹{order.totalAmount}</span>
                    </div>
                </div>
            ))}
            {myOrders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
};

const RestOrderManager = ({ restaurantId }: { restaurantId: string }) => {
    const { orders, updateOrderStatus } = useStore();
    const myOrders = orders.filter(o => o.restaurantId === restaurantId).sort((a,b) => b.timestamp - a.timestamp);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Orders</h2>
            <div className="space-y-4">
                {myOrders.map(order => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                   <h3 className="text-lg font-bold text-gray-900">#{order.id.slice(-6)}</h3>
                                   <span className="text-gray-500 text-sm">• {order.userName}</span>
                                   <span className="text-gray-400 text-sm">({order.userPhone})</span>
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    Delivering to: <span className="font-semibold">{order.deliveryAddress}</span>
                                </div>
                                <div className="mt-3 space-y-1">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="text-sm text-gray-800">
                                            <span className="font-bold">{item.quantity}x</span> {item.name}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-2 text-orange-600 font-bold">Total: ₹{order.totalAmount}</div>
                            </div>
                            
                            <div className="flex flex-col gap-2 min-w-[200px]">
                                <label className="text-xs font-semibold text-gray-500 uppercase">Update Status</label>
                                <select 
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                    value={order.status}
                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                >
                                    <option value="placed">Placed</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="out_for_delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                                <div className="text-xs text-gray-400 text-center mt-1">
                                    {new Date(order.timestamp).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                 {myOrders.length === 0 && <p className="text-gray-500 text-center py-10">No orders received yet.</p>}
            </div>
        </div>
    );
};

const RestMenuManager = ({ restaurantId }: { restaurantId: string }) => {
    const { menuItems, addFoodItem, updateFoodItem, deleteFoodItem } = useStore();
    const myItems = menuItems.filter(i => i.restaurantId === restaurantId);

    const [isModalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<FoodItem>>({});
    const [isGenerating, setIsGenerating] = useState(false);

    const handleEdit = (item: FoodItem) => {
        setFormData(item);
        setEditingId(item.id);
        setModalOpen(true);
    };
    
    const handleAdd = () => {
        setFormData({
            name: '', price: 0, type: 'veg', description: '', 
            restaurantId: restaurantId, // Force current restaurant ID
            image: 'https://picsum.photos/200/200',
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
        const payload = { ...formData, price: Number(formData.price), restaurantId } as FoodItem;
        if (editingId) {
            updateFoodItem(payload);
        } else {
            addFoodItem({ ...payload, id: Date.now().toString() });
        }
        setModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Menu</h2>
                <button onClick={handleAdd} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700">
                    <Plus size={18} /> Add Item
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {myItems.map(item => (
                    <div key={item.id} className="bg-white border rounded-lg p-4 flex gap-4 items-center shadow-sm">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" />
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="font-bold text-gray-800">₹{item.price}</span>
                                <span className={`text-xs px-2 py-0.5 rounded ${item.type === 'veg' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.type}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18}/></button>
                             <button onClick={() => { if(window.confirm('Delete item?')) deleteFoodItem(item.id) }} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6">
                        <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Item' : 'Add Item'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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

const RestReviewManager = ({ restaurantId }: { restaurantId: string }) => {
    const { orders } = useStore();
    const reviews = orders.filter(o => o.restaurantId === restaurantId && o.rating && o.rating > 0).sort((a,b) => b.timestamp - a.timestamp);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="space-y-4">
                {reviews.map(order => (
                    <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">{order.userName || 'Student'}</span>
                                <span className="text-xs text-gray-500">{new Date(order.timestamp).toDateString()}</span>
                            </div>
                            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-bold">
                                {order.rating} ★
                            </div>
                        </div>
                        <p className="text-gray-700 mt-2">"{order.feedback}"</p>
                    </div>
                ))}
                {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
            </div>
        </div>
    );
};

export default RestaurantDashboard;