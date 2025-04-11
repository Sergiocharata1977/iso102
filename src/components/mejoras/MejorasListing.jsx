
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
  ArrowUpCircle,
  Filter,
  LayoutGrid,
  List,
  BarChart2
} from "lucide-react";
import MejoraFormulario from "./MejoraFormulario";
import MejorasDashboard from "./MejorasDashboard";

function MejorasListing() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMejora, setSelectedMejora] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mejoras, setMejoras] = useState([]);
  const [procesoFiltro, setProcesoFiltro] = useState("");
  const [procesos, setProcesos] = useState([]);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      // Cargar mejoras
      const savedMejoras = localStorage.getItem("mejoras");
      if (savedMejoras) {
        setMejoras(JSON.parse(savedMejoras));
      }

      // Cargar procesos
      const savedProcesos = localStorage.getItem("procesos");
      if (savedProcesos) {
        setProcesos(JSON.parse(savedProcesos));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      });
    }
  };

  const handleSave = (mejoraData) => {
    try {
      let updatedMejoras;
      if (selectedMejora) {
        updatedMejoras = mejoras.map(m => 
          m.id === selectedMejora.id ? { ...mejoraData, id: selectedMejora.id } : m
        );
        toast({
          title: "Mejora actualizada",
          description: "Los datos de la mejora han sido actualizados exitosamente"
        });
      } else {
        const newMejora = { 
          ...mejoraData, 
          id: Date.now(),
          fechaCreacion: new Date().toISOString()
        };
        updatedMejoras = [...mejoras, newMejora];
        toast({
          title: "Mejora creada",
          description: "Se ha agregado una nueva mejora exitosamente"
        });
      }
      setMejoras(updatedMejoras);
      localStorage.setItem("mejoras", JSON.stringify(updatedMejoras));
      setIsModalOpen(false);
      setSelectedMejora(null);
    } catch (error) {
      console.error("Error saving mejora:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la mejora",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (mejora) => {
    setSelectedMejora(mejora);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    try {
      const updatedMejoras = mejoras.filter(m => m.id !== id);
      setMejoras(updatedMejoras);
      localStorage.setItem("mejoras", JSON.stringify(updatedMejoras));
      toast({
        title: "Mejora eliminada",
        description: "La mejora ha sido eliminada exitosamente"
      });
    } catch (error) {
      console.error("Error deleting mejora:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la mejora",
        variant: "destructive"
      });
    }
  };

  const filteredMejoras = mejoras.filter(mejora =>
    (mejora.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mejora.proceso_involucrado?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!procesoFiltro || mejora.proceso_involucrado === procesoFiltro)
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMejoras.map((mejora) => (
        <motion.div
          key={mejora.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ArrowUpCircle className="h-5 w-5 text-primary" />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                mejora.estado === "Hallazgo" ? "bg-blue-100 text-blue-800" :
                mejora.estado === "Corrección" ? "bg-yellow-100 text-yellow-800" :
                mejora.estado === "Análisis de Causas" ? "bg-purple-100 text-purple-800" :
                mejora.estado === "Acción Correctiva" ? "bg-green-100 text-green-800" :
                mejora.estado === "Acción Preventiva" ? "bg-indigo-100 text-indigo-800" :
                mejora.estado === "Planificación control" ? "bg-orange-100 text-orange-800" :
                "bg-emerald-100 text-emerald-800"
              }`}>
                {mejora.estado}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(mejora)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(mejora.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <h3 className="font-medium mb-2 line-clamp-2">{mejora.descripcion}</h3>
          <p className="text-sm text-muted-foreground mb-4">{mejora.proceso_involucrado}</p>
          <div className="text-sm text-muted-foreground">
            {new Date(mejora.fechaCreacion).toLocaleDateString()}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="text-left p-4">Título</th>
            <th className="text-left p-4">Proceso</th>
            <th className="text-left p-4">Estado</th>
            <th className="text-right p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredMejoras.map((mejora) => (
            <motion.tr
              key={mejora.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-b border-border"
            >
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  <ArrowUpCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium">{mejora.descripcion}</span>
                </div>
              </td>
              <td className="p-4">{mejora.proceso_involucrado}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  mejora.estado === "Hallazgo" ? "bg-blue-100 text-blue-800" :
                  mejora.estado === "Corrección" ? "bg-yellow-100 text-yellow-800" :
                  mejora.estado === "Análisis de Causas" ? "bg-purple-100 text-purple-800" :
                  mejora.estado === "Acción Correctiva" ? "bg-green-100 text-green-800" :
                  mejora.estado === "Acción Preventiva" ? "bg-indigo-100 text-indigo-800" :
                  mejora.estado === "Planificación control" ? "bg-orange-100 text-orange-800" :
                  "bg-emerald-100 text-emerald-800"
                }`}>
                  {mejora.estado}
                </span>
              </td>
              <td className="p-4 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(mejora)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(mejora.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {filteredMejoras.length === 0 && (
        <div className="text-center py-12">
          <ArrowUpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            No hay mejoras registradas. Haz clic en "Nueva Mejora" para comenzar.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="dashboard">
              <BarChart2 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="grid">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Vista Tarjetas
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4 mr-2" />
              Vista Lista
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={() => {}}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Mejora
            </Button>
          </div>
        </div>

        <TabsContent value="dashboard">
          <MejorasDashboard mejoras={mejoras} />
        </TabsContent>

        <TabsContent value="grid">
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar mejoras..."
                  className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={procesoFiltro}
                  onChange={(e) => setProcesoFiltro(e.target.value)}
                >
                  <option value="">Todos los procesos</option>
                  {procesos.map((proceso) => (
                    <option key={proceso.id} value={proceso.titulo}>
                      {proceso.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {renderGridView()}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar mejoras..."
                  className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={procesoFiltro}
                  onChange={(e) => setProcesoFiltro(e.target.value)}
                >
                  <option value="">Todos los procesos</option>
                  {procesos.map((proceso) => (
                    <option key={proceso.id} value={proceso.titulo}>
                      {proceso.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {renderListView()}
          </div>
        </TabsContent>
      </Tabs>

      {isModalOpen && (
        <MejoraFormulario
          onSave={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedMejora(null);
          }}
          mejora={selectedMejora}
        />
      )}
    </div>
  );
}

export default MejorasListing;
