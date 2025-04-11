
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
  ClipboardCheck,
  Calendar,
  AlertCircle,
  ChevronRight,
  BarChart2,
  PieChart,
  LineChart,
  Filter
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line
} from 'recharts';
import AuditoriaModal from "./AuditoriaModal";
import AuditoriaSingle from "./AuditoriaSingle";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function AuditoriasListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuditoria, setSelectedAuditoria] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentAuditoria, setCurrentAuditoria] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auditorias, setAuditorias] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [procesoFiltro, setProcesoFiltro] = useState("");
  const [procesos, setProcesos] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar auditorías
      const savedAuditorias = localStorage.getItem("auditorias");
      const auditoriasData = savedAuditorias ? JSON.parse(savedAuditorias) : [];
      setAuditorias(auditoriasData);

      // Cargar procesos para el filtro
      const savedProcesos = localStorage.getItem("procesos");
      const procesosData = savedProcesos ? JSON.parse(savedProcesos) : [];
      setProcesos(procesosData);

    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (auditoriaData) => {
    try {
      let updatedAuditorias;
      if (selectedAuditoria) {
        updatedAuditorias = auditorias.map(a => 
          a.id === selectedAuditoria.id ? { ...auditoriaData, id: selectedAuditoria.id } : a
        );
        toast({
          title: "Auditoría actualizada",
          description: "Los datos de la auditoría han sido actualizados exitosamente"
        });
      } else {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const numero = `A${year}${month}-${random}`;
        
        updatedAuditorias = [...auditorias, { ...auditoriaData, id: Date.now(), numero }];
        toast({
          title: "Auditoría creada",
          description: "Se ha agregado una nueva auditoría exitosamente"
        });
      }
      setAuditorias(updatedAuditorias);
      localStorage.setItem("auditorias", JSON.stringify(updatedAuditorias));
      setIsModalOpen(false);
      setSelectedAuditoria(null);
    } catch (error) {
      console.error("Error saving auditoría:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la auditoría",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (auditoria) => {
    setSelectedAuditoria(auditoria);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    try {
      const updatedAuditorias = auditorias.filter(a => a.id !== id);
      setAuditorias(updatedAuditorias);
      localStorage.setItem("auditorias", JSON.stringify(updatedAuditorias));
      toast({
        title: "Auditoría eliminada",
        description: "La auditoría ha sido eliminada exitosamente"
      });
      
      if (showSingle) {
        setShowSingle(false);
      }
    } catch (error) {
      console.error("Error deleting auditoría:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la auditoría",
        variant: "destructive"
      });
    }
  };

  const handleViewAuditoria = (auditoria) => {
    setCurrentAuditoria(auditoria);
    setShowSingle(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Planificada':
        return 'bg-blue-100 text-blue-800';
      case 'En Ejecución':
        return 'bg-yellow-100 text-yellow-800';
      case 'Terminada':
        return 'bg-green-100 text-green-800';
      case 'Controlada':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('Lista de Auditorías', 20, 20);
    
    // Table
    const tableColumn = ["Número", "Fecha", "Responsable", "Estado"];
    const tableRows = auditorias.map(auditoria => [
      auditoria.numero,
      new Date(auditoria.fecha_programada).toLocaleDateString(),
      auditoria.responsable,
      auditoria.estado
    ]);
    
    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
    });
    
    doc.save('auditorias.pdf');
  };

  const filteredAuditorias = auditorias.filter(auditoria =>
    (auditoria.responsable?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auditoria.objetivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    auditoria.procesos_evaluar?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!procesoFiltro || auditoria.procesos_evaluar === procesoFiltro)
  );

  // Datos para gráficos
  const estadoData = [
    { name: 'Planificada', value: auditorias.filter(a => a.estado === 'Planificada').length },
    { name: 'En Ejecución', value: auditorias.filter(a => a.estado === 'En Ejecución').length },
    { name: 'Terminada', value: auditorias.filter(a => a.estado === 'Terminada').length },
    { name: 'Controlada', value: auditorias.filter(a => a.estado === 'Controlada').length }
  ];

  const calificacionData = [
    { name: 'Muy Bueno', value: 0 },
    { name: 'Bueno', value: 0 },
    { name: 'Regular', value: 0 },
    { name: 'Malo', value: 0 }
  ];

  auditorias.forEach(auditoria => {
    auditoria.puntos?.forEach(punto => {
      const index = calificacionData.findIndex(c => c.name === punto.calificacion);
      if (index !== -1) {
        calificacionData[index].value++;
      }
    });
  });

  const procesoData = Object.entries(
    auditorias.reduce((acc, auditoria) => {
      acc[auditoria.procesos_evaluar] = (acc[auditoria.procesos_evaluar] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  if (showSingle) {
    return (
      <AuditoriaSingle
        auditoria={currentAuditoria}
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="listing">Listado</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportToPDF}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Auditoría
            </Button>
          </div>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estado de Auditorías */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Estado de Auditorías
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={estadoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {estadoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Calificaciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Calificaciones
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calificacionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Auditorías por Proceso */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Auditorías por Proceso
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={procesoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="listing">
          {/* Toolbar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar auditorías..."
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

          {/* Lista de Auditorías */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Número</th>
                  <th className="text-left p-4">Fecha</th>
                  <th className="text-left p-4">Responsable</th>
                  <th className="text-left p-4">Objetivo</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditorias.map((auditoria) => (
                  <motion.tr
                    key={auditoria.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border cursor-pointer hover:bg-accent/50"
                    onClick={() => handleViewAuditoria(auditoria)}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <ClipboardCheck className="h-5 w-5 text-primary" />
                        <span className="font-medium">{auditoria.numero}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(auditoria.fecha_programada).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="p-4">{auditoria.responsable}</td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2">{auditoria.objetivo}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getEstadoColor(auditoria.estado)}`}>
                        {auditoria.estado}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(auditoria);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(auditoria.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredAuditorias.length === 0 && (
              <div className="text-center py-12">
                <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay auditorías registradas. Haz clic en "Nueva Auditoría" para comenzar.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AuditoriaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAuditoria(null);
        }}
        onSave={handleSave}
        auditoria={selectedAuditoria}
      />
    </div>
  );
}

export default AuditoriasListing;
