
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft,
  FileText,
  Pencil,
  Trash2,
  Users,
  Building,
  Link
} from "lucide-react";

function DocumentoSingle({ documento, onBack, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Documentos
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => onEdit(documento)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => {
            onDelete(documento.id);
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
              <div className="bg-primary/10 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{documento.titulo}</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  Creado el {new Date(documento.fechaCreacion).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Resumen y Detalle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 space-y-6"
          >
            <div>
              <h2 className="text-lg font-semibold mb-2">Resumen</h2>
              <p className="text-muted-foreground">{documento.resumen}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Detalle</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {documento.detalle}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar - Relaciones */}
        <div className="space-y-6">
          {/* Procesos Relacionados */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Link className="h-5 w-5 mr-2" />
              Procesos Relacionados
            </h2>
            <div className="space-y-3">
              {documento.procesosRelacionados?.length > 0 ? (
                documento.procesosRelacionados.map((proceso, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{proceso.titulo}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay procesos relacionados</p>
              )}
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
              <Building className="h-5 w-5 mr-2" />
              Departamentos Relacionados
            </h2>
            <div className="space-y-3">
              {documento.departamentosRelacionados?.length > 0 ? (
                documento.departamentosRelacionados.map((depto, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{depto.nombre}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay departamentos relacionados</p>
              )}
            </div>
          </motion.div>

          {/* Personas Relacionadas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Users className="h-5 w-5 mr-2" />
              Personas Relacionadas
            </h2>
            <div className="space-y-3">
              {documento.personasRelacionadas?.length > 0 ? (
                documento.personasRelacionadas.map((persona, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{persona.nombre}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay personas relacionadas</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DocumentoSingle;
