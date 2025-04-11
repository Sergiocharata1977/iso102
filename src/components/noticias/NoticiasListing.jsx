
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bell, ChevronRight } from "lucide-react";

function NoticiasListing() {
  const noticias = [
    {
      id: 1,
      titulo: "Lanzamiento de la Plataforma Digital de Señores del Agro",
      contenido: "La Dirección de Señores del Agro cuenta desde hoy con la digitalización total con el lanzamiento de su nueva plataforma interna para la gestión de operaciones agropecuarias. La plataforma permitirá a los colaboradores y productores gestionar sus actividades de manera más eficiente.",
      fecha: "2025-04-07",
      imagen: "https://storage.googleapis.com/hostinger-horizons-assets-prod/8dbf3f66-6a64-4665-ae25-f32f332f4fba/cbb9bfb3667307875da0e1063c6257f0.png"
    },
    {
      id: 2,
      titulo: "Capacitaciones sobre Buenas Prácticas Agrícolas",
      contenido: "El Departamento de Innovación y Desarrollo de Señores del Agro ha organizado una serie de capacitaciones sobre Buenas Prácticas Agrícolas para nuestros colaboradores. Las jornadas se llevarán a cabo del 12 al 15 de Mayo y esperan excelentes resultados.",
      fecha: "2025-04-06",
      imagen: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40"
    },
    {
      id: 3,
      titulo: "Primera Reunión de Trabajo para la Implementación de ISO 9001",
      contenido: "El pasado miércoles 25 de marzo, el equipo de Señores del Agro participó en la primera reunión oficial para la implementación del Sistema de Gestión de Calidad bajo la norma ISO 9001:2015. Durante el encuentro se definieron los próximos pasos.",
      fecha: "2025-04-05",
      imagen: "https://images.unsplash.com/photo-1552581234-26160f608093"
    },
    {
      id: 4,
      titulo: "La ISO 9001: Un Cultivo de Calidad en el Agro",
      contenido: "La implementación de la norma ISO 9001 en las empresas agropecuarias ha dejado claro que una buena base contribuye en una excelente temporada. Cada paso que da Señores del Agro nos encamina hacia la excelencia.",
      fecha: "2025-04-04",
      imagen: "https://images.unsplash.com/photo-1560493676-04071c5f467b"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Logo Header */}
      <div className="flex flex-col items-center justify-center mb-12">
        <img 
          src="https://storage.googleapis.com/hostinger-horizons-assets-prod/8dbf3f66-6a64-4665-ae25-f32f332f4fba/8e73c93e635d333773a9e15271a25261.png"
          alt="Los Señores del Agro"
          className="h-24 mb-4"
        />
        <h1 className="text-2xl font-bold text-center">Noticias Internas</h1>
        <p className="text-muted-foreground text-center">
          Mantente al día con las últimas novedades de Los Señores del Agro
        </p>
      </div>

      {/* Noticias */}
      <div className="space-y-6">
        {noticias.map((noticia, index) => (
          <motion.div
            key={noticia.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-6">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                  <Bell className="h-4 w-4" />
                  <span>{new Date(noticia.fecha).toLocaleDateString()}</span>
                </div>
                <h2 className="text-xl font-semibold mb-3">{noticia.titulo}</h2>
                <p className="text-muted-foreground mb-4">{noticia.contenido}</p>
                <Button variant="ghost" className="group">
                  Leer más
                  <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              <div className="md:w-1/3">
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover aspect-video md:aspect-auto"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default NoticiasListing;
