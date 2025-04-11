
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  FileText,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  Filter
} from "lucide-react";
import ProcesoModal from "./ProcesoModal";
import ProcesoSingle from "./ProcesoSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

function ProcesosListing() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentProceso, setCurrentProceso] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [procesoToDelete, setProcesoToDelete] = useState(null);
  const [procesos, setProcesos] = useState([]);

  useEffect(() => {
    loadProcesos();
  }, []);

  const loadProcesos = async () => {
    try {
      setIsLoading(true);
      const saved = localStorage.getItem("procesos");
      const data = saved ? JSON.parse(saved) : [];
      setProcesos(data);
    } catch (error) {
      console.error("Error loading procesos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los procesos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (procesoData) => {
    try {
      let updatedProcesos;
      if (selectedProceso) {
        updatedProcesos = procesos.map(p => 
          p.id === selectedProceso.id ? { ...procesoData, id: selectedProceso.id } : p
        );
        toast({
          title: "Proceso actualizado",
          description: "Los datos del proceso han sido actualizados exitosamente"
        });
      } else {
        updatedProcesos = [...procesos, { ...procesoData, id: Date.now() }];
        toast({
          title: "Proceso creado",
          description: "Se ha agregado un nuevo proceso exitosamente"
        });
      }
      setProcesos(updatedProcesos);
      localStorage.setItem("procesos", JSON.stringify(updatedProcesos));
      setIsModalOpen(false);
      setSelectedProceso(null);
    } catch (error) {
      console.error("Error saving proceso:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el proceso",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (proceso) => {
    setSelectedProceso(proceso);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const procesoToDelete = procesos.find(p => p.id === id);
    setProcesoToDelete(procesoToDelete);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!procesoToDelete) return;
    
    try {
      const updatedProcesos = procesos.filter(p => p.id !== procesoToDelete.id);
      setProcesos(updatedProcesos);
      localStorage.setItem("procesos", JSON.stringify(updatedProcesos));
      toast({
        title: "Proceso eliminado",
        description: "El proceso ha sido eliminado exitosamente"
      });
      
      if (showSingle) {
        setShowSingle(false);
      }
    } catch (error) {
      console.error("Error deleting proceso:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el proceso",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setProcesoToDelete(null);
    }
  };

  const handleViewProceso = (proceso) => {
    setCurrentProceso(proceso);
    setShowSingle(true);
  };

  const filteredProcesos = procesos.filter(proceso =>
    proceso.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proceso.objetivo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showSingle) {
    return (
      <ProcesoSingle 
        proceso={currentProceso} 
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

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
            <ListIcon className="h-4 w-4" />
          </Button>
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar procesos..."
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
            Nuevo Proceso
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
            {filteredProcesos.map((proceso) => (
              <motion.div
                key={proceso.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleViewProceso(proceso)}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{proceso.titulo}</h3>
                      <p className="text-sm text-muted-foreground">
                        {proceso.codigo}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {proceso.objetivo}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      proceso.estado === "activo" 
                        ? "bg-green-100 text-green-800"
                        : proceso.estado === "revision"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {proceso.estado}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(proceso);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(proceso.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Proceso</th>
                  <th className="text-left p-4">Objetivo</th>
                  <th className="text-left p-4">Versión</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProcesos.map((proceso) => (
                  <motion.tr
                    key={proceso.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border cursor-pointer hover:bg-accent/50"
                    onClick={() => handleViewProceso(proceso)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{proceso.titulo}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2">{proceso.objetivo}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-sm px-2 py-1 bg-primary/10 rounded-full text-primary">
                        v{proceso.version}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        proceso.estado === "activo" 
                          ? "bg-green-100 text-green-800"
                          : proceso.estado === "revision"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {proceso.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(proceso);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(proceso.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredProcesos.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay procesos registrados. Haz clic en "Nuevo Proceso" para comenzar.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <ProcesoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProceso(null);
        }}
        onSave={handleSave}
        proceso={selectedProceso}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el proceso {procesoToDelete?.titulo}.
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

export default ProcesosListing;
