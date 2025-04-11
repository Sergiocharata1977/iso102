
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
  Award
} from "lucide-react";
import EvaluacionModal from "./EvaluacionModal";

function EvaluacionesListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluacion, setSelectedEvaluacion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [evaluaciones, setEvaluaciones] = useState(() => {
    const saved = localStorage.getItem("evaluaciones");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = (evaluacionData) => {
    let updatedEvaluaciones;
    if (selectedEvaluacion) {
      updatedEvaluaciones = evaluaciones.map(e => 
        e.id === selectedEvaluacion.id ? { ...evaluacionData, id: selectedEvaluacion.id } : e
      );
      toast({
        title: "Evaluación actualizada",
        description: "Los datos de la evaluación han sido actualizados exitosamente"
      });
    } else {
      updatedEvaluaciones = [...evaluaciones, { ...evaluacionData, id: Date.now() }];
      toast({
        title: "Evaluación creada",
        description: "Se ha agregado una nueva evaluación exitosamente"
      });
    }
    setEvaluaciones(updatedEvaluaciones);
    localStorage.setItem("evaluaciones", JSON.stringify(updatedEvaluaciones));
    setIsModalOpen(false);
    setSelectedEvaluacion(null);
  };

  const handleEdit = (evaluacion) => {
    setSelectedEvaluacion(evaluacion);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const updatedEvaluaciones = evaluaciones.filter(e => e.id !== id);
    setEvaluaciones(updatedEvaluaciones);
    localStorage.setItem("evaluaciones", JSON.stringify(updatedEvaluaciones));
    toast({
      title: "Evaluación eliminada",
      description: "La evaluación ha sido eliminada exitosamente"
    });
  };

  const filteredEvaluaciones = evaluaciones.filter(evaluacion =>
    evaluacion.empleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
    evaluacion.evaluador.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Buscar evaluaciones..."
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
            Nueva Evaluación
          </Button>
        </div>
      </div>

      {/* Evaluaciones List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEvaluaciones.map((evaluacion) => (
          <motion.div
            key={evaluacion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{evaluacion.empleado}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Evaluador: {evaluacion.evaluador}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <p className="text-sm">
                      Fecha: {evaluacion.fecha}
                    </p>
                    <p className="text-sm">
                      Periodo: {evaluacion.periodo}
                    </p>
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      evaluacion.resultado >= 90 ? "bg-green-100 text-green-800" :
                      evaluacion.resultado >= 70 ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      Resultado: {evaluacion.resultado}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(evaluacion)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(evaluacion.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredEvaluaciones.length === 0 && (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No hay evaluaciones registradas. Haz clic en "Nueva Evaluación" para comenzar.
            </p>
          </div>
        )}
      </div>

      <EvaluacionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvaluacion(null);
        }}
        onSave={handleSave}
        evaluacion={selectedEvaluacion}
      />
    </div>
  );
}

export default EvaluacionesListing;
