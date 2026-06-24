import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Car as CarIcon,
  Mail,
  Users,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Eye,
  FileCheck,
  Search,
  Upload,
  AlertCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  X,
  Phone,
  FolderOpen,
  RefreshCw,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { Car, Profile, Message } from '../types.js';
import { AdminSettings } from '../components/AdminSettings.js';

type ActiveTab = 'dashboard' | 'cars' | 'messages' | 'users' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { user, logout, loading, dbStatus } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // States for lists
  const [cars, setCars] = useState<Car[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Car Form Modal States
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Message View States
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [messageFilter, setMessageFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isSendingReply, setIsSendingReply] = useState<Record<string, boolean>>({});
  const [isGeneratingMock, setIsGeneratingMock] = useState(false);

  // Sub-admin Invite States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Drag and Drop State for Uploads
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { register: carRegister, handleSubmit: handleCarSubmit, reset: resetCarForm, setValue: setCarValue, watch: watchCarForm } = useForm();
  const { register: inviteRegister, handleSubmit: handleInviteSubmit, reset: resetInviteForm } = useForm();

  const carFormImages = watchCarForm('images') || [];

  // Authentication Guard
  useEffect(() => {
    if (!loading && !user) {
      navigate('/admin/login');
    }
  }, [user, loading, navigate]);

  // Load backend data
  const loadAllData = async () => {
    setIsDataLoading(true);
    try {
      const [carsRes, msgRes, profRes] = await Promise.all([
        fetch('/api/cars'),
        fetch('/api/messages'),
        fetch('/api/profiles')
      ]);

      if (carsRes.ok) setCars(await carsRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
      if (profRes.ok && user?.role === 'super_admin') setProfiles(await profRes.json());
    } catch (err) {
      console.error('Error loading dashboard data', err);
      toast.error('Failed to update dashboard data.');
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <div className="text-center">
          <RefreshCwIcon className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
          <p className="font-heading text-xs tracking-wider uppercase font-bold text-neutral-400">Loading Session...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
      navigate('/admin/login');
    } catch (err) {
      toast.error('Failed to log out.');
    }
  };

  // Stats Counters
  const totalCars = cars.length;
  const newArrivalsCount = cars.filter(c => c.condition === 'new_arrival').length;
  const soldCount = cars.filter(c => c.condition === 'sold').length;
  const unreadMessagesCount = messages.filter(m => !m.is_read).length;

  // ================= CAR ACTIONS =================

  const handleOpenAddCar = () => {
    setEditingCar(null);
    setUploadedImageUrls([]);
    resetCarForm({
      title: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      mileage: '',
      location: '',
      description: '',
      condition: 'available',
      type: 'classic',
      contact_phone: '',
      images: []
    });
    setIsCarModalOpen(true);
  };

  const handleOpenEditCar = (car: Car) => {
    setEditingCar(car);
    setUploadedImageUrls(car.images || []);
    resetCarForm({
      title: car.title,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      location: car.location,
      description: car.description,
      condition: car.condition,
      type: car.type || 'classic',
      contact_phone: car.contact_phone || '',
      images: car.images || []
    });
    setIsCarModalOpen(true);
  };

  const handleQuickMarkAsSold = async (carId: string) => {
    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ condition: 'sold' })
      });

      if (res.ok) {
        toast.success('Marked car as Sold!');
        loadAllData();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error('Failed to update vehicle status.');
    }
  };

  const handleDeleteCar = async (carId: string, carTitle: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete the listing for "${carTitle}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/cars/${carId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Listing deleted successfully.');
        loadAllData();
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error('Could not delete listing.');
    }
  };

  const onCarFormSubmit = async (data: any) => {
    const finalData = {
      ...data,
      images: uploadedImageUrls
    };

    try {
      const url = editingCar ? `/api/cars/${editingCar.id}` : '/api/cars';
      const method = editingCar ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData)
      });

      if (res.ok) {
        toast.success(editingCar ? 'Listing updated successfully!' : 'New car listed successfully!');
        setIsCarModalOpen(false);
        loadAllData();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving listing details.');
    }
  };

  // Image Upload Logic (supports both click and drag & drop)
  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;
    if (uploadedImageUrls.length + files.length > 10) {
      toast.error('Maximum limit of 10 images reached.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        const updatedUrls = [...uploadedImageUrls, ...result.urls];
        setUploadedImageUrls(updatedUrls);
        setCarValue('images', updatedUrls);
        toast.success(`${files.length} image(s) uploaded successfully!`);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error('Failed to upload image assets.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = uploadedImageUrls.filter((_, idx) => idx !== indexToRemove);
    setUploadedImageUrls(updated);
    setCarValue('images', updated);
  };

  // ================= MESSAGE ACTIONS =================

  const handleToggleReadMessage = async (msgId: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/messages/${msgId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: !currentRead })
      });

      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, is_read: !currentRead } : m));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const res = await fetch(`/api/messages/${msgId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Message deleted.');
        setMessages(prev => prev.filter(m => m.id !== msgId));
      }
    } catch (err) {
      toast.error('Could not delete message.');
    }
  };

  const handleSendReply = async (msgId: string) => {
    const text = replyTexts[msgId] || '';
    if (!text.trim()) {
      toast.error('Please enter a reply message.');
      return;
    }

    setIsSendingReply(prev => ({ ...prev, [msgId]: true }));
    try {
      const res = await fetch(`/api/messages/${msgId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (res.ok) {
        const updatedMsg = await res.json();
        toast.success('Reply submitted successfully!');
        setReplyTexts(prev => ({ ...prev, [msgId]: '' }));
        // Instantly update the message in local state
        setMessages(prev => prev.map(m => m.id === msgId ? updatedMsg : m));
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to submit reply.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.');
    } finally {
      setIsSendingReply(prev => ({ ...prev, [msgId]: false }));
    }
  };

  const handleGenerateMockInquiries = async () => {
    setIsGeneratingMock(true);
    try {
      const res = await fetch('/api/messages/mock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        toast.success('Sample inquiries generated.');
        await loadAllData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to generate sample inquiries.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.');
    } finally {
      setIsGeneratingMock(false);
    }
  };

  // ================= SUB-ADMIN ACTIONS =================

  const onInviteFormSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/profiles/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        toast.success(`Sub-admin invited!`);
        setIsInviteModalOpen(false);
        resetInviteForm();
        loadAllData();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Invite failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add sub-admin.');
    }
  };

  const handleRemoveProfile = async (profileId: string, name: string) => {
    if (profileId === user.id) {
      toast.error('You cannot delete your own profile.');
      return;
    }
    if (!window.confirm(`Are you sure you want to revoke admin privileges for "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/profiles/${profileId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Admin privileges revoked.');
        loadAllData();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove sub-admin.');
    }
  };

  return (
    <div id="admin-workspace-layout" className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar (Desktop) */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } shrink-0 bg-neutral-950 border-r border-neutral-800 transition-all duration-300 md:flex flex-col justify-between hidden h-screen sticky top-0`}
      >
        <div>
          {/* Sidebar Header / Logo */}
          <div className="p-6 flex items-center justify-between border-b border-neutral-800">
            <img
              src="/logo.png"
              alt="Logo"
              className={`h-8 object-contain brightness-0 invert transition-all ${isSidebarOpen ? 'block' : 'hidden'}`}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {isSidebarOpen ? (
              <span className="font-heading font-bold text-xs uppercase text-accent tracking-widest pl-1">ADMIN</span>
            ) : (
              <span className="font-heading font-bold text-lg text-accent">K</span>
            )}
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              id="sidebar-tab-dash"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'dashboard' ? 'bg-accent text-neutral-950' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab('cars')}
              id="sidebar-tab-cars"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'cars' ? 'bg-accent text-neutral-950' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <CarIcon className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Manage Cars</span>}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              id="sidebar-tab-msg"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'messages' ? 'bg-accent text-neutral-950' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <div className="relative">
                <Mail className="w-4 h-4 shrink-0" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                    {unreadMessagesCount}
                  </span>
                )}
              </div>
              {isSidebarOpen && <span>Messages</span>}
            </button>

            {user?.role === 'super_admin' && (
              <button
                onClick={() => setActiveTab('users')}
                id="sidebar-tab-users"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'users' ? 'bg-accent text-neutral-950' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                {isSidebarOpen && <span>Manage Admins</span>}
              </button>
            )}

            <button
              onClick={() => setActiveTab('settings')}
              id="sidebar-tab-settings"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-colors ${
                activeTab === 'settings' ? 'bg-accent text-neutral-950' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Settings</span>}
            </button>
          </div>
        </div>

        {/* Sidebar Footer Log out */}
        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={handleLogout}
            id="sidebar-logout-btn"
            className="w-full flex items-center space-x-3 px-4 py-3 text-neutral-500 hover:text-red-400 rounded-sm text-xs font-heading font-bold uppercase tracking-wider transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* Topbar / Header */}
        <header className="bg-neutral-950 border-b border-neutral-800 min-h-16 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sticky top-0 z-40">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link
              to="/"
              className="text-neutral-400 hover:text-accent transition-colors flex items-center shrink-0"
              title="Return to Showroom"
            >
              <ArrowLeft className="w-5 h-5 text-accent" />
            </Link>
            <h1 className="font-heading text-[11px] sm:text-sm font-bold uppercase tracking-wider text-neutral-200 leading-tight min-w-0">
              KSA Classics CRM — {activeTab}
            </h1>

            {/* Supabase / Local Fallback Database connection badge */}
            {dbStatus && (
              <span
                className={`text-[9px] sm:text-[10px] uppercase font-bold font-heading px-2 py-1 rounded-sm flex items-center space-x-1.5 shrink-0 ${
                  dbStatus.status === 'supabase'
                    ? 'bg-emerald-900/45 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-900/45 text-amber-300 border border-amber-800/60'
                }`}
                title={dbStatus.message}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dbStatus.status === 'supabase' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                <span className="hidden sm:inline">{dbStatus.status === 'supabase' ? 'Supabase Connected' : 'Local Fallback'}</span>
                <span className="sm:hidden">{dbStatus.status === 'supabase' ? 'Cloud' : 'Local'}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-xs text-neutral-400 hidden sm:inline">
              Welcome, <span className="text-white font-bold">{user.full_name}</span> ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="sm:hidden text-neutral-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <Link
              to="/"
              className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-neutral-600 text-white p-2 sm:px-3 sm:py-1.5 rounded-sm text-xs font-heading font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
              aria-label="Return to showroom"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-accent" />
              <span className="hidden sm:inline">Showroom</span>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Bar */}
        <div className={`md:hidden bg-neutral-950 border-b border-neutral-800 grid ${user?.role === 'super_admin' ? 'grid-cols-5' : 'grid-cols-4'} text-center`}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3.5 text-xs font-heading font-bold uppercase transition-colors flex flex-col items-center space-y-1 ${
              activeTab === 'dashboard' ? 'text-accent border-b-2 border-accent' : 'text-neutral-500'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[9px]">Dash</span>
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`py-3.5 text-xs font-heading font-bold uppercase transition-colors flex flex-col items-center space-y-1 ${
              activeTab === 'cars' ? 'text-accent border-b-2 border-accent' : 'text-neutral-500'
            }`}
          >
            <CarIcon className="w-4 h-4" />
            <span className="text-[9px]">Cars</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-3.5 text-xs font-heading font-bold uppercase transition-colors flex flex-col items-center space-y-1 relative ${
              activeTab === 'messages' ? 'text-accent border-b-2 border-accent' : 'text-neutral-500'
            }`}
          >
            <Mail className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-2 right-6 bg-red-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {unreadMessagesCount}
              </span>
            )}
            <span className="text-[9px]">Messages</span>
          </button>
          {user?.role === 'super_admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`py-3.5 text-xs font-heading font-bold uppercase transition-colors flex flex-col items-center space-y-1 ${
                activeTab === 'users' ? 'text-accent border-b-2 border-accent' : 'text-neutral-500'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-[9px]">Admins</span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 text-xs font-heading font-bold uppercase transition-colors flex flex-col items-center space-y-1 ${
              activeTab === 'settings' ? 'text-accent border-b-2 border-accent' : 'text-neutral-500'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-[9px]">Settings</span>
          </button>
        </div>

        {/* Dashboard Workspace View Container */}
        <main className="flex-grow p-4 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {isDataLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-neutral-400">
              <RefreshCwIcon className="w-8 h-8 text-accent animate-spin mb-3" />
              <p className="text-xs uppercase font-heading font-bold tracking-wider">Syncing Database Collections...</p>
            </div>
          ) : (
            <>
              {/* ================= VIEW: DASHBOARD HOME ================= */}
              {activeTab === 'dashboard' && (
                <div id="dash-view" className="space-y-8 animate-fade-in">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat Card 1 */}
                    <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-500 block">
                          Showroom Inventory
                        </span>
                        <span className="text-3xl font-heading font-bold text-white block mt-1">{totalCars}</span>
                      </div>
                      <div className="bg-neutral-900 p-3 rounded-sm border border-neutral-800">
                        <CarIcon className="w-6 h-6 text-accent" />
                      </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-500 block">
                          New Arrivals
                        </span>
                        <span className="text-3xl font-heading font-bold text-emerald-400 block mt-1">{newArrivalsCount}</span>
                      </div>
                      <div className="bg-neutral-900 p-3 rounded-sm border border-neutral-800">
                        <Clock className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-500 block">
                          Sold Vehicles
                        </span>
                        <span className="text-3xl font-heading font-bold text-red-400 block mt-1">{soldCount}</span>
                      </div>
                      <div className="bg-neutral-900 p-3 rounded-sm border border-neutral-800">
                        <CheckCircle className="w-6 h-6 text-red-400" />
                      </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="bg-neutral-950 border border-neutral-800 p-6 rounded-sm flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-heading font-bold tracking-wider text-neutral-500 block">
                          Unread Inquiries
                        </span>
                        <span className="text-3xl font-heading font-bold text-white block mt-1 relative inline-flex items-center">
                          {unreadMessagesCount}
                          {unreadMessagesCount > 0 && (
                            <span className="ml-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                          )}
                        </span>
                      </div>
                      <div className="bg-neutral-900 p-3 rounded-sm border border-neutral-800">
                        <Mail className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                  </div>

                  {/* Recent Inquiries List (Last 5) */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-sm p-6">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
                      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                        Recent Showroom Inquiries
                      </h3>
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="text-[10px] font-heading font-bold uppercase tracking-widest text-accent hover:text-white transition-colors"
                      >
                        Open Inbox →
                      </button>
                    </div>

                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-neutral-500 font-sans text-xs">
                        <Mail className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
                        No inquiries received yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.slice(0, 5).map(msg => (
                          <div
                            key={msg.id}
                            className={`p-4 rounded-sm border transition-colors flex flex-col sm:flex-row sm:items-center justify-between ${
                              msg.is_read ? 'bg-neutral-900/40 border-neutral-800/50' : 'bg-neutral-900 border-neutral-800 border-l-4 border-l-accent'
                            }`}
                          >
                            <div className="space-y-1 max-w-xl">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-white">{msg.buyer_name}</span>
                                <span className="text-[10px] text-neutral-400 font-mono">({msg.buyer_email || 'No Email'})</span>
                              </div>
                              <p className="text-[11px] text-accent font-heading font-semibold uppercase tracking-tight">
                                Re: {msg.car_title || 'Unknown Model'}
                              </p>
                              <p className="text-xs text-neutral-400 leading-relaxed line-clamp-1">{msg.message}</p>
                            </div>

                            <div className="mt-3 sm:mt-0 flex items-center space-x-3 text-right">
                              <span className="text-[10px] text-neutral-500 font-mono block">
                                {new Date(msg.created_at).toLocaleDateString()}
                              </span>
                              <button
                                onClick={() => {
                                  setActiveTab('messages');
                                  setExpandedMessageId(msg.id);
                                }}
                                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-sm transition-colors text-xs"
                                title="Expand Inquiry details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ================= VIEW: MANAGE CARS ================= */}
              {activeTab === 'cars' && (
                <div id="cars-view" className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
                      Showroom Listing Registry
                    </h2>
                    <button
                      onClick={handleOpenAddCar}
                      id="add-car-btn"
                      className="bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-accent shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Listing</span>
                    </button>
                  </div>

                  {cars.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-950 border border-neutral-800 rounded-sm">
                      <CarIcon className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-400">
                        No vehicles listed
                      </h3>
                      <button
                        onClick={handleOpenAddCar}
                        className="mt-4 text-xs font-heading font-bold uppercase text-accent hover:text-white border border-accent hover:bg-accent/10 px-4 py-2 rounded-sm"
                      >
                        Add First Listing
                      </button>
                    </div>
                  ) : (
                    <>
                    <div className="md:hidden space-y-4">
                      {cars.map(car => (
                        <article key={car.id} className="bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden">
                          <div className="flex gap-4 p-4">
                            <div className="w-28 aspect-video bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800 shrink-0">
                              <img
                                src={car.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=200'}
                                alt={car.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h3 className="font-heading font-bold text-white text-sm leading-snug">{car.title}</h3>
                                  <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                                    {car.year} • {car.make}
                                  </p>
                                </div>
                                <span
                                  className={`text-[8px] uppercase font-heading font-bold tracking-wider px-2 py-1 rounded-sm shrink-0 ${
                                    car.condition === 'new_arrival'
                                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50'
                                      : car.condition === 'sold'
                                      ? 'bg-red-950 text-red-400 border border-red-900/50'
                                      : 'bg-blue-950 text-blue-400 border border-blue-900/50'
                                  }`}
                                >
                                  {car.condition === 'new_arrival' ? 'New' : car.condition === 'sold' ? 'Sold' : 'Available'}
                                </span>
                              </div>
                              <p className="font-heading font-bold text-accent mt-2">
                                {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(car.price)}
                              </p>
                              <p className="text-[10px] text-neutral-500 mt-1 break-words">
                                {car.location || 'Location on request'} • {new Intl.NumberFormat('en-CA').format(car.mileage)} km
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 border-t border-neutral-800">
                            <button
                              onClick={() => handleOpenEditCar(car)}
                              className="py-3 text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-300 hover:text-accent hover:bg-neutral-900 flex items-center justify-center gap-1.5"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleQuickMarkAsSold(car.id)}
                              disabled={car.condition === 'sold'}
                              className="py-3 text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-300 hover:text-emerald-400 hover:bg-neutral-900 disabled:text-neutral-700 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 border-x border-neutral-800"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Sold
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car.id, car.title)}
                              className="py-3 text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-300 hover:text-red-400 hover:bg-neutral-900 flex items-center justify-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="hidden md:block bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden">
                      {/* Responsive Scroll Table container */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead>
                            <tr className="border-b border-neutral-800 text-[10px] uppercase font-heading font-bold tracking-widest text-neutral-400 bg-neutral-950">
                              <th className="py-4 px-6 w-20">Media</th>
                              <th className="py-4 px-6">Model Details</th>
                              <th className="py-4 px-6">Price</th>
                              <th className="py-4 px-6">Mileage</th>
                              <th className="py-4 px-6">Status</th>
                              <th className="py-4 px-6 text-right">Showroom Operations</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800 text-xs text-neutral-300">
                            {cars.map(car => (
                              <tr key={car.id} className="hover:bg-neutral-900/60 transition-colors">
                                <td className="py-4 px-6">
                                  <div className="w-16 aspect-video bg-neutral-900 rounded-sm overflow-hidden border border-neutral-800">
                                    <img
                                      src={car.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=200'}
                                      alt={car.title}
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="font-heading font-bold text-white text-sm">{car.title}</div>
                                  <div className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                                    {car.year} • {car.make} • {car.location || 'Location on request'}
                                  </div>
                                </td>
                                <td className="py-4 px-6 font-heading font-bold text-accent">
                                  {new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(car.price)}
                                </td>
                                <td className="py-4 px-6 font-mono text-neutral-400">
                                  {new Intl.NumberFormat('en-CA').format(car.mileage)} km
                                </td>
                                <td className="py-4 px-6">
                                  <span
                                    className={`text-[9px] uppercase font-heading font-bold tracking-widest px-2 py-0.5 rounded-sm ${
                                      car.condition === 'new_arrival'
                                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50'
                                        : car.condition === 'sold'
                                        ? 'bg-red-950 text-red-400 border border-red-900/50'
                                        : 'bg-blue-950 text-blue-400 border border-blue-900/50'
                                    }`}
                                  >
                                    {car.condition === 'new_arrival' ? 'New Arrival' : car.condition === 'sold' ? 'Sold' : 'Available'}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    {car.condition !== 'sold' && (
                                      <button
                                        onClick={() => handleQuickMarkAsSold(car.id)}
                                        className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-red-400 rounded-sm transition-colors cursor-pointer"
                                        title="Quick Mark as Sold"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleOpenEditCar(car)}
                                      className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-accent rounded-sm transition-colors cursor-pointer"
                                      title="Edit Registry"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() => handleDeleteCar(car.id, car.title)}
                                      className="p-2 bg-neutral-900 hover:bg-red-950/60 border border-neutral-800 hover:border-red-900/60 text-neutral-400 hover:text-red-400 rounded-sm transition-colors cursor-pointer"
                                      title="Delete Registry"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    </>
                  )}
                </div>
              )}

              {/* ================= VIEW: MESSAGES INBOX ================= */}
              {activeTab === 'messages' && (
                <div id="messages-view" className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
                        Showroom Message Inbox
                      </h2>
                      <button
                        onClick={handleGenerateMockInquiries}
                        disabled={isGeneratingMock}
                        className="w-fit bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-accent text-accent font-heading font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-sm transition-all cursor-pointer flex items-center space-x-1"
                      >
                        <span>{isGeneratingMock ? 'Generating...' : '+ Generate Sample Inquiries'}</span>
                      </button>
                    </div>

                    {/* Filter controls */}
                    <div className="grid grid-cols-3 bg-neutral-950 p-1 rounded-sm border border-neutral-800 w-full sm:w-auto shrink-0">
                      <button
                        onClick={() => setMessageFilter('all')}
                        className={`px-4 py-1.5 text-[10px] uppercase tracking-wider font-heading font-bold rounded-sm transition-all ${
                          messageFilter === 'all' ? 'bg-accent text-neutral-950' : 'text-neutral-400'
                        }`}
                      >
                        All ({messages.length})
                      </button>
                      <button
                        onClick={() => setMessageFilter('unread')}
                        className={`px-4 py-1.5 text-[10px] uppercase tracking-wider font-heading font-bold rounded-sm transition-all ${
                          messageFilter === 'unread' ? 'bg-accent text-neutral-950' : 'text-neutral-400'
                        }`}
                      >
                        Unread ({messages.filter(m => !m.is_read).length})
                      </button>
                      <button
                        onClick={() => setMessageFilter('read')}
                        className={`px-4 py-1.5 text-[10px] uppercase tracking-wider font-heading font-bold rounded-sm transition-all ${
                          messageFilter === 'read' ? 'bg-accent text-neutral-950' : 'text-neutral-400'
                        }`}
                      >
                        Read ({messages.filter(m => m.is_read).length})
                      </button>
                    </div>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-950 border border-neutral-800 rounded-sm space-y-4">
                      <Mail className="w-12 h-12 text-neutral-800 mx-auto" />
                      <div className="space-y-1">
                        <p className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-400">
                          No inquiries received yet
                        </p>
                        <p className="text-xs text-neutral-600 font-sans">
                          Generate sample inquiries to review the inbox and reply workflow.
                        </p>
                      </div>
                      <button
                        onClick={handleGenerateMockInquiries}
                        disabled={isGeneratingMock}
                        className="bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-sm transition-all cursor-pointer inline-flex items-center space-x-2"
                      >
                        <span>{isGeneratingMock ? 'Generating Sample Inquiries...' : 'Generate Sample Inquiries'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages
                        .filter(m => {
                          if (messageFilter === 'unread') return !m.is_read;
                          if (messageFilter === 'read') return m.is_read;
                          return true;
                        })
                        .map(msg => (
                          <div
                            key={msg.id}
                            className={`border rounded-sm transition-all overflow-hidden ${
                              msg.is_read
                                ? 'bg-neutral-950 border-neutral-800/80 opacity-75'
                                : 'bg-neutral-950 border-accent/30 shadow-lg border-l-4 border-l-accent'
                            }`}
                          >
                            {/* Summary row */}
                            <div
                              onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-900/40"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center space-x-2">
                                  <span className="font-bold text-white text-sm">{msg.buyer_name}</span>
                                  {!msg.is_read && (
                                    <span className="bg-accent text-neutral-950 font-heading font-bold text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
                                      NEW
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-accent font-heading font-semibold uppercase tracking-tight flex items-center">
                                  <CarIcon className="w-3.5 h-3.5 mr-1.5" />
                                  Re: {msg.car_title || 'Unknown Model'}
                                </div>
                                <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl line-clamp-1 font-sans">
                                  {msg.message}
                                </p>
                              </div>

                              <div className="flex items-center space-x-3 justify-end text-right">
                                <div className="text-neutral-500 text-[10px] font-mono">
                                  {new Date(msg.created_at).toLocaleDateString()}
                                  <span className="block mt-0.5">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div>
                                  {expandedMessageId === msg.id ? (
                                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Expanded Message Content Panel */}
                            {expandedMessageId === msg.id && (
                              <div className="px-5 pb-5 pt-3 border-t border-neutral-900 bg-neutral-950/60 space-y-4 animate-fade-in">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans border-b border-neutral-900 pb-4">
                                  <div>
                                    <span className="text-[10px] uppercase font-heading font-bold text-neutral-500 block mb-1">
                                      Email Address
                                    </span>
                                    {msg.buyer_email ? (
                                      <a href={`mailto:${msg.buyer_email}`} className="text-accent font-bold hover:underline">
                                        {msg.buyer_email}
                                      </a>
                                    ) : (
                                      <span className="text-neutral-500">Not provided</span>
                                    )}
                                  </div>
                                  <div>
                                    <span className="text-[10px] uppercase font-heading font-bold text-neutral-500 block mb-1">
                                      Phone Number
                                    </span>
                                    {msg.buyer_phone ? (
                                      <a href={`tel:${msg.buyer_phone}`} className="text-neutral-300 font-mono hover:text-accent font-bold">
                                        {msg.buyer_phone}
                                      </a>
                                    ) : (
                                      <span className="text-neutral-500">Not provided</span>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-1.5">
                                  <span className="text-[10px] uppercase font-heading font-bold text-neutral-500 block">
                                    Message Details
                                  </span>
                                  <p className="text-xs text-neutral-300 leading-relaxed font-sans whitespace-pre-line bg-neutral-900 p-4 rounded-sm border border-neutral-800">
                                    {msg.message}
                                  </p>
                                </div>

                                {/* Replies History */}
                                {msg.replies && msg.replies.length > 0 && (
                                  <div className="space-y-3 pt-3 border-t border-neutral-900">
                                    <span className="text-[10px] uppercase font-heading font-bold text-neutral-500 block">
                                      Reply History
                                    </span>
                                    <div className="space-y-2">
                                      {msg.replies.map((rep) => (
                                        <div key={rep.id} className="bg-neutral-900/40 border border-neutral-800/80 p-3 rounded-sm space-y-1.5">
                                          <div className="flex items-center justify-between text-[10px]">
                                            <span className="font-heading font-bold text-accent">
                                              {rep.sender_name} <span className="text-neutral-500 font-normal">({rep.sender_email})</span>
                                            </span>
                                            <span className="text-neutral-500 font-mono">
                                              {new Date(rep.created_at).toLocaleString()}
                                            </span>
                                          </div>
                                          <p className="text-xs text-neutral-300 whitespace-pre-line font-sans">{rep.message}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Reply Input Area */}
                                <div className="space-y-2 pt-3 border-t border-neutral-900">
                                  <span className="text-[10px] uppercase font-heading font-bold text-neutral-500 block">
                                    Send Message Reply
                                  </span>
                                  <div className="space-y-3">
                                    <textarea
                                      value={replyTexts[msg.id] || ''}
                                      onChange={(e) => setReplyTexts(prev => ({ ...prev, [msg.id]: e.target.value }))}
                                      placeholder="Write your professional reply here... (Sends reply and logs who responded)"
                                      rows={3}
                                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm p-3 text-xs font-sans text-neutral-200 outline-none transition-colors resize-none"
                                    />
                                    <div className="flex justify-end">
                                      <button
                                        onClick={() => handleSendReply(msg.id)}
                                        disabled={isSendingReply[msg.id]}
                                        className="bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors cursor-pointer flex items-center space-x-2"
                                      >
                                        <span>{isSendingReply[msg.id] ? 'Sending Reply...' : 'Send Reply'}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                                  <button
                                    onClick={() => handleToggleReadMessage(msg.id, msg.is_read)}
                                    className="text-xs font-heading font-bold uppercase tracking-wider border border-neutral-800 hover:border-accent text-neutral-400 hover:text-accent px-4 py-2 rounded-sm transition-colors cursor-pointer"
                                  >
                                    Mark as {msg.is_read ? 'Unread' : 'Read'}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="text-xs font-heading font-bold uppercase tracking-wider text-neutral-500 hover:text-red-400 flex items-center space-x-1.5 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Message</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ================= VIEW: USER / SUB-ADMIN MANAGEMENT ================= */}
              {activeTab === 'users' && user?.role === 'super_admin' && (
                <div id="users-view" className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
                      Administrative Registry (Sub-Admins)
                    </h2>
                    <button
                      onClick={() => setIsInviteModalOpen(true)}
                      id="invite-admin-btn"
                      className="bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-accent shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Invite Sub-Admin</span>
                    </button>
                  </div>

                  <div className="md:hidden space-y-4">
                    {profiles.map(prof => (
                      <article key={prof.id} className="bg-neutral-950 border border-neutral-800 rounded-sm p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-heading font-bold text-white text-sm">{prof.full_name}</h3>
                            <p className="font-mono text-xs text-neutral-400 mt-1 break-all">{prof.email}</p>
                          </div>
                          <span
                            className={`text-[8px] uppercase font-heading font-bold tracking-wider px-2 py-1 rounded-sm border shrink-0 ${
                              prof.role === 'super_admin'
                                ? 'bg-purple-950/50 text-purple-400 border-purple-900/50'
                                : 'bg-blue-950/50 text-blue-400 border-blue-900/50'
                            }`}
                          >
                            {prof.role === 'super_admin' ? 'Super Admin' : 'Sub Admin'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800">
                          <p className="text-[10px] text-neutral-500 font-mono">
                            Added {new Date(prof.created_at).toLocaleDateString()}
                          </p>
                          {prof.email !== 'helpooclassmate@gmail.com' ? (
                            <button
                              onClick={() => handleRemoveProfile(prof.id, prof.full_name)}
                              className="text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-400 hover:text-red-400 flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Revoke Access
                            </button>
                          ) : (
                            <span className="text-[9px] uppercase font-heading font-bold text-neutral-600 tracking-wider">
                              Primary Admin
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="hidden md:block bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-800 text-[10px] uppercase font-heading font-bold tracking-widest text-neutral-400 bg-neutral-950">
                          <th className="py-4 px-6">Name</th>
                          <th className="py-4 px-6">Email Address</th>
                          <th className="py-4 px-6">Access Role</th>
                          <th className="py-4 px-6">Credentials</th>
                          <th className="py-4 px-6">Registered On</th>
                          <th className="py-4 px-6 text-right">Operations</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800 text-xs text-neutral-300">
                        {profiles.map(prof => (
                          <tr key={prof.id} className="hover:bg-neutral-900/40 transition-colors">
                            <td className="py-4 px-6 font-heading font-bold text-white">{prof.full_name}</td>
                            <td className="py-4 px-6 font-mono text-neutral-400">{prof.email}</td>
                            <td className="py-4 px-6">
                              <span
                                className={`text-[9px] uppercase font-heading font-bold tracking-widest px-2 py-0.5 rounded-sm border ${
                                  prof.role === 'super_admin'
                                    ? 'bg-purple-950/50 text-purple-400 border-purple-900/50'
                                    : 'bg-blue-950/50 text-blue-400 border-blue-900/50'
                                }`}
                              >
                                {prof.role === 'super_admin' ? 'Super Admin' : 'Sub Admin'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-xs text-neutral-500">
                              Password configured
                            </td>
                            <td className="py-4 px-6 text-neutral-500 font-mono">
                              {new Date(prof.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-6 text-right">
                              {prof.email !== 'helpooclassmate@gmail.com' ? (
                                <button
                                  onClick={() => handleRemoveProfile(prof.id, prof.full_name)}
                                  className="p-2 bg-neutral-900 hover:bg-red-950/60 border border-neutral-800 hover:border-red-900/60 text-neutral-400 hover:text-red-400 rounded-sm transition-colors cursor-pointer"
                                  title="Revoke Admin Access"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              ) : (
                                <span className="text-[10px] uppercase font-heading font-bold text-neutral-600 tracking-wider">
                                  System Root
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <AdminSettings />
              )}
            </>
          )}
        </main>
      </div>

      {/* ================= MODAL: CAR FORM (ADD/EDIT) ================= */}
      {isCarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-neutral-900 text-neutral-100 w-full max-w-3xl min-h-full sm:min-h-0 sm:rounded-sm overflow-hidden shadow-2xl relative border border-neutral-800 sm:my-8">
            <div className="bg-neutral-950 p-4 sm:p-6 border-b border-neutral-800 flex justify-between items-center gap-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                {editingCar ? 'Modify Showroom Registry' : 'New Showroom Registry Listing'}
              </h3>
              <button
                onClick={() => setIsCarModalOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCarSubmit(onCarFormSubmit)} className="p-4 sm:p-6 space-y-6 sm:max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Listing Title *
                  </label>
                  <input
                    type="text"
                    {...carRegister('title', { required: true })}
                    placeholder="e.g. 1967 Chevrolet Corvette Stingray"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors"
                  />
                </div>

                {/* Make */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Manufacturer Make *
                  </label>
                  <input
                    type="text"
                    {...carRegister('make', { required: true })}
                    placeholder="e.g. Chevrolet"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Model Variant *
                  </label>
                  <input
                    type="text"
                    {...carRegister('model', { required: true })}
                    placeholder="e.g. Corvette Stingray"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Year of Production *
                  </label>
                  <input
                    type="number"
                    {...carRegister('year', { required: true })}
                    placeholder="e.g. 1967"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors font-mono"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    {...carRegister('price', { required: true })}
                    placeholder="e.g. 129000"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors font-mono"
                  />
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Odometer Mileage (km) *
                  </label>
                  <input
                    type="number"
                    {...carRegister('mileage', { required: true })}
                    placeholder="e.g. 45000"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors font-mono"
                  />
                </div>

                {/* Condition dropdown */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Listing Status *
                  </label>
                  <select
                    {...carRegister('condition', { required: true })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors cursor-pointer"
                  >
                    <option value="available">Available (Showroom Standard)</option>
                    <option value="new_arrival">New Arrival (Featured)</option>
                    <option value="sold">Sold (Archived)</option>
                  </select>
                </div>

                {/* Vehicle Type dropdown */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    {...carRegister('type', { required: true })}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors cursor-pointer font-sans"
                  >
                    <option value="classic">Classic Icon</option>
                    <option value="project">Restoration Project</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Vehicle Location
                  </label>
                  <input
                    type="text"
                    {...carRegister('location')}
                    placeholder="e.g. City, Country"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors"
                  />
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    {...carRegister('contact_phone')}
                    placeholder="Include country code"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Vehicle Description
                  </label>
                  <textarea
                    rows={4}
                    {...carRegister('description')}
                    placeholder="Include condition, restoration history, specifications, documentation, and known issues..."
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors resize-none"
                  />
                </div>

                {/* Drag and Drop Image Upload Section */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                    Vehicle Images (1600 × 900, 16:9)
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('media-upload-input')?.click()}
                    className={`border-2 border-dashed rounded-sm p-6 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-accent bg-neutral-800/80 text-white'
                        : 'border-neutral-800 hover:border-accent hover:bg-neutral-850/40 text-neutral-400'
                    }`}
                  >
                    <input
                      type="file"
                      id="media-upload-input"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 mx-auto mb-3 text-accent" />
                    <p className="text-xs font-heading font-bold uppercase tracking-wide text-neutral-200">
                      Drop images here or click to choose files
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1">
                      Images are automatically cropped and optimized to 1600 × 900 WebP. The first image becomes the listing cover.
                    </p>
                  </div>

                  {/* Uploading loading spinner */}
                  {isUploading && (
                    <div className="flex items-center justify-center space-x-2 text-xs text-accent mt-3">
                      <RefreshCwIcon className="w-4 h-4 animate-spin" />
                      <span>Uploading media files...</span>
                    </div>
                  )}

                  {/* Uploaded Previews List */}
                  {uploadedImageUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                      {uploadedImageUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-video bg-neutral-950 rounded-sm overflow-hidden border border-neutral-800 group">
                          <img src={url} alt={`Media Preview ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(idx);
                            }}
                            className="absolute top-1 right-1 bg-neutral-950/80 hover:bg-red-600 text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit panel */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCarModalOpen(false)}
                  className="px-5 py-2.5 text-neutral-400 hover:text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer border border-accent"
                >
                  {editingCar ? 'Save Registry Modifications' : 'Publish Showroom Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SUB-ADMIN INVITE ================= */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-neutral-900 text-neutral-100 w-full max-w-md min-h-full sm:min-h-0 sm:rounded-sm overflow-hidden shadow-2xl relative border border-neutral-800">
            <div className="bg-neutral-950 p-4 sm:p-6 border-b border-neutral-800 flex justify-between items-center gap-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                Invite Sub-Administrator Access
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit(onInviteFormSubmit)} className="p-4 sm:p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                  Staff Full Name *
                </label>
                <input
                  type="text"
                  required
                  {...inviteRegister('full_name')}
                  placeholder="e.g. David Smith"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                  Staff Email Address *
                </label>
                <input
                  type="email"
                  required
                  {...inviteRegister('email')}
                  placeholder="e.g. dsmith@ksaclassic.com"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors"
                />
              </div>

              {/* Passcode / Password */}
              <div>
                <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                  Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  {...inviteRegister('passcode', { required: true })}
                  placeholder="Create a temporary password"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs font-sans outline-none transition-colors"
                />
              </div>

              {/* Access note */}
              <div className="bg-neutral-950 border border-accent/20 rounded-sm p-4 text-[11px] text-neutral-400 leading-relaxed font-sans">
                <span className="font-bold text-neutral-200 block mb-1">Before granting access</span>
                Share the temporary password with the staff member through a secure channel and ask them to change it after their first sign-in.
              </div>

              {/* Action buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-sm transition-colors cursor-pointer border border-accent"
                >
                  Grant Sub-Admin Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal icon proxy helper
const RefreshCwIcon = ({ className, ...props }: any) => <RefreshCw className={className} {...props} />;
