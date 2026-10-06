'use client';

import React from 'react';
import { AdminLogin } from '../../../components/admin/AdminLogin';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AdminLogin
        onLoginSuccess={() => {
          window.location.href = '/admin';
        }}
        onBackToWebsite={() => {
          window.location.href = '/';
        }}
      />
    </div>
  );
}
