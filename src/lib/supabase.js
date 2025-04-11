
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://foizbzozveycfsgabneu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaXpiem96dmV5Y2ZzZ2FibmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4OTMzNTMsImV4cCI6MjA1ODQ2OTM1M30.pytGlgcJ_2LWYKUZ7CjzApXJzx4eZgslYUypTixzoio';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Suscripción a mensajes de chat
export const subscribeToChatMessages = (callback) => {
  const subscription = supabase
    .channel('chat_messages')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'chat_messages'
    }, payload => {
      callback(payload);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

// Suscripción a notificaciones
export const subscribeToNotifications = (userId, callback) => {
  const subscription = supabase
    .channel('notifications')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    }, payload => {
      callback(payload);
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

// Servicios de chat
export const chatService = {
  async sendMessage(message) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([message])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async getMessages(conversationId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// Servicios de notificaciones
export const notificationService = {
  async createNotification(notification) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async markAsRead(notificationId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async getUnreadCount(userId) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('read', false);
    
    if (error) throw error;
    return count;
  }
};
