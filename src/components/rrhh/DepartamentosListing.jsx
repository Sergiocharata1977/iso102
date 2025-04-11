
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
  Building,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import DepartamentoModal from "./DepartamentoModal";
import DepartamentoSingle from "./DepartamentoSingle";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";

function DepartamentosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDepts, setExpandedDepts] = useState([]);
  const [showSingle, setShowSingle] = useState(false);
  const [currentDepartamento, setCurrentDepartamento] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departamentoToDelete, setDepartamentoToDelete] = useState(null);

  const [departamentos, setDepartamentos] = useState(() => {
    const saved = localStorage.getItem("departamentos");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleDepartamento = (id) => {
    setExpandedDepts(prev => 
      prev.includes(id) 
        ? prev.filter(deptId => deptId !== id)
        : [...prev, id]
    );
  };

  const handleSave = (departamentoData) => {
    try {
      let updatedDepartamentos;
      if (selectedDepartamento) {
        updatedDepartamentos = departamentos.map(d => 
          d.id === selectedDepartamento.id ? { ...departamentoData, id: selectedDepartamento.id } : d
        );
        toast({
          title: "Departamento actualizado",
          description: "Los datos del departamento han sido actualizados exitosamente"
        });
      } else {
        updatedDepartamentos = [...departamentos, { ...departamentoData, id: Date.now() }];
        toast({
          title: "Departamento creado",
          description: "Se ha agregado un nuevo departamento exitosamente"
        });
      }
      setDepartamentos(updatedDepartamentos);
      localStorage.setItem("departamentos", JSON.stringify(updatedDepartamentos));
      setIsModalOpen(false);
      setSelectedDepartamento(null);
    } catch (error) {
      console.error("Error saving departamento:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el departamento",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (departamento) => {
    setSelectedDepartamento(departamento);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const departamentoToDelete = departamentos.find(d => d.id === id);
    setDepartamentoToDelete(departamentoToDelete);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!departamentoToDelete) return;
    
    try {
      const hasChildren = departamentos.some(d => d.departamentoPadreId === departamentoToDelete.id);
      if (hasChildren) {
        toast({
          title: "No se puede eliminar",
          description: "Este departamento tiene subdepartamentos asociados",
          variant: "destructive"
        });
        return;
      }

      const updatedDepartamentos = departamentos.filter(d => d.id !== departamentoToDelete.id);
      setDepartamentos(updatedDepartamentos);
      localStorage.setItem("departamentos", JSON.stringify(updatedDepartamentos));
      toast({
        title: "Departamento eliminado",
        description: "El departamento ha sido eliminado exitosamente"
      });
      
      if (showSingle) {
        setShowSingle(false);
      }
    } catch (error) {
      console.error("Error deleting departamento:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el departamento",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setDepartamentoToDelete(null);
    }
  };

  const handleViewDepartamento = (departamento) => {
    setCurrentDepartamento(departamento);
    setShowSingle(true);
  };

  const renderDepartamento = (departamento, level = 0) => {
    const children = departamentos.filter(d => d.departamentoPadreId === departamento.id);
    const isExpanded = expandedDepts.includes(departamento.id);

    return (
      <div key={departamento.id} className="border-b border-border last:border-0">
        <div 
          className={`flex items-center justify-between p-4 ${
            level > 0 ? 'pl-' + (level * 8) : ''
          }`}
        >
          <div className="flex items-center space-x-4 flex-1 cursor-pointer" onClick={() => handleViewDepartamento(departamento)}>
            {children.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDepartamento(departamento.id);
                }}
                className="p-1 hover:bg-accent rounded-md"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-medium">{departamento.nombre}</h3>
                <p className="text-sm text-muted-foreground">
                  Responsable: {departamento.responsable}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(departamento);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(departamento.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isExpanded && children.length > 0 && (
          <div className="ml-4 border-l border-border">
            {children.map(child => renderDepartamento(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredDepartamentos = departamentos.filter(departamento =>
    departamento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    departamento.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rootDepartamentos = filteredDepartamentos.filter(d => !d.departamentoPadreId);

  if (showSingle) {
    return (
      <DepartamentoSingle
        departamento={currentDepartamento}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
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
              placeholder="Buscar departamentos..."
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
            Nuevo Departamento
          </Button>
        </div>
      </div>

      {/* Departamentos List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {rootDepartamentos.map(departamento => renderDepartamento(departamento))}
        {rootDepartamentos.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No hay departamentos registrados. Haz clic en "Nuevo Departamento" para comenzar.
            </p>
          </div>
        )}
      </div>

      <DepartamentoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDepartamento(null);
        }}
        onSave={handleSave}
        departamento={selectedDepartamento}
        departamentos={departamentos}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el departamento {departamentoToDelete?.nombre}.
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

export default DepartamentosListing;
