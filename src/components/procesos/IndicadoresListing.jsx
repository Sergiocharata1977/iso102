
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  BarChart2,
  LayoutGrid,
  List,
  ChevronRight
} from "lucide-react";
import IndicadorModal from "./IndicadorModal";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

const IndicadorCard = React.memo(({ indicador, onView, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
    onClick={() => onView(indicador)}
  >
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <BarChart2 className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold truncate">{indicador.titulo}</h3>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{indicador.descripcion}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">{indicador.unidad_medida}</span>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(indicador);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(indicador.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </motion.div>
));

function IndicadoresListing() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndicador, setSelectedIndicador] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [indicadorToDelete, setIndicadorToDelete] = useState(null);
  const [indicadores, setIndicadores] = useState([]);

  useEffect(() => {
    loadIndicadores();
  }, []);

  const loadIndicadores = async () => {
    try {
      setIsLoading(true);
      const saved = localStorage.getItem("indicadores");
      const data = saved ? JSON.parse(saved) : [];
      setIndicadores(data);
    } catch (error) {
      console.error("Error loading indicadores:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los indicadores",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (indicadorData) => {
    try {
      let updatedIndicadores;
      if (selectedIndicador) {
        updatedIndicadores = indicadores.map(i => 
          i.id === selectedIndicador.id ? { ...indicadorData, id: selectedIndicador.id } : i
        );
        toast({
          title: "Indicador actualizado",
          description: "Los datos del indicador han sido actualizados exitosamente"
        });
      } else {
        updatedIndicadores = [...indicadores, { ...indicadorData, id: Date.now() }];
        toast({
          title: "Indicador creado",
          description: "Se ha agregado un nuevo indicador exitosamente"
        });
      }
      setIndicadores(updatedIndicadores);
      localStorage.setItem("indicadores", JSON.stringify(updatedIndicadores));
      setIsModalOpen(false);
      setSelectedIndicador(null);
    } catch (error) {
      console.error("Error saving indicador:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el indicador",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (indicador) => {
    setSelectedIndicador(indicador);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const indicadorToDelete = indicadores.find(i => i.id === id);
    setIndicadorToDelete(indicadorToDelete);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!indicadorToDelete) return;
    
    try {
      const updatedIndicadores = indicadores.filter(i => i.id !== indicadorToDelete.id);
      setIndicadores(updatedIndicadores);
      localStorage.setItem("indicadores", JSON.stringify(updatedIndicadores));
      toast({
        title: "Indicador eliminado",
        description: "El indicador ha sido eliminado exitosamente"
      });
    } catch (error) {
      console.error("Error deleting indicador:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el indicador",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setIndicadorToDelete(null);
    }
  };

  const filteredIndicadores = indicadores.filter(indicador =>
    indicador.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indicador.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar indicadores..."
              className="pl-8 h-10 w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Indicador
          </Button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIndicadores.map((indicador) => (
              <IndicadorCard
                key={indicador.id}
                indicador={indicador}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Título</th>
                  <th className="text-left p-4">Descripción</th>
                  <th className="text-left p-4">Unidad de Medida</th>
                  <th className="text-left p-4">Límite</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredIndicadores.map((indicador) => (
                  <motion.tr
                    key={indicador.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-border cursor-pointer hover:bg-accent/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <BarChart2 className="h-5 w-5 text-primary" />
                        <span className="font-medium">{indicador.titulo}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2">{indicador.descripcion}</p>
                    </td>
                    <td className="p-4">{indicador.unidad_medida}</td>
                    <td className="p-4">{indicador.limite_aceptacion}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(indicador)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(indicador.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredIndicadores.length === 0 && (
              <div className="text-center py-12">
                <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay indicadores registrados. Haz clic en "Nuevo Indicador" para comenzar.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <IndicadorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedIndicador(null);
        }}
        onSave={handleSave}
        indicador={selectedIndicador}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el indicador {indicadorToDelete?.titulo}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default IndicadoresListing;
