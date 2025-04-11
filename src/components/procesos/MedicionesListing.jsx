
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { medicionesService } from "@/services/mediciones";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  LineChart
} from "lucide-react";
import MedicionModal from "./MedicionModal";

function MedicionesListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicion, setSelectedMedicion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mediciones, setMediciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMediciones();
  }, []);

  const loadMediciones = async () => {
    try {
      setIsLoading(true);
      const data = await medicionesService.getAll();
      setMediciones(data || []);
    } catch (error) {
      console.error("Error al cargar mediciones:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las mediciones",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (medicionData) => {
    try {
      let updatedMedicion;
      if (selectedMedicion) {
        updatedMedicion = await medicionesService.update(selectedMedicion.id, medicionData);
        toast({
          title: "Medición actualizada",
          description: "Los datos de la medición han sido actualizados exitosamente"
        });
      } else {
        updatedMedicion = await medicionesService.create(medicionData);
        toast({
          title: "Medición creada",
          description: "Se ha agregado una nueva medición exitosamente"
        });
      }
      await loadMediciones();
      setIsModalOpen(false);
      setSelectedMedicion(null);
    } catch (error) {
      console.error("Error al guardar medición:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la medición",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (medicion) => {
    setSelectedMedicion(medicion);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await medicionesService.delete(id);
      toast({
        title: "Medición eliminada",
        description: "La medición ha sido eliminada exitosamente"
      });
      await loadMediciones();
    } catch (error) {
      console.error("Error al eliminar medición:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la medición",
        variant: "destructive"
      });
    }
  };

  const filteredMediciones = mediciones.filter(medicion =>
    medicion.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Buscar mediciones..."
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
            Nueva Medición
          </Button>
        </div>
      </div>

      {/* Lista de Mediciones */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-4">Título</th>
              <th className="text-left p-4">Medición</th>
              <th className="text-left p-4">Comentarios</th>
              <th className="text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMediciones.map((medicion) => (
              <motion.tr
                key={medicion.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-border"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <LineChart className="h-5 w-5 text-primary" />
                    <span className="font-medium">{medicion.titulo}</span>
                  </div>
                </td>
                <td className="p-4">{medicion.medicion}</td>
                <td className="p-4">
                  <p className="text-sm line-clamp-2">{medicion.comentarios}</p>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(medicion)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(medicion.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredMediciones.length === 0 && (
          <div className="text-center py-12">
            <LineChart className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No hay mediciones registradas. Haz clic en "Nueva Medición" para comenzar.
            </p>
          </div>
        )}
      </div>

      <MedicionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMedicion(null);
        }}
        onSave={handleSave}
        medicion={selectedMedicion}
      />
    </div>
  );
}

export default MedicionesListing;
