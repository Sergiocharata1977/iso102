
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
  Clipboard,
} from "lucide-react";
import PuntoNormaModal from "./PuntoNormaModal";

function PuntosNormaListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [puntosNorma, setPuntosNorma] = useState(() => {
    const saved = localStorage.getItem("puntosNorma");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = (puntoData) => {
    let updatedPuntos;
    if (selectedPunto) {
      updatedPuntos = puntosNorma.map(p => 
        p.id === selectedPunto.id ? { ...puntoData, id: selectedPunto.id } : p
      );
      toast({
        title: "Punto actualizado",
        description: "Los datos del punto han sido actualizados exitosamente"
      });
    } else {
      updatedPuntos = [...puntosNorma, { ...puntoData, id: Date.now() }];
      toast({
        title: "Punto creado",
        description: "Se ha agregado un nuevo punto exitosamente"
      });
    }
    setPuntosNorma(updatedPuntos);
    localStorage.setItem("puntosNorma", JSON.stringify(updatedPuntos));
    setIsModalOpen(false);
    setSelectedPunto(null);
  };

  const handleEdit = (punto) => {
    setSelectedPunto(punto);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const updatedPuntos = puntosNorma.filter(p => p.id !== id);
    setPuntosNorma(updatedPuntos);
    localStorage.setItem("puntosNorma", JSON.stringify(updatedPuntos));
    toast({
      title: "Punto eliminado",
      description: "El punto ha sido eliminado exitosamente"
    });
  };

  const filteredPuntos = puntosNorma.filter(punto =>
    punto.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar puntos de la norma..."
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
            Nuevo Punto
          </Button>
        </div>
      </div>

      {/* Lista de Puntos */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-4">Título</th>
              <th className="text-left p-4">Norma</th>
              <th className="text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredPuntos.map((punto) => (
              <motion.tr
                key={punto.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-border"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <Clipboard className="h-5 w-5 text-primary" />
                    <span className="font-medium">{punto.titulo}</span>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-sm line-clamp-2">{punto.norma}</p>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(punto)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(punto.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredPuntos.length === 0 && (
          <div className="text-center py-12">
            <Clipboard className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No hay puntos registrados. Haz clic en "Nuevo Punto" para comenzar.
            </p>
          </div>
        )}
      </div>

      <PuntoNormaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPunto(null);
        }}
        onSave={handleSave}
        punto={selectedPunto}
      />
    </div>
  );
}

export default PuntosNormaListing;
