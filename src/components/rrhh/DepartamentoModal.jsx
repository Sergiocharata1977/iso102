
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

function DepartamentoModal({ isOpen, onClose, onSave, departamento, departamentos }) {
  const [formData, setFormData] = useState({
    nombre: "",
    responsable: "",
    descripcion: "",
    objetivos: "",
    departamentoPadreId: "",
    email: "",
    telefono: "",
    ubicacion: "",
    presupuesto: "",
    fechaCreacion: "",
    estado: "activo"
  });

  useEffect(() => {
    if (departamento) {
      setFormData(departamento);
    } else {
      setFormData({
        nombre: "",
        responsable: "",
        descripcion: "",
        objetivos: "",
        departamentoPadreId: "",
        email: "",
        telefono: "",
        ubicacion: "",
        presupuesto: "",
        fechaCreacion: new Date().toISOString().split('T')[0],
        estado: "activo"
      });
    }
  }, [departamento]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const departamentosPadre = departamentos.filter(d => 
    d.id !== departamento?.id && !isDescendant(d.id, departamento?.id, departamentos)
  );

  function isDescendant(parentId, childId, deps) {
    if (!childId) return false;
    const child = deps.find(d => d.id === childId);
    if (!child) return false;
    if (child.departamentoPadreId === parentId) return true;
    return isDescendant(parentId, child.departamentoPadreId, deps);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {departamento ? "Editar Departamento" : "Nuevo Departamento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Departamento</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                value={formData.responsable}
                onChange={(e) => setFormData({ ...formData, responsable: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departamentoPadreId">Departamento Superior</Label>
              <select
                id="departamentoPadreId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.departamentoPadreId}
                onChange={(e) => setFormData({ ...formData, departamentoPadreId: e.target.value })}
              >
                <option value="">Ninguno (Departamento Principal)</option>
                {departamentosPadre.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación</Label>
              <Input
                id="ubicacion"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                required
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="presupuesto">Presupuesto Anual</Label>
              <Input
                id="presupuesto"
                type="number"
                value={formData.presupuesto}
                onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaCreacion">Fecha de Creación</Label>
              <Input
                id="fechaCreacion"
                type="date"
                value={formData.fechaCreacion}
                onChange={(e) => setFormData({ ...formData, fechaCreacion: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {departamento ? "Guardar Cambios" : "Crear Departamento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DepartamentoModal;
