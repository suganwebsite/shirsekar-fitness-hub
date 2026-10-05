'use client';

import {
  BarChart3,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  ExternalLink,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Settings as SettingsIcon,
  Shield,
  Star,
  Users,
  X
} from 'lucide-react';
import React, { useState } from 'react';
import { AdminUser, BusinessSettings } from '../../types';

export type AdminTab =
  | 'dashboard'
  | 'leads'
  | 'trials'
  | 'memberships'
  | 'programs'
  | 'facilities'
  | 'gallery'
  | 'testimonials'
  | 'faqs'
  | 'messages'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  user: AdminUser;
  settings: BusinessSettings;
  onLogout: () => void;
  onViewWebsite: () => void;
  newLeadsCount: number;
  unreadMessagesCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  user,
  settings,
  onLogout,
  onViewWebsite,
  newLeadsCount,
  unreadMessagesCount,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: BarChart3 },
    {
      id: 'leads' as AdminTab,
      label: 'All Leads',
      icon: Users,
      badge: newLeadsCount > 0 ? `${newLeadsCount} new` : undefined,
    },
    {
      id: 'trials' as AdminTab,
      label: 'Trial Bookings',
      icon: CalendarCheck,
    },
    { id: 'memberships' as AdminTab, label: 'Memberships', icon: CreditCard },
    { id: 'programs' as AdminTab, label: 'Training Programs', icon: Dumbbell },
    { id: 'facilities' as AdminTab, label: 'Facilities', icon: Layers },
    { id: 'gallery' as AdminTab, label: 'Gallery', icon: ImageIcon },
    { id: 'testimonials' as AdminTab, label: 'Testimonials / Reviews', icon: Star },
    { id: 'faqs' as AdminTab, label: 'FAQs', icon: HelpCircle },
    {
      id: 'messages' as AdminTab,
      label: 'Messages',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? `${unreadMessagesCount}` : undefined,
    },
    { id: 'settings' as AdminTab, label: 'Business Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-amber-400" />
          <span className="font-heading text-sm font-bold uppercase text-white">
            SFH Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onViewWebsite}
            className="p-2 text-xs text-neutral-400 hover:text-white"
            title="View Public Site"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-neutral-300 hover:text-white rounded-lg bg-neutral-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-neutral-900/90 border-r border-neutral-800/80 flex flex-col shrink-0 z-30`}
      >
        {/* Brand Lockup */}
        <div className="p-5 border-b border-neutral-800 hidden md:flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-heading text-sm font-bold uppercase text-white truncate">
              {settings.businessName}
            </h2>
            <p className="text-[10px] text-amber-400 truncate">
              Bandra East Admin Console
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-neutral-950 text-amber-400'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-xs text-amber-400 font-bold shrink-0">
                A
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-neutral-500 block truncate">
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onViewWebsite}
            className="w-full py-2 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Public Website</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-neutral-950 overflow-y-auto">
        {/* Top Breadcrumb Bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-neutral-800/80 bg-neutral-900/40">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-white font-semibold capitalize">
              {currentTab.replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-neutral-400">
              Hours: <strong className="text-neutral-200">{settings.currentStatusNote}</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-neutral-400">
              Phone: <strong className="text-neutral-200">{settings.phone}</strong>
            </span>
          </div>
        </div>

        {/* Viewport Canvas */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
