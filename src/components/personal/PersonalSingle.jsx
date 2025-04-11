
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  Users,
  Pencil,
  Trash2,
  Building2,
  GraduationCap,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Briefcase,
  Star,
  BarChart2
} from "lucide-react";

function PersonalSingle({ persona, onBack, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Personal
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(persona)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => {
            onDelete(persona.id);
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
              <div className="w-24 h-24 rounded-lg overflow-hidden">
                <img 
                  src={persona.imagen || "https://images.unsplash.com/photo-1578390432942-d323db577792"}
                  alt={`Foto de ${persona.nombre}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{persona.nombre}</h1>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    {persona.puesto}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 mr-1" />
                    {persona.departamento}
                  </span>
                </div>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-1" />
                    {persona.email}
                  </span>
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-1" />
                    {persona.telefono}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Información Personal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 space-y-4"
          >
            <h2 className="text-lg font-semibold flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Información Personal
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Documento de Identidad</p>
                <p>{persona.documentoIdentidad}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                <p>{new Date(persona.fechaIngreso).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p>{persona.direccion}</p>
              </div>
            </div>
          </motion.div>

          {/* Formación y Experiencia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <GraduationCap className="h-5 w-5 mr-2" />
                Formación Académica
              </h2>
              <div className="space-y-4">
                {persona.formacionAcademica?.map((formacion, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium">{formacion.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{formacion.institucion}</p>
                    <p className="text-sm text-muted-foreground">Año: {formacion.anioFinalizacion}</p>
                    {formacion.descripcion && (
                      <p className="text-sm text-muted-foreground">{formacion.descripcion}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold flex items-center mb-4">
                <Briefcase className="h-5 w-5 mr-2" />
                Experiencia Laboral
              </h2>
              <div className="space-y-4">
                {persona.experienciaLaboral?.map((experiencia, index) => (
                  <div key={index} className="space-y-2">
                    <h3 className="font-medium">{experiencia.puesto}</h3>
                    <p className="text-sm text-muted-foreground">{experiencia.empresa}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(experiencia.fechaInicio).toLocaleDateString()} - 
                      {experiencia.fechaFin ? new Date(experiencia.fechaFin).toLocaleDateString() : 'Actual'}
                    </p>
                    {experiencia.descripcion && (
                      <p className="text-sm text-muted-foreground">{experiencia.descripcion}</p>
                    )}
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
              {persona.competencias?.split('\n').map((competencia, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span>{competencia}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Evaluación de Desempeño */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <BarChart2 className="h-5 w-5 mr-2" />
              Evaluación de Desempeño
            </h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {persona.evaluacionDesempeno}
            </p>
          </motion.div>

          {/* Capacitaciones */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <BookOpen className="h-5 w-5 mr-2" />
              Capacitaciones Recibidas
            </h2>
            <div className="space-y-2">
              {persona.capacitacionesRecibidas?.split('\n').map((capacitacion, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{capacitacion}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default PersonalSingle;
