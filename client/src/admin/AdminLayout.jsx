import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { api } from '../services/api';

export const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const fetchUnread = async () => {
    try {
      const res = await api.getMessages('?status=unread');
      if (res.success) {
        setUnreadMessages(res.unreadCount || (res.data ? res.data.length : 0));
      }
    } catch (err) {
      // Ignore background error
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa] flex">
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        unreadMessages={unreadMessages}
      />

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          setMobileOpen={setMobileOpen}
          unreadMessages={unreadMessages}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ refreshUnread: fetchUnread }} />
        </main>
      </div>
    </div>
  );
};
