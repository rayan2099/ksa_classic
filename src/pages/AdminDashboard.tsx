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
  ArrowLeft,
  Send,
  Inbox
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
  const [messageSearch, setMessageSearch] = useState('');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [isSendingReply, setIsSendingReply] = useState<Record<string, boolean>>({});
  const [isGeneratingMock, setIsGeneratingMock] = useState(false);

  // Sub-admin Invite States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  // Drag and Drop State for Uploads
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { register: carRegister, handleSubmit: handleCarSubmit, reset: resetCarForm, setValue: setCarValue, watch: watchCarForm } = useForm();
  const { register: inviteRegister, handleSubmit: handleInviteSubmit, reset: resetInviteForm } = useForm();
  const { register: editProfileRegister, handleSubmit: handleEditProfileSubmit, reset: resetEditProfileForm } = useForm();

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
  const filteredMessages = messages.filter((message) => {
    if (messageFilter === 'unread' && message.is_read) return false;
    if (messageFilter === 'read' && !message.is_read) return false;

    const query = messageSearch.trim().toLowerCase();
    if (!query) return true;

    return [
      message.buyer_name,
      message.buyer_email,
      message.buyer_phone,
      message.car_title,
      message.message
    ].some((value) => value?.toLowerCase().includes(query));
  });

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

  const optimizeVehicleImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error(`${file.name} is not a supported image file.`);
    }

    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const targetWidth = 1600;
    const targetHeight = 900;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      bitmap.close();
      throw new Error('This browser could not prepare the selected image.');
    }

    const scale = Math.max(targetWidth / bitmap.width, targetHeight / bitmap.height);
    const sourceWidth = targetWidth / scale;
    const sourceHeight = targetHeight / scale;
    const sourceX = (bitmap.width - sourceWidth) / 2;
    const sourceY = (bitmap.height - sourceHeight) / 2;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(
      bitmap,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );
    bitmap.close();

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        result => result ? resolve(result) : reject(new Error('Could not optimize the selected image.')),
        'image/webp',
        0.86
      );
    });

    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', {
      type: 'image/webp'
    });
  };

  // Image Upload Logic (supports both click and drag & drop)
  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const selectedFiles = Array.from(files);
      let updatedUrls = [...uploadedImageUrls];

      for (const file of selectedFiles) {
        const optimizedFile = await optimizeVehicleImage(file);
        const formData = new FormData();
        formData.append('files', optimizedFile);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) {
          const error = await res.json().catch(() => null);
          throw new Error(error?.error || 'Failed to upload image assets.');
        }

        const result = await res.json();
        updatedUrls = [...updatedUrls, ...result.urls];
        setUploadedImageUrls(updatedUrls);
        setCarValue('images', updatedUrls);
      }

      toast.success(`${selectedFiles.length} image(s) uploaded successfully.`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image assets.');
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
        if (updatedMsg.email_warning) {
          toast.error('Reply saved, but the email could not be delivered.');
        } else {
          toast.success('Reply emailed and saved successfully.');
        }
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

  const handleOpenEditProfile = (profile: Profile) => {
    setEditingProfile(profile);
    resetEditProfileForm({
      full_name: profile.full_name,
      email: profile.email,
      passcode: ''
    });
  };

  const onEditProfileSubmit = async (data: any) => {
    if (!editingProfile) return;

    try {
      const res = await fetch(`/api/profiles/${editingProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update administrator.');
      }

      const updatedProfile = await res.json();
      setProfiles(prev => prev.map(profile => profile.id === updatedProfile.id ? updatedProfile : profile));
      setEditingProfile(null);
      toast.success('Administrator updated.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update administrator.');
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
          <div className="p-6 border-b border-neutral-800">
            {isSidebarOpen ? (
              <div className="min-w-0">
                <span className="font-heading font-bold text-lg uppercase text-accent tracking-widest">ADMIN</span>
                <div className="mt-3 border-l-2 border-accent/60 pl-3">
                  <span className="block text-[10px] uppercase tracking-wider text-neutral-500">Welcome</span>
                  <span className="block mt-0.5 text-sm font-bold text-white truncate">{user.full_name}</span>
                  <span className="block mt-1 text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-400">
                    {user.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
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
                    : dbStatus.status === 'local_fallback'
                      ? 'bg-amber-900/45 text-amber-300 border border-amber-800/60'
                      : 'bg-red-950/60 text-red-300 border border-red-900'
                }`}
                title={dbStatus.message}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  dbStatus.status === 'supabase'
                    ? 'bg-emerald-400'
                    : dbStatus.status === 'local_fallback'
                      ? 'bg-amber-400 animate-pulse'
                      : 'bg-red-400'
                }`}></span>
                <span className="hidden sm:inline">
                  {dbStatus.status === 'supabase'
                    ? 'Supabase Connected'
                    : dbStatus.status === 'local_fallback'
                      ? 'Local Fallback'
                      : 'Backend Offline'}
                </span>
                <span className="sm:hidden">
                  {dbStatus.status === 'supabase'
                    ? 'Cloud'
                    : dbStatus.status === 'local_fallback'
                      ? 'Local'
                      : 'Offline'}
                </span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
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
                          New Inquiries
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
                <div id="messages-view" className="space-y-5 animate-fade-in">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 border-b border-neutral-800 pb-5">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <Inbox className="w-5 h-5 text-accent" />
                        <h2 className="font-heading text-lg font-bold uppercase tracking-wider text-white">
                          Showroom Inbox
                        </h2>
                      </div>
                      <p className="mt-2 text-xs text-neutral-500">
                        {messages.length} {messages.length === 1 ? 'inquiry' : 'inquiries'}
                        <span className="mx-2 text-neutral-700">•</span>
                        <span className={unreadMessagesCount > 0 ? 'text-accent font-bold' : ''}>
                          {unreadMessagesCount} new
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={handleGenerateMockInquiries}
                      disabled={isGeneratingMock}
                      className="w-full lg:w-auto bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-accent text-neutral-300 hover:text-accent font-heading font-bold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isGeneratingMock ? 'Generating...' : 'Generate Sample Inquiries'}</span>
                    </button>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                    <div className="relative w-full lg:max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                      <input
                        type="search"
                        value={messageSearch}
                        onChange={(event) => setMessageSearch(event.target.value)}
                        placeholder="Search name, email, vehicle or message"
                        aria-label="Search inquiries"
                        className="w-full h-10 bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm pl-10 pr-3 text-xs text-neutral-200 placeholder:text-neutral-600 outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-3 bg-neutral-950 p-1 rounded-sm border border-neutral-800 w-full lg:w-auto shrink-0">
                      {([
                        ['all', `All ${messages.length}`],
                        ['unread', `New ${unreadMessagesCount}`],
                        ['read', `Read ${messages.length - unreadMessagesCount}`]
                      ] as const).map(([filter, label]) => (
                        <button
                          key={filter}
                          onClick={() => setMessageFilter(filter)}
                          className={`min-h-8 px-3 sm:px-4 text-[10px] uppercase tracking-wider font-heading font-bold rounded-sm transition-colors ${
                            messageFilter === filter
                              ? 'bg-accent text-neutral-950'
                              : 'text-neutral-500 hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {messages.length === 0 ? (
                    <div className="text-center py-20 border-y border-neutral-800 space-y-4">
                      <Mail className="w-10 h-10 text-neutral-700 mx-auto" />
                      <div className="space-y-1">
                        <p className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-300">
                          Inbox is clear
                        </p>
                        <p className="text-xs text-neutral-600">New showroom inquiries will appear here.</p>
                      </div>
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-16 border-y border-neutral-800">
                      <Search className="w-8 h-8 text-neutral-700 mx-auto mb-3" />
                      <p className="font-heading text-xs font-bold uppercase tracking-wider text-neutral-400">
                        No matching inquiries
                      </p>
                      <button
                        onClick={() => {
                          setMessageSearch('');
                          setMessageFilter('all');
                        }}
                        className="mt-3 text-[10px] uppercase font-heading font-bold tracking-wider text-accent hover:text-white"
                      >
                        Clear search and filters
                      </button>
                    </div>
                  ) : (
                    <div className="border border-neutral-800 bg-neutral-950 rounded-sm overflow-hidden divide-y divide-neutral-800">
                      {filteredMessages.map(msg => {
                        const initials = msg.buyer_name
                          .split(/\s+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map(part => part[0])
                          .join('')
                          .toUpperCase();

                        return (
                          <div
                            key={msg.id}
                            className={`transition-colors ${
                              expandedMessageId === msg.id
                                ? 'bg-neutral-900/50'
                                : msg.is_read
                                  ? 'bg-neutral-950 hover:bg-neutral-900/35'
                                  : 'bg-accent/[0.035] hover:bg-accent/[0.06]'
                            }`}
                          >
                            <button
                              onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                              className="w-full p-4 sm:p-5 grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 sm:gap-4 text-left"
                              aria-expanded={expandedMessageId === msg.id}
                            >
                              <span
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[11px] font-heading font-bold border ${
                                  msg.is_read
                                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                                    : 'bg-accent text-neutral-950 border-accent'
                                }`}
                              >
                                {initials || '?'}
                              </span>

                              <span className="min-w-0">
                                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                  <span className={`text-sm ${msg.is_read ? 'font-semibold text-neutral-300' : 'font-bold text-white'}`}>
                                    {msg.buyer_name}
                                  </span>
                                </span>
                                <span className="mt-1 flex items-center text-[10px] text-accent font-heading font-bold uppercase tracking-wider truncate">
                                  <CarIcon className="w-3 h-3 mr-1.5 shrink-0" />
                                  {msg.car_title || 'General showroom inquiry'}
                                </span>
                                <span className="mt-2 block text-xs text-neutral-500 leading-relaxed line-clamp-2 sm:line-clamp-1">
                                  {msg.message}
                                </span>
                              </span>

                              <span className="flex items-center justify-end gap-2 sm:gap-3 text-right">
                                {!msg.is_read && (
                                  <span className="bg-accent text-neutral-950 font-heading font-bold text-[8px] uppercase tracking-widest px-2 py-1 rounded-sm">
                                    New
                                  </span>
                                )}
                                <span className="hidden sm:block text-neutral-600 text-[10px] font-mono whitespace-nowrap">
                                  {new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                  <span className="block mt-0.5">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </span>
                                {expandedMessageId === msg.id ? (
                                  <ChevronUp className="w-4 h-4 text-accent" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-neutral-600" />
                                )}
                              </span>
                            </button>

                            {expandedMessageId === msg.id && (
                              <div className="px-4 sm:px-5 pb-5 border-t border-neutral-800 animate-fade-in">
                                <div className="py-4 flex flex-wrap items-center gap-2 border-b border-neutral-800">
                                  {msg.buyer_email && (
                                    <a
                                      href={`mailto:${msg.buyer_email}`}
                                      className="min-h-9 px-3 bg-neutral-950 border border-neutral-800 hover:border-accent rounded-sm text-xs text-neutral-300 hover:text-accent inline-flex items-center gap-2 transition-colors"
                                    >
                                      <Mail className="w-3.5 h-3.5" />
                                      {msg.buyer_email}
                                    </a>
                                  )}
                                  {msg.buyer_phone && (
                                    <a
                                      href={`tel:${msg.buyer_phone}`}
                                      className="min-h-9 px-3 bg-neutral-950 border border-neutral-800 hover:border-accent rounded-sm text-xs text-neutral-300 hover:text-accent inline-flex items-center gap-2 transition-colors"
                                    >
                                      <Phone className="w-3.5 h-3.5" />
                                      {msg.buyer_phone}
                                    </a>
                                  )}
                                  <span className="sm:ml-auto text-[10px] text-neutral-600 font-mono">
                                    Received {new Date(msg.created_at).toLocaleString()}
                                  </span>
                                  {msg.buyer_email && msg.confirmation_email_status && (
                                    <span
                                      className={`text-[9px] uppercase font-heading font-bold tracking-wider ${
                                        msg.confirmation_email_status === 'sent'
                                          ? 'text-emerald-400'
                                          : msg.confirmation_email_status === 'failed'
                                            ? 'text-red-400'
                                            : 'text-neutral-600'
                                      }`}
                                    >
                                      Confirmation {msg.confirmation_email_status}
                                    </span>
                                  )}
                                </div>

                                <div className="py-5 space-y-5">
                                  <div className="flex items-start gap-3 max-w-3xl">
                                    <span className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center justify-center text-[9px] font-heading font-bold shrink-0">
                                      {initials || '?'}
                                    </span>
                                    <div className="min-w-0">
                                      <div className="flex flex-wrap items-baseline gap-x-2 mb-1.5">
                                        <span className="text-xs font-bold text-white">{msg.buyer_name}</span>
                                        <span className="text-[9px] uppercase tracking-wider text-neutral-600">Customer</span>
                                      </div>
                                      <p className="text-xs text-neutral-300 leading-6 whitespace-pre-line">{msg.message}</p>
                                    </div>
                                  </div>

                                  {msg.replies?.map(rep => (
                                    <div key={rep.id} className="flex items-start justify-end gap-3">
                                      <div className="max-w-3xl min-w-0 text-right">
                                        <div className="flex flex-wrap justify-end items-baseline gap-x-2 mb-1.5">
                                          <span className="text-[9px] text-neutral-600 font-mono">
                                            {new Date(rep.created_at).toLocaleString()}
                                          </span>
                                          <span className="text-xs font-bold text-accent">{rep.sender_name}</span>
                                          {rep.email_status && (
                                            <span
                                              className={`text-[8px] uppercase font-heading font-bold tracking-wider ${
                                                rep.email_status === 'sent'
                                                  ? 'text-emerald-400'
                                                  : rep.email_status === 'failed'
                                                    ? 'text-red-400'
                                                    : 'text-neutral-600'
                                              }`}
                                            >
                                              Email {rep.email_status}
                                            </span>
                                          )}
                                        </div>
                                        <p className="inline-block text-left text-xs text-neutral-200 leading-6 whitespace-pre-line bg-neutral-800 border border-neutral-700 px-4 py-3 rounded-sm">
                                          {rep.message}
                                        </p>
                                      </div>
                                      <span className="w-8 h-8 rounded-full bg-accent text-neutral-950 flex items-center justify-center text-[9px] font-heading font-bold shrink-0">
                                        {rep.sender_name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase()}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                <div className="pt-4 border-t border-neutral-800">
                                  <div className="bg-neutral-950 border border-neutral-800 focus-within:border-accent rounded-sm transition-colors">
                                    <textarea
                                      value={replyTexts[msg.id] || ''}
                                      onChange={(event) => setReplyTexts(prev => ({ ...prev, [msg.id]: event.target.value }))}
                                      placeholder={`Reply to ${msg.buyer_name}...`}
                                      rows={4}
                                      maxLength={2000}
                                      className="w-full bg-transparent p-4 pb-2 text-xs text-neutral-200 placeholder:text-neutral-600 outline-none resize-none"
                                    />
                                    <div className="px-3 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-neutral-800">
                                      <span className="text-[9px] text-neutral-600">
                                        {(replyTexts[msg.id] || '').length}/2000
                                      </span>
                                      <button
                                        onClick={() => handleSendReply(msg.id)}
                                        disabled={isSendingReply[msg.id] || !(replyTexts[msg.id] || '').trim()}
                                        className="w-full sm:w-auto bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                                      >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>{isSendingReply[msg.id] ? 'Sending Reply...' : 'Send Reply'}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-between pt-4">
                                  <button
                                    onClick={() => handleDeleteMessage(msg.id)}
                                    className="min-h-9 text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-600 hover:text-red-400 flex items-center justify-center sm:justify-start gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Inquiry</span>
                                  </button>
                                  <button
                                    onClick={() => handleToggleReadMessage(msg.id, msg.is_read)}
                                    className="min-h-9 text-[10px] font-heading font-bold uppercase tracking-wider border border-neutral-700 hover:border-accent text-neutral-400 hover:text-accent px-4 py-2 rounded-sm transition-colors cursor-pointer"
                                  >
                                    Mark as {msg.is_read ? 'New' : 'Read'}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
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

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {profiles.map(prof => (
                      <article key={prof.id} className="bg-neutral-950 border border-neutral-800 rounded-sm overflow-hidden min-w-0">
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start gap-3">
                            <span className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center shrink-0 text-xs font-heading font-bold text-accent">
                              {prof.full_name
                                .split(/\s+/)
                                .filter(Boolean)
                                .slice(0, 2)
                                .map(part => part[0])
                                .join('')
                                .toUpperCase()}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-heading font-bold text-white text-sm break-words">{prof.full_name}</h3>
                                <span
                                  className={`text-[8px] uppercase font-heading font-bold tracking-wider px-2 py-1 rounded-sm border shrink-0 ${
                                    prof.role === 'super_admin'
                                      ? 'bg-accent/10 text-accent border-accent/30'
                                      : 'bg-blue-950/50 text-blue-400 border-blue-900/50'
                                  }`}
                                >
                                  {prof.role === 'super_admin' ? 'Super Admin' : 'Sub Admin'}
                                </span>
                              </div>
                              <p className="font-mono text-xs text-neutral-400 mt-1 break-all">{prof.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 sm:px-5 py-3 bg-neutral-900/35 border-y border-neutral-800 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-[10px] text-neutral-500 font-mono">
                            Added {new Date(prof.created_at).toLocaleDateString()}
                          </p>
                          <span className="text-[9px] uppercase font-heading font-bold text-neutral-600 tracking-wider">
                            {prof.role === 'super_admin' ? 'Primary Account' : 'Password Configured'}
                          </span>
                        </div>

                        {prof.role !== 'super_admin' ? (
                          <div className="grid grid-cols-2 divide-x divide-neutral-800">
                            <button
                              onClick={() => handleOpenEditProfile(prof)}
                              className="min-h-11 px-3 text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-300 hover:text-accent hover:bg-neutral-900 flex items-center justify-center gap-2 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleRemoveProfile(prof.id, prof.full_name)}
                              className="min-h-11 px-3 text-[10px] font-heading font-bold uppercase tracking-wider text-neutral-400 hover:text-red-400 hover:bg-red-950/20 flex items-center justify-center gap-2 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Revoke Access
                            </button>
                          </div>
                        ) : (
                          <div className="min-h-11 px-4 flex items-center justify-center text-[9px] uppercase font-heading font-bold tracking-wider text-neutral-600">
                            Manage your primary profile in Settings
                          </div>
                        )}
                      </article>
                    ))}
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
                    Vehicle Images (1600 × 900, 16:9, no gallery limit)
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
                      Select as many images as needed. Each file is optimized to 1600 × 900 WebP before upload.
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
                  placeholder="e.g. dsmith@ksaclassics.online"
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

      {/* ================= MODAL: SUB-ADMIN EDIT ================= */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
          <div className="bg-neutral-900 text-neutral-100 w-full max-w-md min-h-full sm:min-h-0 sm:rounded-sm overflow-hidden shadow-2xl relative border border-neutral-800">
            <div className="bg-neutral-950 p-4 sm:p-6 border-b border-neutral-800 flex justify-between items-center gap-4">
              <div>
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                  Edit Administrator
                </h3>
                <p className="text-[10px] text-neutral-500 mt-1">Update account details and access credentials.</p>
              </div>
              <button
                onClick={() => setEditingProfile(null)}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Close edit administrator"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProfileSubmit(onEditProfileSubmit)} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                  Staff Full Name *
                </label>
                <input
                  type="text"
                  required
                  {...editProfileRegister('full_name', { required: true })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                  Staff Email Address *
                </label>
                <input
                  type="email"
                  required
                  {...editProfileRegister('email', { required: true })}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-heading font-bold text-neutral-400 tracking-wider mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  {...editProfileRegister('passcode')}
                  placeholder="Leave blank to keep the current password"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent rounded-sm py-2.5 px-4 text-xs outline-none transition-colors"
                />
                <p className="text-[10px] text-neutral-600 mt-2">
                  Only enter a password when this administrator needs a credential reset.
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2.5 text-neutral-400 hover:text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent-hover text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors border border-accent"
                >
                  Save Administrator
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
