'use client';

import React, { useEffect } from 'react';
import App from '../../App';

export default function AdminRoutePage() {
  useEffect(() => {
    if (!window.location.hash.startsWith('#/admin')) {
      window.location.hash = '#/admin/dashboard';
    }
  }, []);

  return <App />;
}
