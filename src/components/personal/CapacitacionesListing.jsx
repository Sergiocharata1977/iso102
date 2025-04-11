
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus,
  Search,
  Download,
  Pencil,
  Trash2,
  GraduationCap
} from "lucide-react";
import CapacitacionModal from "./CapacitacionModal";

function CapacitacionesListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [capacitaciones, setCapacitaciones] = useState(() => {
    const saved = localStorage.getItem("capacitaciones");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = (capacitacionData) => {
    let updatedCapacitaciones;
    if (selectedCapacitacion) {
      updatedCapacitaciones = capacitaciones.map(c => 
        c.id === selectedCapacitacion.id ? { ...capacitacionData, id: selectedCapacitacion.id } : c
      );
      toast({
        title: "Capacitación actualizada",
        description: "Los datos de la capacitación han sido actualizados exitosamente"
      });
    } else {
      updatedCapacitaciones = [...capacitaciones, { ...capacitacionData, id: Date.now() }];
      toast({
        title: "Capacitación creada",
        description: "Se ha agregado una nueva capacitación exitosamente"
      });
    }
    setCapacitaciones(updatedCapacitaciones);
    localStorage.setItem("capacitaciones", JSON.stringify(updatedCapacitaciones));
    setIsModalOpen(false);
    setSelectedCapacitacion(null);
  };

  const handleEdit = (capacitacion) => {
    setSelectedCapacitacion(capacitacion);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const updatedCapacitaciones = capacitaciones.filter(c => c.id !== id);
    setCapacitaciones(updatedCapacitaciones);
    localStorage.setItem("capacitaciones", JSON.stringify(updatedCapacitaciones));
    toast({
      title: "Capacitación eliminada",
      description: "La capacitación ha sido eliminada exitosamente"
    });
  };

  const filteredCapacitaciones = capacitaciones.filter(capacitacion =>
    capacitacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    capacitacion.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar capacitaciones..."
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
            Nueva Capacitación
          </Button>
        </div>
      </div>

      {/* Capacitaciones List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCapacitaciones.map((capacitacion) => (
          <motion.div
            key={capacitacion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{capacitacion.titulo}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Instructor: {capacitacion.instructor}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <p className="text-sm">
                      Fecha: {capacitacion.fecha}
                    </p>
                    <p className="text-sm">
                      Duración: {capacitacion.duracion}
                    </p>
                  </div>
                  <p className="text-sm mt-2">{capacitacion.descripcion}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(capacitacion)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(capacitacion.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredCapacitaciones.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No hay capacitaciones registradas. Haz clic en "Nueva Capacitación" para comenzar.
            </p>
          </div>
        )}
      </div>

      <CapacitacionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCapacitacion(null);
        }}
        onSave={handleSave}
        capacitacion={selectedCapacitacion}
      />
    </div>
  );
}

export default CapacitacionesListing;
