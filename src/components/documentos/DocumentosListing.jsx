
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Plus, 
  Search, 
  Download, 
  Pencil, 
  Trash2, 
  FileText,
  ChevronRight
} from "lucide-react";
import DocumentoModal from "./DocumentoModal";
import DocumentoSingle from "./DocumentoSingle";

function DocumentosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSingle, setShowSingle] = useState(false);
  const [currentDocumento, setCurrentDocumento] = useState(null);

  const [documentos, setDocumentos] = useState(() => {
    const saved = localStorage.getItem("documentos");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = (documentoData) => {
    try {
      let updatedDocumentos;
      if (selectedDocumento) {
        updatedDocumentos = documentos.map(d => 
          d.id === selectedDocumento.id ? { ...documentoData, id: selectedDocumento.id } : d
        );
        toast({
          title: "Documento actualizado",
          description: "Los datos del documento han sido actualizados exitosamente"
        });
      } else {
        const newDoc = { 
          ...documentoData, 
          id: Date.now(),
          fechaCreacion: new Date().toISOString()
        };
        updatedDocumentos = [...documentos, newDoc];
        toast({
          title: "Documento creado",
          description: "Se ha agregado un nuevo documento exitosamente"
        });
      }
      setDocumentos(updatedDocumentos);
      localStorage.setItem("documentos", JSON.stringify(updatedDocumentos));
      setIsModalOpen(false);
      setSelectedDocumento(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el documento",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (documento) => {
    setSelectedDocumento(documento);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    try {
      const updatedDocumentos = documentos.filter(d => d.id !== id);
      setDocumentos(updatedDocumentos);
      localStorage.setItem("documentos", JSON.stringify(updatedDocumentos));
      toast({
        title: "Documento eliminado",
        description: "El documento ha sido eliminado exitosamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el documento",
        variant: "destructive"
      });
    }
  };

  const handleViewDocumento = (documento) => {
    setCurrentDocumento(documento);
    setShowSingle(true);
  };

  const filteredDocumentos = documentos.filter(documento =>
    documento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    documento.procesos.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showSingle) {
    return (
      <DocumentoSingle
        documento={currentDocumento}
        onBack={() => setShowSingle(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              className="pl-8 h-10 w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Documento
          </Button>
        </div>
      </div>

      {/* Lista de Documentos */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-4">Título</th>
              <th className="text-left p-4">Procesos</th>
              <th className="text-left p-4">Versión</th>
              <th className="text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocumentos.map((documento) => (
              <motion.tr
                key={documento.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-border cursor-pointer hover:bg-accent/50"
                onClick={() => handleViewDocumento(documento)}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{documento.titulo}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </td>
                <td className="p-4">{documento.procesos}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-primary/10 rounded-full text-xs text-primary">
                    v{documento.version}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(documento);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(documento.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredDocumentos.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No hay documentos registrados. Haz clic en "Nuevo Documento" para comenzar.
            </p>
          </div>
        )}
      </div>

      <DocumentoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDocumento(null);
        }}
        onSave={handleSave}
        documento={selectedDocumento}
      />
    </div>
  );
}

export default DocumentosListing;
