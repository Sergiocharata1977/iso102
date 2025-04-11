
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

function EvaluacionModal({ isOpen, onClose, onSave, evaluacion }) {
  const [formData, setFormData] = useState({
    empleado: "",
    evaluador: "",
    fecha: "",
    periodo: "",
    resultado: "",
    desempeno: "",
    objetivos: "",
    competencias: "",
    fortalezas: "",
    oportunidades: "",
    planAccion: "",
    comentarios: ""
  });

  useEffect(() => {
    if (evaluacion) {
      setFormData(evaluacion);
    } else {
      setFormData({
        empleado: "",
        evaluador: "",
        fecha: "",
        periodo: "",
        resultado: "",
        desempeno: "",
        objetivos: "",
        competencias: "",
        fortalezas: "",
        oportunidades: "",
        planAccion: "",
        comentarios: ""
      });
    }
  }, [evaluacion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {evaluacion ? "Editar Evaluación" : "Nueva Evaluación"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empleado">Empleado</Label>
              <Input
                id="empleado"
                value={formData.empleado}
                onChange={(e) => setFormData({ ...formData, empleado: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluador">Evaluador</Label>
              <Input
                id="evaluador"
                value={formData.evaluador}
                onChange={(e) => setFormData({ ...formData, evaluador: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha de Evaluación</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodo">Periodo</Label>
              <Input
                id="periodo"
                value={formData.periodo}
                onChange={(e) => setFormData({ ...formData, periodo: e.target.value })}
                required
                placeholder="Ej: 2025-Q1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resultado">Resultado (%)</Label>
              <Input
                id="resultado"
                type="number"
                min="0"
                max="100"
                value={formData.resultado}
                onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="desempeno">Desempeño General</Label>
            <Input
              id="desempeno"
              value={formData.desempeno}
              onChange={(e) => setFormData({ ...formData, desempeno: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="objetivos">Cumplimiento de Objetivos</Label>
            <Input
              id="objetivos"
              value={formData.objetivos}
              onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="competencias">Competencias Evaluadas</Label>
            <Input
              id="competencias"
              value={formData.competencias}
              onChange={(e) => setFormData({ ...formData, competencias: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fortalezas">Fortalezas</Label>
            <Input
              id="fortalezas"
              value={formData.fortalezas}
              onChange={(e) => setFormData({ ...formData, fortalezas: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="oportunidades">Oportunidades de Mejora</Label>
            <Input
              id="oportunidades"
              value={formData.oportunidades}
              onChange={(e) => setFormData({ ...formData, oportunidades: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="planAccion">Plan de Acción</Label>
            <Input
              id="planAccion"
              value={formData.planAccion}
              onChange={(e) => setFormData({ ...formData, planAccion: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comentarios">Comentarios Adicionales</Label>
            <Input
              id="comentarios"
              value={formData.comentarios}
              onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {evaluacion ? "Guardar Cambios" : "Crear Evaluación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EvaluacionModal;
