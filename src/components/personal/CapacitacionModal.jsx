
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
import { useState, useEffect } from "react";

function CapacitacionModal({ isOpen, onClose, onSave, capacitacion }) {
  const [formData, setFormData] = useState({
    titulo: "",
    instructor: "",
    fecha: "",
    duracion: "",
    descripcion: "",
    objetivos: "",
    participantes: "",
    resultados: "",
    observaciones: ""
  });

  useEffect(() => {
    if (capacitacion) {
      setFormData(capacitacion);
    } else {
      setFormData({
        titulo: "",
        instructor: "",
        fecha: "",
        duracion: "",
        descripcion: "",
        objetivos: "",
        participantes: "",
        resultados: "",
        observaciones: ""
      });
    }
  }, [capacitacion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {capacitacion ? "Editar Capacitación" : "Nueva Capacitación"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título de la Capacitación</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duracion">Duración</Label>
              <Input
                id="duracion"
                value={formData.duracion}
                onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                required
                placeholder="Ej: 4 horas"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="objetivos">Objetivos</Label>
            <Input
              id="objetivos"
              value={formData.objetivos}
              onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="participantes">Participantes</Label>
            <Input
              id="participantes"
              value={formData.participantes}
              onChange={(e) => setFormData({ ...formData, participantes: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resultados">Resultados</Label>
            <Input
              id="resultados"
              value={formData.resultados}
              onChange={(e) => setFormData({ ...formData, resultados: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Input
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {capacitacion ? "Guardar Cambios" : "Crear Capacitación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CapacitacionModal;
