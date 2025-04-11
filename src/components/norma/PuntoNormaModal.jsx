
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

function PuntoNormaModal({ isOpen, onClose, onSave, punto }) {
  const [formData, setFormData] = useState({
    titulo: "",
    norma: "",
    explicacion: ""
  });

  useEffect(() => {
    if (punto) {
      setFormData(punto);
    } else {
      setFormData({
        titulo: "",
        norma: "",
        explicacion: ""
      });
    }
  }, [punto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {punto ? "Editar Punto de la Norma" : "Nuevo Punto de la Norma"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="norma">Norma</Label>
              <Textarea
                id="norma"
                value={formData.norma}
                onChange={(e) => setFormData({ ...formData, norma: e.target.value })}
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="explicacion">Explicación</Label>
              <Textarea
                id="explicacion"
                value={formData.explicacion}
                onChange={(e) => setFormData({ ...formData, explicacion: e.target.value })}
                required
                className="min-h-[200px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {punto ? "Guardar Cambios" : "Crear Punto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PuntoNormaModal;
