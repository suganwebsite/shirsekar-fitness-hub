'use client';

import {
  Check,
  Download,
  KeyRound,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldCheck
} from 'lucide-react';
import React, { useState } from 'react';
import { exportAllData, resetAllToDefaults, updateAdminPassword } from '../../services/storage';
import { BusinessSettings } from '../../types';

interface AdminSettingsProps {
  settings: BusinessSettings;
  onUpdateSettings: (newSettings: Partial<BusinessSettings>) => void;
  onResetDefaults: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
}) => {
  const [formData, setFormData] = useState<BusinessSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const handleChange = (field: keyof BusinessSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    if (!newPassword.trim()) {
      setPasswordMsg('Please enter a password');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    updateAdminPassword(newPassword);
    setPasswordMsg('Admin password updated successfully!');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(''), 4000);
  };

  const handleExportBackup = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shirsekar_fitness_hub_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetToFactory = () => {
    if (
      confirm(
        'Are you sure you want to reset all data and settings back to default? All custom leads will be reset.'
      )
    ) {
      resetAllToDefaults();
      onResetDefaults();
      alert('Settings and data have been reset to verified business defaults.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase text-white tracking-wide">
            BUSINESS SETTINGS & HOMEPAGE CONTENT
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Update gym contact information, location details, marketing copy, and SEO tags without touching code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download JSON Backup"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Settings saved successfully! Homepage and admin views updated.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section 1: Business Identity & Branding */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="font-heading text-base font-bold uppercase text-white border-b border-neutral-800 pb-3">
            1. BUSINESS IDENTITY & MANAGEMENT
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Business Name (English)
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Localized Name (Marathi / Hindi)
              </label>
              <input
                type="text"
                value={formData.marathiName}
                onChange={(e) => handleChange('marathiName', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Managed By (Brand)
              </label>
              <input
                type="text"
                value={formData.managementBy}
                onChange={(e) => handleChange('managementBy', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Managed By (Marathi)
              </label>
              <input
                type="text"
                value={formData.marathiManagement}
                onChange={(e) => handleChange('marathiManagement', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact, Phone & WhatsApp */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="font-heading text-base font-bold uppercase text-white border-b border-neutral-800 pb-3">
            2. PHONE, WHATSAPP & EMAIL
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Display Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                WhatsApp Number (with 91 country code)
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
              Default WhatsApp Click-to-Chat Prompt
            </label>
            <input
              type="text"
              value={formData.whatsappDefaultMessage}
              onChange={(e) => handleChange('whatsappDefaultMessage', e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Location & Hours */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="font-heading text-base font-bold uppercase text-white border-b border-neutral-800 pb-3">
            3. PHYSICAL LOCATION & TIMINGS
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
              Full Physical Address
            </label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Mon – Sat Timings
              </label>
              <input
                type="text"
                value={formData.timingsWeekday}
                onChange={(e) => handleChange('timingsWeekday', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Sunday Timings
              </label>
              <input
                type="text"
                value={formData.timingsSunday}
                onChange={(e) => handleChange('timingsSunday', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Current Status Note
              </label>
              <input
                type="text"
                value={formData.currentStatusNote}
                onChange={(e) => handleChange('currentStatusNote', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Google Maps Direct Navigation URL
              </label>
              <input
                type="text"
                value={formData.googleMapsDirectUrl}
                onChange={(e) => handleChange('googleMapsDirectUrl', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Google Reviews Direct URL
              </label>
              <input
                type="text"
                value={formData.googleReviewsUrl}
                onChange={(e) => handleChange('googleReviewsUrl', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Homepage Marketing Copy */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="font-heading text-base font-bold uppercase text-white border-b border-neutral-800 pb-3">
            4. HOMEPAGE HERO & MARKETING COPY
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
              Hero Heading
            </label>
            <input
              type="text"
              value={formData.heroHeading}
              onChange={(e) => handleChange('heroHeading', e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
              Hero Supporting Description
            </label>
            <textarea
              rows={2}
              value={formData.heroDescription}
              onChange={(e) => handleChange('heroDescription', e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                value={formData.primaryCtaText}
                onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Secondary CTA Button Text
              </label>
              <input
                type="text"
                value={formData.secondaryCtaText}
                onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5: SEO & Local Metadata */}
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="font-heading text-base font-bold uppercase text-white border-b border-neutral-800 pb-3">
            5. SEO & SEARCH ENGINE METADATA
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
              SEO Page Title
            </label>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => handleChange('seoTitle', e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
              SEO Meta Description
            </label>
            <textarea
              rows={2}
              value={formData.seoDescription}
              onChange={(e) => handleChange('seoDescription', e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Google Analytics ID (Optional)
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={formData.googleAnalyticsId || ''}
                onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                Meta Pixel ID (Optional)
              </label>
              <input
                type="text"
                placeholder="Pixel ID"
                value={formData.metaPixelId || ''}
                onChange={(e) => handleChange('metaPixelId', e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-400/20"
          >
            <Save className="w-4 h-4" />
            <span>Save All Business Settings</span>
          </button>
        </div>
      </form>

      {/* Section 6: Security & Password Management */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h3 className="font-heading text-base font-bold uppercase text-white border-b border-neutral-800 pb-3 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>SECURITY & ADMIN PASSWORD</span>
        </h3>

        {passwordMsg && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
            {passwordMsg}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
              New Admin Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
              Confirm New Password
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Section 7: Danger Zone / Reset */}
      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-red-900/40 space-y-3">
        <h3 className="font-heading text-base font-bold uppercase text-red-400">
          DANGER ZONE & FACTORY RESET
        </h3>
        <p className="text-xs text-neutral-400">
          Restore all verified business information, sample data, and original imagery for Shirsekar's Fitness Hub.
        </p>

        <button
          onClick={handleResetToFactory}
          className="px-4 py-2.5 bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Content to Default</span>
        </button>
      </div>
    </div>
  );
};
