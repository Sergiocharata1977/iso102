
import { supabase } from '@/lib/supabase';

export const auditoriasService = {
  async getAll() {
    const { data, error } = await supabase
      .from('auditorias')
      .select(`
        *,
        puntos:auditoria_puntos(*)
      `)
      .order('fecha_programada', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async create(auditoria) {
    const { puntos, ...auditoriaData } = auditoria;
    
    // Crear la auditoría
    const { data: newAuditoria, error: auditoriaError } = await supabase
      .from('auditorias')
      .insert([auditoriaData])
      .select()
      .single();
    
    if (auditoriaError) throw auditoriaError;

    // Crear los puntos evaluados
    if (puntos && puntos.length > 0) {
      const puntosData = puntos.map(punto => ({
        ...punto,
        auditoria_id: newAuditoria.id
      }));

      const { error: puntosError } = await supabase
        .from('auditoria_puntos')
        .insert(puntosData);

      if (puntosError) throw puntosError;
    }

    return newAuditoria;
  },

  async update(id, auditoria) {
    const { puntos, ...auditoriaData } = auditoria;

    // Actualizar la auditoría
    const { data: updatedAuditoria, error: auditoriaError } = await supabase
      .from('auditorias')
      .update(auditoriaData)
      .eq('id', id)
      .select()
      .single();

    if (auditoriaError) throw auditoriaError;

    // Eliminar puntos anteriores
    const { error: deleteError } = await supabase
      .from('auditoria_puntos')
      .delete()
      .eq('auditoria_id', id);

    if (deleteError) throw deleteError;

    // Crear nuevos puntos
    if (puntos && puntos.length > 0) {
      const puntosData = puntos.map(punto => ({
        ...punto,
        auditoria_id: id
      }));

      const { error: puntosError } = await supabase
        .from('auditoria_puntos')
        .insert(puntosData);

      if (puntosError) throw puntosError;
    }

    return updatedAuditoria;
  },

  async delete(id) {
    const { error } = await supabase
      .from('auditorias')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
