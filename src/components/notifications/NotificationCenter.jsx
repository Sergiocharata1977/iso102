
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, X } from "lucide-react";
import { format, isToday, isTomorrow, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { notificationService, subscribeToNotifications } from "@/lib/supabase";

function NotificationCenter() {
  // ... (rest of the existing imports and initial state)

  useEffect(() => {
    // Subscribe to real-time notifications
    const unsubscribe = subscribeToNotifications("current_user", (payload) => {
      if (payload.eventType === 'INSERT') {
        const newNotification = payload.new;
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, read: true }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "No se pudo marcar la notificación como leída",
        variant: "destructive"
      });
    }
  };

  // ... (rest of the existing component code)
}

export default NotificationCenter;
