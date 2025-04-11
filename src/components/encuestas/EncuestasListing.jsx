
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
  ClipboardList,
  BarChart2,
  PieChart,
  LineChart,
  Star
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
import EncuestaModal from "./EncuestaModal";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function EncuestasListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEncuesta, setSelectedEncuesta] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [encuestas, setEncuestas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    loadEncuestas();
  }, []);

  const loadEncuestas = async () => {
    try {
      setIsLoading(true);
      const saved = localStorage.getItem("encuestas");
      const data = saved ? JSON.parse(saved) : [];
      setEncuestas(data);
    } catch (error) {
      console.error("Error loading encuestas:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las encuestas", variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (encuestaData) => {
    try {
      let updatedEncuestas;
      if (selectedEncuesta) {
        updatedEncuestas = encuestas.map(e => 
          e.id === selectedEncuesta.id ? { ...encuestaData, id: selectedEncuesta.id } : e
        );
        toast({
          title: "Encuesta actualizada",
          description: "Los datos de la encuesta han sido actualizados exitosamente"
        });
      } else {
        const newEncuesta = { 
          ...encuestaData, 
          id: Date.now(),
          fecha: new Date().toISOString().split('T')[0]
        };
        updatedEncuestas = [...encuestas, newEncuesta];
        toast({
          title: "Encuesta creada",
          description: "Se ha agregado una nueva encuesta exitosamente"
        });
      }
      setEncuestas(updatedEncuestas);
      localStorage.setItem("encuestas", JSON.stringify(updatedEncuestas));
      setIsModalOpen(false);
      setSelectedEncuesta(null);
    } catch (error) {
      console.error("Error saving encuesta:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la encuesta",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (encuesta) => {
    setSelectedEncuesta(encuesta);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const updatedEncuestas = encuestas.filter(e => e.id !== id);
      setEncuestas(updatedEncuestas);
      localStorage.setItem("encuestas", JSON.stringify(updatedEncuestas));
      toast({
        title: "Encuesta eliminada",
        description: "La encuesta ha sido eliminada exitosamente"
      });
    } catch (error) {
      console.error("Error deleting encuesta:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la encuesta",
        variant: "destructive"
      });
    }
  };

  const getSatisfaccionColor = (satisfaccion) => {
    switch (satisfaccion) {
      case 'Malo':
        return 'bg-red-100 text-red-800';
      case 'Regular':
        return 'bg-yellow-100 text-yellow-800';
      case 'Bueno':
        return 'bg-green-100 text-green-800';
      case 'Muy Bueno':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEncuestas = encuestas.filter(encuesta =>
    encuesta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    encuesta.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Datos para gráficos
  const satisfaccionData = [
    { name: 'Muy Bueno', value: encuestas.filter(e => e.satisfaccion_general === 'Muy Bueno').length },
    { name: 'Bueno', value: encuestas.filter(e => e.satisfaccion_general === 'Bueno').length },
    { name: 'Regular', value: encuestas.filter(e => e.satisfaccion_general === 'Regular').length },
    { name: 'Malo', value: encuestas.filter(e => e.satisfaccion_general === 'Malo').length }
  ];

  const categoriaData = Object.entries(
    encuestas.reduce((acc, encuesta) => {
      acc[encuesta.categoria] = (acc[encuesta.categoria] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const recomendacionData = [
    { name: 'Recomendaría', value: encuestas.filter(e => e.recomendaria_compra).length },
    { name: 'No Recomendaría', value: encuestas.filter(e => !e.recomendaria_compra).length }
  ];

  const puntuacionData = encuestas
    .map(e => ({
      fecha: new Date(e.fecha).toLocaleDateString(),
      puntuacion: e.puntuacion
    }))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

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
            <Button variant="outline" onClick={() => {}}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Encuesta
            </Button>
          </div>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Satisfacción General */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Satisfacción General
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={satisfaccionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {satisfaccionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Encuestas por Categoría */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Encuestas por Categoría
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoriaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recomendación */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Recomendación
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={recomendacionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {recomendacionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Evolución de Puntuación */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Evolución de Puntuación
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={puntuacionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="puntuacion" stroke="#8884d8" />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="listing">
          {/* Toolbar */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar encuestas..."
                className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Lista de Encuestas */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Cliente</th>
                  <th className="text-left p-4">Producto</th>
                  <th className="text-left p-4">Satisfacción</th>
                  <th className="text-left p-4">Recomendaría</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredEncuestas.map((encuesta) => (
                  <motion.tr
                    key={encuesta.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-primary" />
                        <span className="font-medium">{encuesta.cliente}</span>
                      </div>
                    </td>
                    <td className="p-4">{encuesta.producto}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getSatisfaccionColor(encuesta.satisfaccion_general)}`}>
                        {encuesta.satisfaccion_general}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        encuesta.recomendaria_compra ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {encuesta.recomendaria_compra ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(encuesta)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(encuesta.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredEncuestas.length === 0 && (
              <div className="text-center py-12">
                <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay encuestas registradas. Haz clic en "Nueva Encuesta" para comenzar.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <EncuestaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEncuesta(null);
        }}
        onSave={handleSave}
        encuesta={selectedEncuesta}
      />
    </div>
  );
}

export default EncuestasListing;
