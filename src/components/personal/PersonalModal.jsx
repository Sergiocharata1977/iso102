
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Camera, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";

function PersonalModal({ isOpen, onClose, onSave, person }) {
  const [formData, setFormData] = useState({
    numero: "",
    nombre: "",
    puesto: "",
    departamento: "",
    email: "",
    telefono: "",
    fechaIngreso: "",
    documentoIdentidad: "",
    direccion: "",
    formacionAcademica: [],
    experienciaLaboral: [],
    competencias: "",
    evaluacionDesempeno: "",
    capacitacionesRecibidas: "",
    observaciones: "",
    imagen: null,
    imagenPreview: null
  });

  const [puestos, setPuestos] = useState(() => {
    const saved = localStorage.getItem("puestos");
    return saved ? JSON.parse(saved) : [];
  });

  const [departamentos, setDepartamentos] = useState(() => {
    const saved = localStorage.getItem("departamentos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (person) {
      setFormData({
        ...person,
        imagenPreview: person.imagen
      });
    } else {
      // Generar número automático
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setFormData({
        ...formData,
        numero: `P${year}${month}-${random}`,
        formacionAcademica: [],
        experienciaLaboral: []
      });
    }
  }, [person]);

  const onDrop = async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0];
      
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagen: reader.result,
          imagenPreview: reader.result
        }));
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const addFormacionAcademica = () => {
    setFormData(prev => ({
      ...prev,
      formacionAcademica: [
        ...prev.formacionAcademica,
        {
          titulo: "",
          institucion: "",
          anioFinalizacion: "",
          descripcion: ""
        }
      ]
    }));
  };

  const removeFormacionAcademica = (index) => {
    setFormData(prev => ({
      ...prev,
      formacionAcademica: prev.formacionAcademica.filter((_, i) => i !== index)
    }));
  };

  const updateFormacionAcademica = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      formacionAcademica: prev.formacionAcademica.map((formacion, i) => 
        i === index ? { ...formacion, [field]: value } : formacion
      )
    }));
  };

  const addExperienciaLaboral = () => {
    setFormData(prev => ({
      ...prev,
      experienciaLaboral: [
        ...prev.experienciaLaboral,
        {
          empresa: "",
          puesto: "",
          fechaInicio: "",
          fechaFin: "",
          descripcion: ""
        }
      ]
    }));
  };

  const removeExperienciaLaboral = (index) => {
    setFormData(prev => ({
      ...prev,
      experienciaLaboral: prev.experienciaLaboral.filter((_, i) => i !== index)
    }));
  };

  const updateExperienciaLaboral = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experienciaLaboral: prev.experienciaLaboral.map((experiencia, i) => 
        i === index ? { ...experiencia, [field]: value } : experiencia
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {person ? "Editar Personal" : "Nuevo Personal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="informacion" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="informacion">Información General</TabsTrigger>
              <TabsTrigger value="formacion">Formación Académica</TabsTrigger>
              <TabsTrigger value="experiencia">Experiencia Laboral</TabsTrigger>
            </TabsList>

            <TabsContent value="informacion" className="space-y-4 mt-4">
              {/* Foto de perfil */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div
                    {...getRootProps()}
                    className="w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-primary/50 hover:border-primary transition-colors cursor-pointer flex items-center justify-center bg-muted"
                  >
                    <input {...getInputProps()} />
                    {formData.imagenPreview ? (
                      <img
                        src={formData.imagenPreview}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          Haz clic para subir foto
                        </p>
                      </div>
                    )}
                  </div>
                  {formData.imagenPreview && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData(prev => ({
                          ...prev,
                          imagen: null,
                          imagenPreview: null
                        }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número de Personal</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentoIdentidad">Documento de Identidad</Label>
                  <Input
                    id="documentoIdentidad"
                    value={formData.documentoIdentidad}
                    onChange={(e) => setFormData({ ...formData, documentoIdentidad: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="puesto">Puesto</Label>
                  <select
                    id="puesto"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={formData.puesto}
                    onChange={(e) => setFormData({ ...formData, puesto: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un puesto</option>
                    {puestos.map((puesto) => (
                      <option key={puesto.id} value={puesto.nombre}>
                        {puesto.nombre}
                      </option>
                    ))}
                  </select>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fechaIngreso">Fecha de Ingreso</Label>
                  <Input
                    id="fechaIngreso"
                    type="date"
                    value={formData.fechaIngreso}
                    onChange={(e) => setFormData({ ...formData, fechaIngreso: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="formacion" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Formación Académica</h3>
                <Button type="button" onClick={addFormacionAcademica} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Formación
                </Button>
              </div>

              {formData.formacionAcademica.map((formacion, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">Formación #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFormacionAcademica(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Título</Label>
                      <Input
                        value={formacion.titulo}
                        onChange={(e) => updateFormacionAcademica(index, 'titulo', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Institución</Label>
                      <Input
                        value={formacion.institucion}
                        onChange={(e) => updateFormacionAcademica(index, 'institucion', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Año de Finalización</Label>
                      <Input
                        type="number"
                        min="1900"
                        max="2100"
                        value={formacion.anioFinalizacion}
                        onChange={(e) => updateFormacionAcademica(index, 'anioFinalizacion', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input
                      value={formacion.descripcion}
                      onChange={(e) => updateFormacionAcademica(index, 'descripcion', e.target.value)}
                      placeholder="Descripción adicional..."
                    />
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="experiencia" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Experiencia Laboral</h3>
                <Button type="button" onClick={addExperienciaLaboral} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Experiencia
                </Button>
              </div>

              {formData.experienciaLaboral.map((experiencia, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">Experiencia #{index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperienciaLaboral(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Empresa</Label>
                      <Input
                        value={experiencia.empresa}
                        onChange={(e) => updateExperienciaLaboral(index, 'empresa', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Puesto</Label>
                      <Input
                        value={experiencia.puesto}
                        onChange={(e) => updateExperienciaLaboral(index, 'puesto', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha de Inicio</Label>
                      <Input
                        type="date"
                        value={experiencia.fechaInicio}
                        onChange={(e) => updateExperienciaLaboral(index, 'fechaInicio', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de Fin</Label>
                      <Input
                        type="date"
                        value={experiencia.fechaFin}
                        onChange={(e) => updateExperienciaLaboral(index, 'fechaFin', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input
                      value={experiencia.descripcion}
                      onChange={(e) => updateExperienciaLaboral(index, 'descripcion', e.target.value)}
                      placeholder="Descripción de responsabilidades..."
                    />
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {person ? "Guardar Cambios" : "Crear Personal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PersonalModal;
