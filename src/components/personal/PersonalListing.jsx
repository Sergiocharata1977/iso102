
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
  Users,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import PersonalModal from "./PersonalModal";
import PersonalSingle from "./PersonalSingle";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { usePagination } from "@/hooks/use-pagination";

const PersonalCard = React.memo(({ person, onView, onEdit, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-card border border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
    onClick={() => onView(person)}
  >
    <div className="aspect-square relative">
      <img 
        className="w-full h-full object-cover"
        alt={`Foto de ${person.nombre}`}
        src={person.imagen || "https://images.unsplash.com/photo-1578390432942-d323db577792"}
        loading="lazy"
      />
    </div>
    <div className="p-4">
      <h3 className="font-semibold">{person.nombre}</h3>
      <p className="text-sm text-muted-foreground">{person.puesto}</p>
      <p className="text-sm text-muted-foreground">{person.departamento}</p>
      <div className="mt-4 flex justify-end space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(person);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(person.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </motion.div>
));

const PersonalSkeletonCard = () => (
  <div className="bg-card border border-border rounded-lg overflow-hidden">
    <Skeleton className="aspect-square" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

function PersonalListing() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentPerson, setCurrentPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [personal, setPersonal] = useState([]);

  useEffect(() => {
    loadPersonal();
  }, []);

  const loadPersonal = () => {
    try {
      setIsLoading(true);
      const saved = localStorage.getItem("personal");
      const data = saved ? JSON.parse(saved) : [];
      setPersonal(data);
    } catch (error) {
      console.error("Error loading personal:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de personal",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredPersonal = React.useMemo(() => {
    return personal.filter(person =>
      person.nombre?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      person.puesto?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      person.departamento?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [personal, debouncedSearchTerm]);

  const {
    items: paginatedPersonal,
    currentPage,
    totalPages,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination(filteredPersonal, viewMode === "grid" ? 12 : 10);

  const handleSave = async (personData) => {
    try {
      setIsLoading(true);
      let updatedPersonal;
      if (selectedPerson) {
        updatedPersonal = personal.map(p => 
          p.id === selectedPerson.id ? { ...personData, id: selectedPerson.id } : p
        );
        toast({
          title: "Registro actualizado",
          description: "Los datos del personal han sido actualizados exitosamente"
        });
      } else {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const numero = `P${year}${month}-${random}`;
        
        updatedPersonal = [...personal, { ...personData, id: Date.now(), numero }];
        toast({
          title: "Registro creado",
          description: "Se ha agregado un nuevo registro de personal"
        });
      }
      setPersonal(updatedPersonal);
      localStorage.setItem("personal", JSON.stringify(updatedPersonal));
      setIsModalOpen(false);
      setSelectedPerson(null);
    } catch (error) {
      console.error("Error saving personal:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar los datos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (person) => {
    setSelectedPerson(person);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const personToDelete = personal.find(p => p.id === id);
    setPersonToDelete(personToDelete);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!personToDelete) return;
    
    try {
      const updatedPersonal = personal.filter(p => p.id !== personToDelete.id);
      setPersonal(updatedPersonal);
      localStorage.setItem("personal", JSON.stringify(updatedPersonal));
      toast({
        title: "Registro eliminado",
        description: "El registro ha sido eliminado exitosamente"
      });
      
      if (showSingle) {
        setShowSingle(false);
      }
    } catch (error) {
      console.error("Error deleting personal:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el registro",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setPersonToDelete(null);
    }
  };

  const handleViewPerson = (person) => {
    setCurrentPerson(person);
    setShowSingle(true);
  };

  if (showSingle && currentPerson) {
    return (
      <PersonalSingle
        persona={currentPerson}
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
              placeholder="Buscar personal..."
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
            Nuevo Personal
          </Button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {isLoading ? (
          // Skeleton Loading
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <PersonalSkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-border p-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedPersonal.map((person) => (
                  <PersonalCard
                    key={person.id}
                    person={person}
                    onView={handleViewPerson}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4">Foto</th>
                      <th className="text-left p-4">Nombre</th>
                      <th className="text-left p-4 hidden md:table-cell">Puesto</th>
                      <th className="text-left p-4 hidden lg:table-cell">Departamento</th>
                      <th className="text-left p-4 hidden xl:table-cell">Email</th>
                      <th className="text-left p-4 hidden xl:table-cell">Teléfono</th>
                      <th className="text-right p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPersonal.map((person) => (
                      <motion.tr
                        key={person.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-border cursor-pointer hover:bg-accent/50"
                        onClick={() => handleViewPerson(person)}
                      >
                        <td className="p-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img 
                              className="w-full h-full object-cover"
                              alt={`Foto de ${person.nombre}`}
                              src={person.imagen || "https://images.unsplash.com/photo-1578390432942-d323db577792"}
                              loading="lazy"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span>{person.nombre}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">{person.puesto}</td>
                        <td className="p-4 hidden lg:table-cell">{person.departamento}</td>
                        <td className="p-4 hidden xl:table-cell">{person.email}</td>
                        <td className="p-4 hidden xl:table-cell">{person.telefono}</td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(person);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(person.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {paginatedPersonal.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                      No hay personal registrado. Haz clic en "Nuevo Personal" para comenzar.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={previousPage}
                  disabled={!hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={!hasNextPage}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Modals */}
      <PersonalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPerson(null);
        }}
        onSave={handleSave}
        person={selectedPerson}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el registro de {personToDelete?.nombre}.
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

export default PersonalListing;
