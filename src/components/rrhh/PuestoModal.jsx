
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

function PuestoModal({ isOpen, onClose, onSave, puesto }) {
  const [formData, setFormData] = useState({
    nombre: "",
    departamento: "",
    supervisor: "",
    nivel: "",
    descripcion: "",
    requisitos: "",
    competencias: "",
    funciones: "",
    responsabilidades: "",
    experiencia: "",
    formacion: "",
    estado: "activo"
  });

  const [departamentos, setDepartamentos] = useState(() => {
    const saved = localStorage.getItem("departamentos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (puesto) {
      setFormData(puesto);
    } else {
      setFormData({
        nombre: "",
        departamento: "",
        supervisor: "",
        nivel: "",
        descripcion: "",
        requisitos: "",
        competencias: "",
        funciones: "",
        responsabilidades: "",
        experiencia: "",
        formacion: "",
        estado: "activo"
      });
    }
  }, [puesto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {puesto ? "Editar Puesto" : "Nuevo Puesto"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Puesto</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <select
                id="departamento"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                required
              >
                <option value="">Seleccione un departamento</option>
                {departamentos.map((departamento) => (
                  <option key={departamento.id} value={departamento.nombre}>
                    {departamento.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nivel">Nivel</Label>
              <Input
                id="nivel"
                value={formData.nivel}
                onChange={(e) => setFormData({ ...formData, nivel: e.target.value })}
                required
                placeholder="Ej: Gerencial, Supervisión, Operativo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción del Puesto</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requisitos">Requisitos</Label>
            <Textarea
              id="requisitos"
              value={formData.requisitos}
              onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
              required
              className="min-h-[100px]"
              placeholder="Lista los requisitos necesarios para el puesto..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="competencias">Competencias</Label>
            <Textarea
              id="competencias"
              value={formData.competencias}
              onChange={(e) => setFormData({ ...formData, competencias: e.target.value })}
              required
              className="min-h-[100px]"
              placeholder="Lista las competencias requeridas (una por línea)..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="funciones">Funciones</Label>
            <Textarea
              id="funciones"
              value={formData.funciones}
              onChange={(e) => setFormData({ ...formData, funciones: e.target.value })}
              required
              className="min-h-[100px]"
              placeholder="Lista las funciones principales (una por línea)..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsabilidades">Responsabilidades</Label>
            <Textarea
              id="responsabilidades"
              value={formData.responsabilidades}
              onChange={(e) => setFormData({ ...formData, responsabilidades: e.target.value })}
              required
              className="min-h-[100px]"
              placeholder="Lista las responsabilidades principales (una por línea)..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experiencia">Experiencia Requerida</Label>
              <Input
                id="experiencia"
                value={formData.experiencia}
                onChange={(e) => setFormData({ ...formData, experiencia: e.target.value })}
                required
                placeholder="Ej: 3 años en puestos similares"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="formacion">Formación Requerida</Label>
              <Input
                id="formacion"
                value={formData.formacion}
                onChange={(e) => setFormData({ ...formData, formacion: e.target.value })}
                required
                placeholder="Ej: Licenciatura en Administración"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <select
              id="estado"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {puesto ? "Guardar Cambios" : "Crear Puesto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PuestoModal;
