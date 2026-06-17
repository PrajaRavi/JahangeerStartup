import { useEffect, useState } from 'react';
import { User, ShoppingBag, Mail, Trash2, Edit3, Menu, X, Users, DollarSign, Loader } from 'lucide-react';
import { useSelector } from 'react-redux';
import UpdateUser from './UserUpdate';
import type { SignupFormData } from '../Redux/Slice/Auth.slice';
import { useNavigate } from 'react-router';
import DeliverAdmin from './DeliveryAdmin';
import { useTheme } from '../context/theme.context';

// Datasets provided
const initialUsers = [
 
  {
    _id: "USR001",
    username: "Ravi",
    email: "ravi@gmail.com",
    phoneNumber: "9876543210",
  },
  {
    _id: "USR002",
    username: "Aarav",
    email: "aarav@outlook.com",
    phoneNumber: "9123456789",
  },
];

const initialOrders = [
  {
    _id: "ORD001",
    User: "Ravi",
    Amount: "450",
    orderStatus: "Processing",
    Day: "Today",
    paymentStatus: "pending",
    Count: 5
  },
  {
    _id: "ORD002",
    User: "Aarav",
    Amount: "1200",
    orderStatus: "Shipped",
    Day: "Yesterday",
    paymentStatus: "completed",
    Count: 1
  }
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<string|undefined>('users');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const UsersData=useSelector((state:any)=>state.Auth.UsersData)
  const OrderData=useSelector((state:any)=>state.Auth.OrderData)
  // State Management for Data Manipulation
  const LogedInUser=useSelector((state:any)=>state.Auth.ActiveUser)
  const [users, setUsers] = useState(initialUsers);
  const [orders, setOrders] = useState(initialOrders);
  let [OpenUpdateUserModal,setOpenUpdateUserModal]=useState(false)
  let [SelectedUserForUpdate,setSelectedUserForUpdate]=useState<SignupFormData>()
  const navigate=useNavigate();
  
    const { dark } = useTheme();

  // Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: null, id: null });
  const [updatingId, setUpdatingId] = useState(null);

  // Navigation Setup
  const navigationItems = [
    { id: 'users', label: 'Users', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'contact', label: 'Contact Requests', icon: Mail },
  ];

  // Action Handlers
  const openDeleteModal = (type:any, id:any) => {
    setDeleteModal({ isOpen: true, type, id });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, type: null, id: null });
  };

  const handleDeleteConfirm = () => {
    const { type, id } = deleteModal;
    if (type === 'users') {
      setUsers(users.filter(u => u._id !== id));
    } else if (type === 'orders') {
      setOrders(orders.filter(o => o._id !== id));
    }
    closeDeleteModal();
  };

  const handleUpdateMock = (id:any) => {
    setUpdatingId(id);
    // Simulating API loading interaction delay
    setTimeout(() => {
      setUpdatingId(null);
      alert(`Update processing triggered for item ID: ${id}`);
    }, 800);
  };
  useEffect(()=>{
if(UsersData.length>0){
  setUsers(UsersData)
}
  },[UsersData])
  useEffect(()=>{
if(OrderData.length>0){
  setOrders(OrderData)
}
  },[OrderData])
  useEffect(()=>{
if(LogedInUser._id==""||!LogedInUser._id){
navigate("/")
}
  },[])

  return (
    <>
    {OpenUpdateUserModal&&<UpdateUser UserData={SelectedUserForUpdate as SignupFormData} setOpenUpdateUserModal={setOpenUpdateUserModal}/>}
    {LogedInUser.role=="admin"?<div className={`min-h-screen pt-20 flex  w-125 sm:w-full transition-all duration-500 ${
        dark
        ? "bg-linear-to-br  from-[#023B40] to-[#01BCBC] text-white"
        : "bg-slate-50 text-slate-900"
        }`}>
      
     
      {/* --- SIDEBAR COMPONENTS (Responsive) --- */}
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar Unit */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 transform lg:transform-none lg:relative lg:flex flex-col
        transition-transform duration-300 ease-out p-6 
        bg-slate-900/60 lg:bg-white/5 border-r lg:border border-white/10 backdrop-blur-xl lg:rounded-2xl shadow-2xl
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header Title */}
        <div className="flex items-center  justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-cyan-200 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="font-black text-white text-lg">Ω</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-tr from-white to-slate-400">
              GlassAdmin
            </span>
          </div>
          <button onClick={() => setIsMobileSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Action Menu Links */}
        <nav className="space-y-2 flex-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-300 group
                  ${isActive 
                    ? 'bg-linear-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-white shadow-inner shadow-indigo-500/10' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'}
                `}
              >
                <IconComponent size={18} className={`transition-transform duration-300 ${isActive ? 'text-indigo-400 scale-110' : 'group-hover:scale-110'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
        
        {/* Sidebar Footer User Info */}
        <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center font-bold text-indigo-300">
            RP
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Ravi Prajapati</p>
            <p className="text-xs text-slate-400">Lead Developer</p>
          </div>
        </div>
      </aside>

      {/* --- RIGHT SIDE MAIN CONTAINER --- */}
      <main className="flex-1 max-h-screen  flex flex-col min-w-0 lg:ml-6 mt-14 lg:mt-0">
        
        {/* Mobile Sticky Navbar Controller */}
        <header className="fixed top-15 inset-x-0 h-14 bg-slate-950/40 backdrop-blur-md border-b border-white/5 px-4 flex items-center justify-between lg:hidden z-30">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-indigo-500 flex items-center justify-center text-sm font-bold">G</div>
            <span className="font-bold text-sm">GlassAdmin</span>
          </div>
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Quick Summary Aggregates / Topbar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
          <div>
            <h1 className="text-2xl font-bold tracking-tight capitalize">{activeTab} View</h1>
            <p className="text-sm text-slate-400">Manage, evaluate, and edit system application entries instantly.</p>
          </div>
          <div className="flex gap-3 text-xs">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <Users size={14} className="text-indigo-400" />
              <span>Users: {users.length}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
              <DollarSign size={14} className="text-emerald-400" />
              <span>Orders: {orders.length}</span>
            </div>
          </div>
        </div>

        {/* Content Render Conditional Container */}
        <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {activeTab === 'contact' ? (
            /* Contact View Empty Fallback State */
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 text-indigo-400">
                <Mail size={28} />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">No New Contact Form Logs</h3>
              <p className="max-w-xs text-sm mt-1">All standard inbound customer request payloads have been resolved.</p>
            </div>
          ) : (
            /* Unified Dynamic Responsive Table Markup Layout */
            <div className="overflow-x-auto w-full flex-1">
              <table className="w-full text-left border-collapse min-w-175">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                    <th className="p-4 pl-6">ID</th>
                    {activeTab === 'users' ? (
                      <>
                        <th className="p-4">Username</th>
                        <th className="p-4">Email Address</th>
                        <th className="p-4">Phone Registration</th>
                      </>
                    ) : (
                      <>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Cost (RS)</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Order Status</th>
                        <th className="p-4">Payment Status</th>
                        <th className="p-4">Fulfilled Timeline</th>
                      </>
                    )}
                    <th className="p-4 text-center pr-6">System Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-medium">
                  {activeTab === 'users' ? (
                    users.map((row:any) => (
                      <tr key={row._id} className="hover:bg-white/2 transition-colors duration-150">
                        <td className="p-4 pl-6 font-mono text-xs text-slate-400">{row._id}</td>
                        <td className="p-4 text-slate-100">{row.username}</td>
                        <td className="p-4 text-slate-300 font-normal">{row.email}</td>
                        <td className="p-4 text-slate-400 font-normal">{row.phoneNumber}</td>
                        <td className="p-4 text-center pr-6">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => {setSelectedUserForUpdate({_id:row._id,email:row.email,username:row.username,phoneNumber:row.phoneNumber,role:row.role,profilePicture:""})
                              setOpenUpdateUserModal(true)
                            }}
                              disabled={updatingId === row._id}
                              className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-colors"
                              title="Update Entry"
                            >
                              {updatingId === row._id ? <Loader size={15} className="animate-spin" /> : <Edit3 size={15} />}
                            </button>
                            <button 
                              onClick={() => openDeleteModal('users', row._id)}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    orders.map((row) => (
                      <tr key={row._id} className="hover:bg-white/2 transition-colors duration-150">
                        <td className="p-4 pl-6 font-mono text-xs text-slate-400">{row._id}</td>
                        <td className="p-4 text-slate-100">{row.User}</td>
                        <td className="p-4 text-emerald-400 font-semibold">Rs.{row.Amount}</td>
                        <td className="p-4 text-slate-300 font-normal">{row.Count} items</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            row.orderStatus === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {row.orderStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            row.orderStatus === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {row.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-400 font-normal">
                          {/* <div>{row.Time}</div> */}
                          <div className="text-[10px] ">{row.Day}</div>
                        </td>
                        <td className="p-4 text-center pr-6">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleUpdateMock(row._id)}
                              disabled={updatingId === row._id}
                              className="p-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 transition-colors"
                            >
                              {updatingId === row._id ? <Loader size={15} className="animate-spin" /> : <Edit3 size={15} />}
                            </button>
                            <button 
                              onClick={() => openDeleteModal('orders', row._id)}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* Table Data Empty Validation Flag state */}
              {((activeTab === 'users' && users.length === 0) || (activeTab === 'orders' && orders.length === 0)) && (
                <div className="p-8 text-center text-slate-500 font-normal text-sm">
                  No records found in this context category.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* --- CONFIRMATION MODAL POPUP (Animated via Tailwind Utility) --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur effect overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity duration-300"
            onClick={closeDeleteModal}
          />
          
          {/* Interactive core component content container box */}
          <div className="bg-slate-900/90 border border-white/10 rounded-2xl p-6 max-w-sm w-full relative z-10 shadow-2xl backdrop-blur-2xl animate-[fadeIn_0.2s_ease-out] transform scale-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4">
              <Trash2 size={22} />
            </div>
            
            <h3 className="text-lg font-bold text-center text-white">Confirm Removal</h3>
            <p className="text-sm text-slate-400 text-center mt-2">
              Are you sure you want to delete entry <span className="font-mono text-indigo-300">{deleteModal.id}</span>? This action cannot be reversed.
            </p>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white font-semibold transition-all text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-linear-to-r from-rose-600 to-red-500 text-white font-semibold shadow-lg shadow-rose-600/20 hover:from-rose-500 hover:to-red-400 transition-all text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>:
    
    <DeliverAdmin/>
     }
    </>

  );
}