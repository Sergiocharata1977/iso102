
import React, { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import LoginPage from "@/pages/auth/login";
import { initializeData } from "@/data/initial-data";
import { 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X, 
  ArrowUpCircle, 
  Users, 
  Building2, 
  FileText, 
  Settings, 
  LayoutGrid, 
  ClipboardList, 
  Target, 
  BarChart2, 
  Ruler, 
  ClipboardCheck, 
  BadgeCheck as TicketCheck, 
  Star,
  Calendar,
  Bell 
} from 'lucide-react';

// Lazy loaded components
const NoticiasListing = React.lazy(() => import("@/components/noticias/NoticiasListing"));
const MejorasListing = React.lazy(() => import("@/components/mejoras/MejorasListing"));
const MejorasDashboard = React.lazy(() => import("@/components/mejoras/MejorasDashboard"));
const PersonalListing = React.lazy(() => import("@/components/personal/PersonalListing"));
const DepartamentosListing = React.lazy(() => import("@/components/rrhh/DepartamentosListing"));
const PuestosListing = React.lazy(() => import("@/components/rrhh/PuestosListing"));
const ProcesosListing = React.lazy(() => import("@/components/procesos/ProcesosListing"));
const ObjetivosListing = React.lazy(() => import("@/components/procesos/ObjetivosListing"));
const IndicadoresListing = React.lazy(() => import("@/components/procesos/IndicadoresListing"));
const MedicionesListing = React.lazy(() => import("@/components/procesos/MedicionesListing"));
const DocumentosListing = React.lazy(() => import("@/components/documentos/DocumentosListing"));
const AuditoriasListing = React.lazy(() => import("@/components/auditorias/AuditoriasListing"));
const TicketsListing = React.lazy(() => import("@/components/tickets/TicketsListing"));
const EncuestasListing = React.lazy(() => import("@/components/encuestas/EncuestasListing"));
const UsuariosListing = React.lazy(() => import("@/components/usuarios/UsuariosListing"));
const NotificationCenter = React.lazy(() => import("@/components/notifications/NotificationCenter"));
const CalendarView = React.lazy(() => import("@/components/calendar/CalendarView"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6 text-center">
          <X className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-semibold mb-2">Algo salió mal</h2>
          <p className="text-muted-foreground mb-4">
            Ha ocurrido un error al cargar este componente.
          </p>
          <Button 
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
          >
            Intentar de nuevo
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedSection, setSelectedSection] = useState("noticias"); // Cambiado a "noticias"
  const [expandedGroups, setExpandedGroups] = useState(["rrhh", "procesos", "satisfaccion"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(true);
  const [mejoras, setMejoras] = useState([]);

  // Define sections array before using it in renderMenuItem
  const sections = [
    {
      id: "noticias",
      title: "Noticias",
      icon: Bell
    },
    {
      id: "tablero",
      title: "Tablero Central",
      icon: LayoutGrid
    },
    {
      id: "calendario",
      title: "Calendario",
      icon: Calendar
    },
    {
      id: "hallazgos",
      title: "Hallazgos y Mejoras",
      icon: ArrowUpCircle
    },
    {
      id: "rrhh",
      title: "Recursos Humanos",
      icon: Users,
      items: [
        {
          id: "personal",
          title: "Personal",
          icon: Users
        },
        {
          id: "departamentos",
          title: "Departamentos",
          icon: Building2
        },
        {
          id: "puestos",
          title: "Puestos",
          icon: Building2
        }
      ]
    },
    {
      id: "procesos",
      title: "Procesos",
      icon: FileText,
      items: [
        {
          id: "procesos",
          title: "Procesos",
          icon: FileText
        },
        {
          id: "objetivos",
          title: "Objetivos",
          icon: Target
        },
        {
          id: "indicadores",
          title: "Indicadores",
          icon: BarChart2
        },
        {
          id: "mediciones",
          title: "Mediciones",
          icon: Ruler
        }
      ]
    },
    {
      id: "documentos",
      title: "Documentos",
      icon: FileText
    },
    {
      id: "auditorias",
      title: "Auditorías",
      icon: ClipboardCheck
    },
    {
      id: "satisfaccion",
      title: "Satisfacción",
      icon: Star,
      items: [
        {
          id: "tickets",
          title: "Tickets",
          icon: TicketCheck
        },
        {
          id: "encuestas",
          title: "Encuestas",
          icon: ClipboardList
        }
      ]
    },
    {
      id: "usuarios",
      title: "Usuarios",
      icon: Users
    }
  ];

  useEffect(() => {
    try {
      // Initialize sample data
      initializeData();
      
      // Load mejoras data
      const savedMejoras = localStorage.getItem("mejoras");
      if (savedMejoras) {
        setMejoras(JSON.parse(savedMejoras));
      }
      
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 768) {
          setIsMobileMenuOpen(false);
        }
      };

      window.addEventListener('resize', handleResize);
      setIsLoading(false);

      return () => window.removeEventListener('resize', handleResize);
    } catch (error) {
      console.error("Error initializing app:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al inicializar la aplicación",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, []);

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const renderMenuItem = (section) => {
    const isGroup = section.items && section.items.length > 0;
    const isExpanded = expandedGroups.includes(section.id);
    const isActive = !isGroup && selectedSection === section.id;
    const Icon = section.icon;

    return (
      <div key={section.id}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start ${isGroup ? 'mb-2' : ''}`}
          onClick={() => {
            if (isGroup) {
              toggleGroup(section.id);
            } else {
              setSelectedSection(section.id);
              if (isMobile) {
                setIsMobileMenuOpen(false);
              }
            }
          }}
        >
          <Icon className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">{section.title}</span>
          {isGroup && (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          )}
        </Button>

        {isGroup && isExpanded && (
          <div className="pl-4 space-y-1">
            {section.items.map((item) => renderMenuItem(item))}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    return (
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          {(() => {
            switch (selectedSection) {
              case "noticias":
                return <NoticiasListing />;
              case "tablero":
                return <MejorasDashboard mejoras={mejoras} />;
              case "calendario":
                return <CalendarView />;
              case "hallazgos":
                return <MejorasListing />;
              case "personal":
                return <PersonalListing />;
              case "departamentos":
                return <DepartamentosListing />;
              case "puestos":
                return <PuestosListing />;
              case "procesos":
                return <ProcesosListing />;
              case "objetivos":
                return <ObjetivosListing />;
              case "indicadores":
                return <IndicadoresListing />;
              case "mediciones":
                return <MedicionesListing />;
              case "documentos":
                return <DocumentosListing />;
              case "auditorias":
                return <AuditoriasListing />;
              case "tickets":
                return <TicketsListing />;
              case "encuestas":
                return <EncuestasListing />;
              case "usuarios":
                return <UsuariosListing />;
              default:
                return (
                  <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">
                      Seleccione una sección del menú
                    </p>
                  </div>
                );
            }
          })()}
        </Suspense>
      </ErrorBoundary>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className="fixed top-4 left-4 z-50 p-2 bg-background rounded-lg border border-border"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}

        {/* Sidebar */}
        <motion.div
          initial={isMobile ? { x: -320 } : false}
          animate={isMobile ? { x: isMobileMenuOpen ? 0 : -320 } : false}
          transition={{ type: "spring", damping: 20 }}
          className={`${
            isMobile
              ? `fixed inset-y-0 left-0 z-40 w-64`
              : 'w-64'
          } border-r border-border bg-card p-4`}
        >
          <div className="space-y-2">
            {sections.map(renderMenuItem)}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          className={`flex-1 overflow-hidden flex flex-col ${isMobile ? 'w-full' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with notifications */}
          <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-end">
            <Suspense fallback={<LoadingSpinner />}>
              <NotificationCenter />
            </Suspense>
          </div>

          {/* Content area */}
          <div className={`flex-1 overflow-auto p-6 ${isMobile ? 'pt-16' : ''}`}>
            {renderContent()}
          </div>
        </motion.div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
