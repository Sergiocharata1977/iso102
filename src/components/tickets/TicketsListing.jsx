
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
  Ticket,
  BarChart2,
  PieChart,
  LineChart
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
import TicketModal from "./TicketModal";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function TicketsListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const saved = localStorage.getItem("tickets");
      const data = saved ? JSON.parse(saved) : [];
      setTickets(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los tickets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (ticketData) => {
    try {
      let updatedTickets;
      if (selectedTicket) {
        updatedTickets = tickets.map(t => 
          t.id === selectedTicket.id ? { ...ticketData, id: selectedTicket.id } : t
        );
        toast({
          title: "Ticket actualizado",
          description: "Los datos del ticket han sido actualizados exitosamente"
        });
      } else {
        const newTicket = { 
          ...ticketData, 
          id: Date.now(),
          created_at: new Date().toISOString()
        };
        updatedTickets = [...tickets, newTicket];
        toast({
          title: "Ticket creado",
          description: "Se ha agregado un nuevo ticket exitosamente"
        });
      }
      setTickets(updatedTickets);
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));
      setIsModalOpen(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error saving ticket:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el ticket",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const updatedTickets = tickets.filter(t => t.id !== id);
      setTickets(updatedTickets);
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));
      toast({
        title: "Ticket eliminado",
        description: "El ticket ha sido eliminado exitosamente"
      });
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el ticket",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Datos para gráficos
  const statusData = [
    { name: 'Abiertos', value: tickets.filter(t => t.status === 'Open').length },
    { name: 'En Progreso', value: tickets.filter(t => t.status === 'In Progress').length },
    { name: 'Cerrados', value: tickets.filter(t => t.status === 'Closed').length }
  ];

  const categoryData = Object.entries(
    tickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const priorityData = [
    { name: 'Alta', value: tickets.filter(t => t.priority === 'Alta').length },
    { name: 'Media', value: tickets.filter(t => t.priority === 'Media').length },
    { name: 'Baja', value: tickets.filter(t => t.priority === 'Baja').length }
  ];

  const satisfactionData = tickets
    .filter(t => t.satisfaction)
    .map(t => ({
      fecha: new Date(t.created_at).toLocaleDateString(),
      satisfaccion: t.satisfaction
    }));

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
              Nuevo Ticket
            </Button>
          </div>
        </div>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estado de Tickets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Estado de Tickets
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Tickets por Categoría */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Tickets por Categoría
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Tickets por Prioridad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Tickets por Prioridad
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Satisfacción del Cliente */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <LineChart className="h-5 w-5 mr-2" />
                Satisfacción del Cliente
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={satisfactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="fecha" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="satisfaccion" stroke="#8884d8" />
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
                placeholder="Buscar tickets..."
                className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Lista de Tickets */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="text-left p-4">Cliente</th>
                  <th className="text-left p-4">Problema</th>
                  <th className="text-left p-4">Estado</th>
                  <th className="text-left p-4">Responsable</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border"
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Ticket className="h-5 w-5 text-primary" />
                        <span className="font-medium">{ticket.client}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm line-clamp-2">{ticket.problem}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4">{ticket.responsible}</td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(ticket)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(ticket.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No hay tickets registrados. Haz clic en "Nuevo Ticket" para comenzar.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <TicketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTicket(null);
        }}
        onSave={handleSave}
        ticket={selectedTicket}
      />
    </div>
  );
}

export default TicketsListing;
