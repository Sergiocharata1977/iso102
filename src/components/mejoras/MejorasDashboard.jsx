
import React from "react";
import { motion } from "framer-motion";
import { 
  ArrowUpCircle, 
  Wrench, 
  Search, 
  ShieldCheck, 
  Shield, 
  ClipboardCheck, 
  CheckCircle2,
  BarChart2,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

function MejorasDashboard({ mejoras }) {
  const [procesoFiltro, setProcesoFiltro] = React.useState("");
  const [procesos, setProcesos] = React.useState([]);

  React.useEffect(() => {
    // Cargar procesos
    const saved = localStorage.getItem("procesos");
    if (saved) {
      setProcesos(JSON.parse(saved));
    }
  }, []);

  // Obtener la fecha de hace un mes
  const unMesAtras = new Date();
  unMesAtras.setMonth(unMesAtras.getMonth() - 1);

  // Filtrar mejoras por proceso y último mes
  const mejorasFiltradas = mejoras.filter(mejora => 
    new Date(mejora.fechaCreacion) >= unMesAtras &&
    (!procesoFiltro || mejora.proceso_involucrado === procesoFiltro)
  );

  // Contar mejoras por estado
  const contarPorEstado = (estado) => {
    return mejorasFiltradas.filter(mejora => mejora.estado === estado).length;
  };

  const estados = [
    { 
      nombre: 'Hallazgo', 
      icono: ArrowUpCircle, 
      color: 'bg-blue-100', 
      textColor: 'text-blue-800',
      cantidad: contarPorEstado('Hallazgo')
    },
    { 
      nombre: 'Corrección', 
      icono: Wrench, 
      color: 'bg-yellow-100', 
      textColor: 'text-yellow-800',
      cantidad: contarPorEstado('Corrección')
    },
    { 
      nombre: 'Análisis de Causas', 
      icono: Search, 
      color: 'bg-purple-100', 
      textColor: 'text-purple-800',
      cantidad: contarPorEstado('Análisis de Causas')
    },
    { 
      nombre: 'Acción Correctiva', 
      icono: ShieldCheck, 
      color: 'bg-green-100', 
      textColor: 'text-green-800',
      cantidad: contarPorEstado('Acción Correctiva')
    },
    { 
      nombre: 'Acción Preventiva', 
      icono: Shield, 
      color: 'bg-indigo-100', 
      textColor: 'text-indigo-800',
      cantidad: contarPorEstado('Acción Preventiva')
    },
    { 
      nombre: 'Planificación control', 
      icono: ClipboardCheck, 
      color: 'bg-orange-100', 
      textColor: 'text-orange-800',
      cantidad: contarPorEstado('Planificación control')
    },
    { 
      nombre: 'Control Hecho', 
      icono: CheckCircle2, 
      color: 'bg-emerald-100', 
      textColor: 'text-emerald-800',
      cantidad: contarPorEstado('Control Hecho')
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Resumen del Último Mes</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
          <span className="text-sm text-muted-foreground">
            {unMesAtras.toLocaleDateString()} - {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {estados.map((estado, index) => (
          <motion.div
            key={estado.nombre}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${estado.color} rounded-lg p-4 flex flex-col items-center justify-center text-center`}
          >
            <estado.icono className={`h-8 w-8 ${estado.textColor} mb-2`} />
            <span className={`text-2xl font-bold ${estado.textColor}`}>
              {estado.cantidad}
            </span>
            <span className={`text-sm ${estado.textColor} mt-1`}>
              {estado.nombre}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2" />
          Distribución de Mejoras
        </h3>
        <div className="h-64">
          <div className="flex items-end h-full space-x-4">
            {estados.map((estado, index) => {
              const porcentaje = (estado.cantidad / (mejorasFiltradas.length || 1)) * 100;
              return (
                <motion.div
                  key={estado.nombre}
                  className="flex-1 flex flex-col items-center"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(porcentaje, 5)}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <div 
                    className={`w-full ${estado.color} rounded-t-lg`}
                    style={{ height: '100%' }}
                  />
                  <span className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-top-left">
                    {estado.nombre}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MejorasDashboard;
