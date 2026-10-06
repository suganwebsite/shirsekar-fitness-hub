'use client';

import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import App from '../../../App';

export default function AdminSubtabRoutePage() {
  const params = useParams();
  const tab = params?.tab as string;

  useEffect(() => {
    if (tab) {
      window.location.hash = `#/admin/${tab}`;
    }
  }, [tab]);

  return <App />;
}
