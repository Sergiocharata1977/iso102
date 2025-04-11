
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
  Building2,
  Users,
  LayoutGrid,
  List,
  ChevronRight
} from "lucide-react";
import PuestoModal from "./PuestoModal";
import PuestoSingle from "./PuestoSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

function PuestosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentPuesto, setCurrentPuesto] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [puestoToDelete, setPuestoToDelete] = useState(null);

  const [puestos, setPuestos] = useState(() => {
    const saved = localStorage.getItem("puestos");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = (puestoData) => {
    try {
      let updatedPuestos;
      if (selectedPuesto) {
        updatedPuestos = puestos.map(p => 
          p.id === selectedPuesto.id ? { ...puestoData, id: selectedPuesto.id } : p
        );
        toast({
          title: "Puesto actualizado",
          description: "Los datos del puesto han sido actualizados exitosamente"
        });
      } else {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const codigo = `P${year}${month}-${random}`;
        
        updatedPuestos = [...puestos, { ...puestoData, id: Date.now(), codigo }];
        toast({
          title: "Puesto creado",
          description: "Se ha agregado un nuevo puesto exitosamente"
        });
      }
      setPuestos(updatedPuestos);
      localStorage.setItem("puestos", JSON.stringify(updatedPuestos));
      setIsModalOpen(false);
      setSelectedPuesto(null);
    } catch (error) {
      console.error("Error saving puesto:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el puesto",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (puesto) => {
    setSelectedPuesto(puesto);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const puestoToDelete = puestos.find(p => p.id === id);
    setPuestoToDelete(puestoToDelete);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!puestoToDelete) return;
    
    try {
      const updatedPuestos = puestos.filter(p => p.id !== puestoToDelete.id);
      setPuestos(updatedPuestos);
      localStorage.setItem("puestos", JSON.stringify(updatedPuestos));
      toast({
        title: "Puesto eliminado",
        description: "El puesto ha sido eliminado exitosamente"
      });
      
      if (showSingle) {
        setShowSingle(false);
      }
    } catch (error) {
      console.error("Error deleting puesto:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el puesto",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setPuestoToDelete(null);
    }
  };

  const handleViewPuesto = (puesto) => {
    setCurrentPuesto(puesto);
    setShowSingle(true);
  };

  const filteredPuestos = puestos.filter(puesto =>
    puesto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puesto.departamento?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showSingle) {
    return (
      <PuestoSingle
        puesto={currentPuesto}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
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
              placeholder="Buscar puestos..."
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
            Nuevo Puesto
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPuestos.map((puesto) => (
              <motion.div
                key={puesto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleViewPuesto(puesto)}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">{puesto.nombre}</h3>
                      <p className="text-sm text-muted-foreground">
                        {puesto.codigo}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {puesto.departamento}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      puesto.estado === "activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {puesto.estado}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(puesto);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(puesto.id);
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
                  <th className="text-left p-4">Puesto</th>
                  <th className="text-left p-4">Departamento</th>
                  <th className="text-left p-4">Supervisor</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPuestos.map((puesto) => (
                  <motion.tr
                    key={puesto.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border cursor-pointer hover:bg-accent/50"
                    onClick={() => handleViewPuesto(puesto)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{puesto.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {puesto.codigo}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{puesto.departamento}</td>
                    <td className="p-4">{puesto.supervisor}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        puesto.estado === "activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {puesto.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(puesto);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(puesto.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredPuestos.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay puestos registrados. Haz clic en "Nuevo Puesto" para comenzar.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Modals */}
      <PuestoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPuesto(null);
        }}
        onSave={handleSave}
        puesto={selectedPuesto}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el puesto {puestoToDelete?.nombre}.
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

export default PuestosListing;
