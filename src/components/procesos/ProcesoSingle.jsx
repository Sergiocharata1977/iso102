
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  FileText,
  Pencil,
  Trash2,
  Target,
  BarChart2,
  Ruler,
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  Link
} from "lucide-react";

function ProcesoSingle({ proceso, onBack, onEdit, onDelete }) {
  const [expandedSections, setExpandedSections] = React.useState({
    objetivos: true,
    indicadores: true,
    mediciones: true
  });

  const [objetivos] = React.useState(() => {
    const saved = localStorage.getItem("objetivos");
    return saved ? JSON.parse(saved).filter(obj => obj.proceso === proceso.titulo) : [];
  });

  const [indicadores] = React.useState(() => {
    const saved = localStorage.getItem("indicadores");
    return saved ? JSON.parse(saved) : [];
  });

  const [mediciones] = React.useState(() => {
    const saved = localStorage.getItem("mediciones");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Procesos
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(proceso)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => {
            onDelete(proceso.id);
            onBack();
          }}>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Header Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{proceso.titulo}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    Código: {proceso.codigo}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-1" />
                    Versión {proceso.version}
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    proceso.estado === "activo" 
                      ? "bg-green-100 text-green-800"
                      : proceso.estado === "revision"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {proceso.estado}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Descripción y Detalles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">Objetivo</h2>
              <p className="text-muted-foreground whitespace-pre-line">{proceso.objetivo}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Alcance</h2>
              <p className="text-muted-foreground whitespace-pre-line">{proceso.alcance}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-line">{proceso.descripcion}</p>
            </div>
          </motion.div>

          {/* Entradas y Salidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <ChevronRight className="h-5 w-5 mr-2" />
                Entradas
              </h2>
              <div className="space-y-2">
                {proceso.entradas?.split('\n').map((entrada, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary" />
                    <span className="flex-1">{entrada}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <ChevronRight className="h-5 w-5 mr-2" />
                Salidas
              </h2>
              <div className="space-y-2">
                {proceso.salidas?.split('\n').map((salida, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary" />
                    <span className="flex-1">{salida}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Objetivos de Calidad */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('objetivos')}
            >
              <h2 className="text-lg font-semibold flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Objetivos de Calidad
              </h2>
              {expandedSections.objetivos ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
            {expandedSections.objetivos && (
              <div className="mt-4 space-y-4">
                {objetivos.map((objetivo) => (
                  <div key={objetivo.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{objetivo.titulo}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {objetivo.descripcion}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Indicadores relacionados */}
                    <div className="mt-4 pl-4 border-l border-border">
                      <h4 className="text-sm font-medium flex items-center mb-2">
                        <BarChart2 className="h-4 w-4 mr-1" />
                        Indicadores
                      </h4>
                      <div className="space-y-2">
                        {indicadores
                          .filter(ind => ind.objetivo === objetivo.id)
                          .map((indicador) => (
                            <div key={indicador.id} className="bg-muted rounded-lg p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm font-medium">{indicador.titulo}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Meta: {indicador.meta}
                                  </p>
                                </div>
                                <Button variant="ghost" size="icon">
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Última medición */}
                              {mediciones
                                .filter(med => med.indicador === indicador.id)
                                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
                                .slice(0, 1)
                                .map((medicion) => (
                                  <div key={medicion.id} className="mt-2 pl-4 border-l border-border">
                                    <p className="text-xs text-muted-foreground">
                                      Última medición: {medicion.valor} ({new Date(medicion.fecha).toLocaleDateString()})
                                    </p>
                                  </div>
                                ))}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
                {objetivos.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No hay objetivos de calidad asociados a este proceso.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar - 1 columna */}
        <div className="space-y-6">
          {/* Responsables */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Users className="h-5 w-5 mr-2" />
              Responsables
            </h2>
            <div className="space-y-2">
              {proceso.responsables?.split('\n').map((responsable, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{responsable}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Departamentos Relacionados */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Building2 className="h-5 w-5 mr-2" />
              Departamentos Relacionados
            </h2>
            <div className="space-y-2">
              {proceso.departamentos?.map((departamento, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{departamento}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Documentos Relacionados */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Link className="h-5 w-5 mr-2" />
              Documentos Relacionados
            </h2>
            <div className="space-y-2">
              {proceso.documentos?.map((documento, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{documento}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ProcesoSingle;
