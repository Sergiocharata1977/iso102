
import { supabase } from '@/lib/supabase';

export const mejorasService = {
  async getAll() {
    const { data, error } = await supabase
      .from('mejoras')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(mejora) {
    const { data, error } = await supabase
      .from('mejoras')
      .insert([{
        ...mejora,
        estado: 'Detección'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id, mejora) {
    const { data, error } = await supabase
      .from('mejoras')
      .update(mejora)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('mejoras')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
