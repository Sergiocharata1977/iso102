
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { objetivosService } from "@/services/objetivos";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  Target
} from "lucide-react";
import ObjetivoModal from "./ObjetivoModal";

function ObjetivosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [objetivos, setObjetivos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadObjetivos();
  }, []);

  const loadObjetivos = async () => {
    try {
      setIsLoading(true);
      const data = await objetivosService.getAll();
      setObjetivos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los objetivos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (objetivoData) => {
    try {
      let updatedObjetivo;
      if (selectedObjetivo) {
        updatedObjetivo = await objetivosService.update(selectedObjetivo.id, objetivoData);
        toast({
          title: "Objetivo actualizado",
          description: "Los datos del objetivo han sido actualizados exitosamente"
        });
      } else {
        updatedObjetivo = await objetivosService.create(objetivoData);
        toast({
          title: "Objetivo creado",
          description: "Se ha agregado un nuevo objetivo exitosamente"
        });
      }
      await loadObjetivos();
      setIsModalOpen(false);
      setSelectedObjetivo(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el objetivo",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (objetivo) => {
    setSelectedObjetivo(objetivo);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await objetivosService.delete(id);
      toast({
        title: "Objetivo eliminado",
        description: "El objetivo ha sido eliminado exitosamente"
      });
      await loadObjetivos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el objetivo",
        variant: "destructive"
      });
    }
  };

  const filteredObjetivos = objetivos.filter(objetivo =>
    objetivo.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar objetivos..."
              className="pl-8 h-10 w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Objetivo
          </Button>
        </div>
      </div>

      {/* Lista de Objetivos */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-4">Título</th>
              <th className="text-left p-4">Descripción</th>
              <th className="text-left p-4">Responsable</th>
              <th className="text-left p-4">Procesos</th>
              <th className="text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredObjetivos.map((objetivo) => (
              <motion.tr
                key={objetivo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-border"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-medium">{objetivo.titulo}</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm line-clamp-2">{objetivo.descripcion}</p>
                </td>
                <td className="p-4">{objetivo.responsable}</td>
                <td className="p-4">
                  <p className="text-sm">{objetivo.procesos}</p>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(objetivo)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(objetivo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredObjetivos.length === 0 && (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No hay objetivos registrados. Haz clic en "Nuevo Objetivo" para comenzar.
            </p>
          </div>
        )}
      </div>

      <ObjetivoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedObjetivo(null);
        }}
        onSave={handleSave}
        objetivo={selectedObjetivo}
      />
    </div>
  );
}

export default ObjetivosListing;
