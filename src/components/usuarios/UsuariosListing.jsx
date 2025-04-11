
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
  Users,
  Shield
} from "lucide-react";
import UsuarioModal from "./UsuarioModal";

function UsuariosListing() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [usuarios, setUsuarios] = useState(() => {
    const saved = localStorage.getItem("usuarios");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSave = (usuarioData) => {
    let updatedUsuarios;
    if (selectedUsuario) {
      updatedUsuarios = usuarios.map(u => 
        u.id === selectedUsuario.id ? { ...usuarioData, id: selectedUsuario.id } : u
      );
      toast({
        title: "Usuario actualizado",
        description: "Los datos del usuario han sido actualizados exitosamente"
      });
    } else {
      updatedUsuarios = [...usuarios, { ...usuarioData, id: Date.now() }];
      toast({
        title: "Usuario creado",
        description: "Se ha agregado un nuevo usuario exitosamente"
      });
    }
    setUsuarios(updatedUsuarios);
    localStorage.setItem("usuarios", JSON.stringify(updatedUsuarios));
    setIsModalOpen(false);
    setSelectedUsuario(null);
  };

  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    const updatedUsuarios = usuarios.filter(u => u.id !== id);
    setUsuarios(updatedUsuarios);
    localStorage.setItem("usuarios", JSON.stringify(updatedUsuarios));
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado exitosamente"
    });
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
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
              placeholder="Buscar usuarios..."
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
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left p-4">Usuario</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Rol</th>
              <th className="text-left p-4">Permisos</th>
              <th className="text-right p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsuarios.map((usuario) => (
              <motion.tr
                key={usuario.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-border"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-medium">{usuario.nombre}</span>
                  </div>
                </td>
                <td className="p-4">{usuario.email}</td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <Shield className="w-3 h-3 mr-1" />
                    {usuario.rol}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {usuario.permisos.map((permiso, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary-foreground"
                      >
                        {permiso}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(usuario)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(usuario.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredUsuarios.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              No hay usuarios registrados. Haz clic en "Nuevo Usuario" para comenzar.
            </p>
          </div>
        )}
      </div>

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUsuario(null);
        }}
        onSave={handleSave}
        usuario={selectedUsuario}
      />
    </div>
  );
}

export default UsuariosListing;
