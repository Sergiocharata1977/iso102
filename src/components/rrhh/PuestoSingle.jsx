
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Building2,
  Pencil,
  Trash2,
  Users,
  Target,
  ClipboardList,
  Shield,
  GraduationCap,
  Briefcase,
  Star
} from "lucide-react";

function PuestoSingle({ puesto, onBack, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Puestos
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(puesto)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => {
            onDelete(puesto.id);
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
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{puesto.nombre}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    Código: {puesto.codigo}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    Supervisor: {puesto.supervisor}
                  </span>
                </div>
                <div className="mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    puesto.estado === "activo"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {puesto.estado}
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
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-muted-foreground whitespace-pre-line">{puesto.descripcion}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Requisitos</h2>
              <p className="text-muted-foreground whitespace-pre-line">{puesto.requisitos}</p>
            </div>
          </motion.div>

          {/* Funciones y Responsabilidades */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <ClipboardList className="h-5 w-5 mr-2" />
                Funciones
              </h2>
              <div className="space-y-2">
                {puesto.funciones?.split('\n').map((funcion, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary" />
                    <span className="flex-1">{funcion}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <Shield className="h-5 w-5 mr-2" />
                Responsabilidades
              </h2>
              <div className="space-y-2">
                {puesto.responsabilidades?.split('\n').map((responsabilidad, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary" />
                    <span className="flex-1">{responsabilidad}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - 1 columna */}
        <div className="space-y-6">
          {/* Competencias */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Star className="h-5 w-5 mr-2" />
              Competencias
            </h2>
            <div className="space-y-2">
              {puesto.competencias?.split('\n').map((competencia, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>{competencia}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Formación y Experiencia */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <GraduationCap className="h-5 w-5 mr-2" />
              Formación Requerida
            </h2>
            <p className="text-muted-foreground mb-4">{puesto.formacion}</p>

            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Briefcase className="h-5 w-5 mr-2" />
              Experiencia Requerida
            </h2>
            <p className="text-muted-foreground">{puesto.experiencia}</p>
          </motion.div>

          {/* Personal Actual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Users className="h-5 w-5 mr-2" />
              Personal Actual
            </h2>
            <div className="space-y-2">
              {puesto.personal?.length > 0 ? (
                puesto.personal.map((persona, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p>{persona.nombre}</p>
                      <p className="text-sm text-muted-foreground">{persona.departamento}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay personal asignado actualmente</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PuestoSingle;
