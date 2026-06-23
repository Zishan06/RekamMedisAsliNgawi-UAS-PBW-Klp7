"use client";

/**
 * notification-context.tsx — Context untuk state Notifikasi
 */

import { createContext, useContext, ReactNode } from "react";
import { NotificationItem, INITIAL_NOTIFICATIONS } from "@/lib/dummy-notifications";
import { useLocalStorage } from "@/hooks/use-common";

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  // Gunakan local storage untuk persisten notifikasi dummy
  const [notifications, setNotifications] = useLocalStorage<NotificationItem[]>(
    "rme_notifications_v2", // v2 karena schema berubah (ada field category)
    INITIAL_NOTIFICATIONS
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications harus digunakan di dalam NotificationProvider");
  }
  return context;
}
