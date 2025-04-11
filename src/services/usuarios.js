
import { supabase } from '@/lib/supabase';

export const usuariosService = {
  async getAll() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(usuario) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuario])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, usuario) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(usuario)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
