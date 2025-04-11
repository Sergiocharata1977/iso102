
import { supabase } from '@/lib/supabase';

export const noticiasService = {
  async getAll() {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(noticia) {
    const { data, error } = await supabase
      .from('noticias')
      .insert([noticia])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async update(id, noticia) {
    const { data, error } = await supabase
      .from('noticias')
      .update(noticia)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(id) {
    const { error } = await supabase
      .from('noticias')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
