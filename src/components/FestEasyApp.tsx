import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  Users, 
  ShoppingCart, 
  Heart, 
  MessageCircle, 
  Phone, 
  Mail,
  Menu,
  X,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Clock,
  DollarSign,
  Settings,
  User,
  FileText,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-image.jpg';

// Types
interface Provider {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  services: string[];
  gallery: string[];
  distance?: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  type: 'client' | 'provider';
}

interface ProviderProfile {
  id: string;
  businessName: string;
  description: string;
  category: string;
  logo: string;
  services: Service[];
  rating: number;
  totalEarnings: number;
}

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface BookingRequest {
  id: string;
  clientName: string;
  eventDate: string;
  eventType: string;
  service: string;
  location: string;
  guests: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const FestEasyApp: React.FC = () => {
  const { toast } = useToast();
  
  // Application State
  const [currentView, setCurrentView] = useState<'public' | 'provider'>('public');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<Provider[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Provider Dashboard State
  const [providerView, setProviderView] = useState<'dashboard' | 'requests' | 'services' | 'profile'>('dashboard');
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Mock Data
  const mockProviders: Provider[] = [
    {
      id: '1',
      name: 'Delicious Catering',
      category: 'Comida',
      description: 'Catering premium para todo tipo de eventos con ingredientes frescos y presentación impecable.',
      price: 25,
      rating: 4.8,
      reviews: 156,
      location: 'Ciudad de México',
      image: '/api/placeholder/300/200',
      services: ['Buffet', 'Servicio a la mesa', 'Barras temáticas'],
      gallery: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
      distance: 2.5
    },
    {
      id: '2',
      name: 'Sound & Lights Pro',
      category: 'Música',
      description: 'DJ profesional y sistema de sonido de alta calidad para crear la atmósfera perfecta.',
      price: 150,
      rating: 4.9,
      reviews: 203,
      location: 'Ciudad de México',
      image: '/api/placeholder/300/200',
      services: ['DJ', 'Sonido profesional', 'Iluminación LED'],
      gallery: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
      distance: 1.8
    },
    {
      id: '3',
      name: 'Decoraciones Elegantes',
      category: 'Decoración',
      description: 'Transformamos espacios con decoraciones únicas y personalizadas para tu evento especial.',
      price: 200,
      rating: 4.7,
      reviews: 89,
      location: 'Ciudad de México',
      image: '/api/placeholder/300/200',
      services: ['Centros de mesa', 'Arcos florales', 'Iluminación ambiental'],
      gallery: ['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'],
      distance: 3.2
    }
  ];

  const mockRequests: BookingRequest[] = [
    {
      id: '1',
      clientName: 'María González',
      eventDate: '2024-08-15',
      eventType: 'Cumpleaños',
      service: 'Catering Premium',
      location: 'Polanco, CDMX',
      guests: 50,
      status: 'pending',
      createdAt: '2024-07-20'
    },
    {
      id: '2',
      clientName: 'Carlos Ruiz',
      eventDate: '2024-08-22',
      eventType: 'Bodas',
      service: 'DJ + Sonido',
      location: 'Santa Fe, CDMX',
      guests: 120,
      status: 'pending',
      createdAt: '2024-07-18'
    }
  ];

  // Effects
  useEffect(() => {
    // Show location modal on first visit
    setTimeout(() => setShowLocationModal(true), 1000);
  }, []);

  // Handlers
  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation('Tu ubicación actual');
          setShowLocationModal(false);
          toast({ title: "Ubicación detectada", description: "Mostrando proveedores cerca de ti" });
        },
        () => {
          toast({ title: "Ubicación denegada", description: "Puedes establecer tu ubicación manualmente" });
        }
      );
    }
  };

  const handleProviderLogin = () => {
    setCurrentView('provider');
    setIsAuthenticated(true);
    setUser({ id: '1', email: 'proveedor@example.com', name: 'Mi Negocio', type: 'provider' });
    setProviderProfile({
      id: '1',
      businessName: 'Mi Negocio de Eventos',
      description: 'Especialistas en hacer realidad tus eventos soñados',
      category: 'Catering',
      logo: '/api/placeholder/100/100',
      services: [],
      rating: 4.8,
      totalEarnings: 15750
    });
    setBookingRequests(mockRequests);
  };

  const addToCart = (provider: Provider) => {
    setCartItems(prev => [...prev, provider]);
    toast({ title: "Agregado al carrito", description: `${provider.name} agregado exitosamente` });
  };

  const removeFromCart = (providerId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== providerId));
  };

  const handleBookingAction = (requestId: string, action: 'accept' | 'reject') => {
    setBookingRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'accept' ? 'accepted' : 'rejected' }
          : req
      )
    );
    toast({ 
      title: action === 'accept' ? "Solicitud aceptada" : "Solicitud rechazada",
      description: "El cliente será notificado de tu decisión"
    });
  };

  // Filtering
  const filteredProviders = mockProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(mockProviders.map(p => p.category)))];

  // Public View Component
  const PublicView = () => (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎈</span>
            <span className="text-xl font-bold text-primary">FestEasy</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#explorar" className="text-sm font-medium hover:text-primary transition-colors">
              Explorar
            </a>
            <a href="#beneficios" className="text-sm font-medium hover:text-primary transition-colors">
              Beneficios
            </a>
            <a href="#testimonios" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonios
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Carrito de Compras</DialogTitle>
                  <DialogDescription>
                    Revisa los servicios seleccionados para tu evento
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {cartItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Tu carrito está vacío
                    </p>
                  ) : (
                    <>
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                            <p className="font-semibold">${item.price} MXN por persona</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total estimado:</span>
                          <span>${cartItems.reduce((sum, item) => sum + item.price, 0)} MXN por persona</span>
                        </div>
                        <Button className="w-full mt-4" size="lg">
                          Solicitar Cotización
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={handleProviderLogin}>
              Soy Proveedor
            </Button>

            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t bg-background p-4">
            <nav className="flex flex-col space-y-4">
              <a href="#explorar" className="text-sm font-medium hover:text-primary">
                Explorar
              </a>
              <a href="#beneficios" className="text-sm font-medium hover:text-primary">
                Beneficios
              </a>
              <a href="#testimonios" className="text-sm font-medium hover:text-primary">
                Testimonios
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-black/60 to-black/40">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tu evento ideal, sin esfuerzo.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Conecta con los mejores proveedores de eventos en tu ciudad
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="xl" variant="celebration" className="text-lg">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Crea tu Fiesta con IA
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Asistente de Planificación IA
                  </DialogTitle>
                  <DialogDescription>
                    Cuéntanos sobre tu evento y te ayudaremos a crear el plan perfecto
                  </DialogDescription>
                </DialogHeader>
                <AIAssistantForm />
              </DialogContent>
            </Dialog>
            
            <Button size="xl" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-primary">
              Explorar Proveedores
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="beneficios" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Beneficios</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              FestEasy empodera a los proveedores de servicios de eventos para prosperar en un mercado competitivo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Encuentra</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Descubre proveedores verificados cerca de ti con reseñas reales y portafolios impresionantes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Compara</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analiza precios, servicios y disponibilidad para tomar la mejor decisión para tu evento.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <CardTitle>Reserva con Confianza</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sistema de pagos seguro y garantía de calidad en todos los servicios contratados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Providers Section */}
      <section id="explorar" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explora Proveedores</h2>
            <p className="text-xl text-muted-foreground">
              Encuentra el proveedor perfecto para tu evento
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar proveedores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border rounded-md bg-background"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Todas las categorías' : category}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Providers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Testimonios</h2>
            <p className="text-xl text-muted-foreground">
              Lo que dicen nuestros clientes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    "FestEasy hizo que planificar mi boda fuera increíblemente fácil. 
                    Encontré proveedores increíbles y todo salió perfecto."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">María González</p>
                      <p className="text-sm text-muted-foreground">Cliente satisfecha</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🎈</span>
                <span className="text-xl font-bold">FestEasy</span>
              </div>
              <p className="text-primary-foreground/80">
                La plataforma líder para conectar anfitriones con proveedores de eventos.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Términos de Servicio</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Contáctanos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Para Proveedores</h4>
              <ul className="space-y-2 text-primary-foreground/80">
                <li><a href="#" className="hover:text-primary-foreground">Únete a FestEasy</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-primary-foreground">Recursos</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-primary-foreground/80">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>hola@festeasy.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+52 55 1234 5678</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
            <p>&copy; 2024 FestEasy. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Location Modal */}
      <Dialog open={showLocationModal} onOpenChange={setShowLocationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Encuentra proveedores cerca de ti
            </DialogTitle>
            <DialogDescription>
              Para mostrarte los mejores resultados, necesitamos conocer tu ubicación
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button onClick={handleLocationPermission} className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              Detectar mi ubicación
            </Button>
            <div className="relative">
              <Input
                placeholder="O escribe tu ciudad..."
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowLocationModal(false)}
              className="w-full"
            >
              Continuar sin ubicación
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Provider View Component
  const ProviderView = () => (
    <div className="min-h-screen bg-background">
      {/* Provider Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎈</span>
            <span className="text-xl font-bold text-primary">FestEasy</span>
            <Badge variant="secondary">Panel de Proveedor</Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setCurrentView('public');
                setIsAuthenticated(false);
                setUser(null);
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-card border-r">
          <nav className="p-4 space-y-2">
            <Button
              variant={providerView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setProviderView('dashboard')}
              className="w-full justify-start"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={providerView === 'requests' ? 'default' : 'ghost'}
              onClick={() => setProviderView('requests')}
              className="w-full justify-start"
            >
              <FileText className="mr-2 h-4 w-4" />
              Solicitudes
              {bookingRequests.filter(r => r.status === 'pending').length > 0 && (
                <Badge className="ml-auto" variant="destructive">
                  {bookingRequests.filter(r => r.status === 'pending').length}
                </Badge>
              )}
            </Button>
            <Button
              variant={providerView === 'services' ? 'default' : 'ghost'}
              onClick={() => setProviderView('services')}
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              Mis Servicios
            </Button>
            <Button
              variant={providerView === 'profile' ? 'default' : 'ghost'}
              onClick={() => setProviderView('profile')}
              className="w-full justify-start"
            >
              <Eye className="mr-2 h-4 w-4" />
              Mi Perfil
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {providerView === 'dashboard' && <ProviderDashboard providerProfile={providerProfile!} bookingRequests={bookingRequests} />}
          {providerView === 'requests' && <RequestsView requests={bookingRequests} onAction={handleBookingAction} />}
          {providerView === 'services' && <ServicesView services={services} setServices={setServices} />}
          {providerView === 'profile' && <ProfileView profile={providerProfile!} />}
        </main>
      </div>
    </div>
  );

  // Component Implementations
  const ProviderCard: React.FC<{ provider: Provider; onAddToCart: (provider: Provider) => void }> = ({ provider, onAddToCart }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted relative">
        <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
        {provider.distance && (
          <Badge className="absolute top-2 right-2 bg-background/90 text-foreground">
            {provider.distance} km
          </Badge>
        )}
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{provider.name}</CardTitle>
            <Badge variant="secondary">{provider.category}</Badge>
          </div>
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{provider.rating}</span>
          <span className="text-muted-foreground">({provider.reviews})</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {provider.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">${provider.price}</span>
            <span className="text-muted-foreground text-sm"> /persona</span>
          </div>
          <div className="space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Ver más</Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <ProviderDetails provider={provider} onAddToCart={onAddToCart} />
              </DialogContent>
            </Dialog>
            <Button size="sm" onClick={() => onAddToCart(provider)}>
              Agregar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProviderDetails: React.FC<{ provider: Provider; onAddToCart: (provider: Provider) => void }> = ({ provider, onAddToCart }) => (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-2xl">{provider.name}</DialogTitle>
        <DialogDescription className="text-base">
          {provider.description}
        </DialogDescription>
      </DialogHeader>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Gallery */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Galería</h3>
          <div className="grid grid-cols-2 gap-2">
            {provider.gallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${provider.name} ${index + 1}`}
                className="aspect-square object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Información</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{provider.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{provider.rating} ({provider.reviews} reseñas)</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>${provider.price} MXN por persona</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Servicios</h3>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service, index) => (
                <Badge key={index} variant="outline">{service}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={() => onAddToCart(provider)} className="w-full" size="lg">
              Solicitar Reserva
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <MessageCircle className="mr-2 h-4 w-4" />
                Mensajes
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Phone className="mr-2 h-4 w-4" />
                Llamar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AIAssistantForm: React.FC = () => {
    const [eventLocation, setEventLocation] = useState('');
    const [budget, setBudget] = useState(5000);
    const [eventType, setEventType] = useState('');
    const [guests, setGuests] = useState(50);
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiResponse, setAiResponse] = useState<any>(null);

    const handleGeneratePlan = async () => {
      setIsGenerating(true);
      
      // Simulate AI processing
      setTimeout(() => {
        const mockAIResponse = {
          totalCost: budget * 0.8,
          recommendations: [
            { ...mockProviders[0], reason: "Excelente relación calidad-precio y cerca de tu ubicación" },
            { ...mockProviders[1], reason: "Equipos profesionales ideales para tu presupuesto" },
            { ...mockProviders[2], reason: "Estilo elegante que complementa tu evento" }
          ],
          summary: "Hemos seleccionado estos proveedores basándonos en tu presupuesto y ubicación. Esta combinación te dará un evento memorable dentro de tu rango de precio."
        };
        
        setAiResponse(mockAIResponse);
        setIsGenerating(false);
      }, 3000);
    };

    if (aiResponse) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-success">¡Plan generado exitosamente!</h3>
            <p className="text-muted-foreground">{aiResponse.summary}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Proveedores recomendados:</h4>
            {aiResponse.recommendations.map((provider: Provider & { reason: string }) => (
              <Card key={provider.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-medium">{provider.name}</h5>
                      <Badge variant="secondary">{provider.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{provider.reason}</p>
                    <p className="font-medium">${provider.price} MXN por persona</p>
                  </div>
                  <Button size="sm" onClick={() => addToCart(provider)}>
                    Agregar
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="bg-primary/5 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Costo total estimado:</span>
              <span className="text-2xl font-bold text-primary">
                ${aiResponse.totalCost.toLocaleString()} MXN
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Para {guests} invitados
            </p>
          </div>

          <Button className="w-full" size="lg">
            Contactar Proveedores
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Ubicación del evento</label>
            <Input
              placeholder="Ej. Polanco, Ciudad de México"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Tipo de evento</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="">Selecciona el tipo de evento</option>
              <option value="cumpleanos">Cumpleaños</option>
              <option value="boda">Boda</option>
              <option value="corporativo">Evento Corporativo</option>
              <option value="graduacion">Graduación</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Número de invitados: {guests}
            </label>
            <input
              type="range"
              min="10"
              max="500"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Presupuesto: ${budget.toLocaleString()} MXN
            </label>
            <input
              type="range"
              min="1000"
              max="50000"
              step="500"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <Button 
          onClick={handleGeneratePlan}
          disabled={!eventLocation || !eventType || isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Generando plan perfecto...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generar Plan con IA
            </>
          )}
        </Button>
      </div>
    );
  };

  const ProviderDashboard: React.FC<{ providerProfile: ProviderProfile; bookingRequests: BookingRequest[] }> = ({ providerProfile, bookingRequests }) => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido de vuelta, {providerProfile.businessName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providerProfile.rating}</div>
            <p className="text-xs text-muted-foreground">+0.1 desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${providerProfile.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingRequests.filter(r => r.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Requieren tu atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Confirmados</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingRequests.filter(r => r.status === 'accepted').length}</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Recientes</CardTitle>
          <CardDescription>Últimas solicitudes de reserva</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookingRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{request.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.eventType} • {request.guests} invitados • {request.location}
                  </p>
                  <p className="text-sm text-muted-foreground">{request.eventDate}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={request.status === 'pending' ? 'default' : 
                            request.status === 'accepted' ? 'success' : 'destructive'}
                  >
                    {request.status === 'pending' ? 'Pendiente' :
                     request.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
                  </Badge>
                  {request.status === 'pending' && (
                    <Button size="sm">Ver Detalles</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const RequestsView: React.FC<{ requests: BookingRequest[]; onAction: (id: string, action: 'accept' | 'reject') => void }> = ({ requests, onAction }) => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Solicitudes de Reserva</h1>
        <p className="text-muted-foreground">Gestiona todas tus solicitudes de eventos</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pendientes ({requests.filter(r => r.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Aceptadas ({requests.filter(r => r.status === 'accepted').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rechazadas ({requests.filter(r => r.status === 'rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {requests.filter(r => r.status === 'pending').map((request) => (
            <RequestCard key={request.id} request={request} onAction={onAction} />
          ))}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {requests.filter(r => r.status === 'accepted').map((request) => (
            <RequestCard key={request.id} request={request} onAction={onAction} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {requests.filter(r => r.status === 'rejected').map((request) => (
            <RequestCard key={request.id} request={request} onAction={onAction} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );

  const RequestCard: React.FC<{ request: BookingRequest; onAction: (id: string, action: 'accept' | 'reject') => void }> = ({ request, onAction }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{request.clientName}</CardTitle>
            <CardDescription>{request.eventType} • {request.eventDate}</CardDescription>
          </div>
          <Badge 
            variant={request.status === 'pending' ? 'default' : 
                    request.status === 'accepted' ? 'success' : 'destructive'}
          >
            {request.status === 'pending' ? 'Pendiente' :
             request.status === 'accepted' ? 'Aceptada' : 'Rechazada'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{request.eventDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{request.guests} invitados</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{request.location}</span>
            </div>
          </div>
          <div className="space-y-2">
            <p><strong>Servicio:</strong> {request.service}</p>
            <p><strong>Solicitado:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        {request.status === 'pending' && (
          <div className="flex space-x-2 mt-4">
            <Button 
              variant="success" 
              onClick={() => onAction(request.id, 'accept')}
              className="flex-1"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Aceptar Solicitud
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onAction(request.id, 'reject')}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              Rechazar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ServicesView: React.FC<{ services: Service[]; setServices: React.Dispatch<React.SetStateAction<Service[]>> }> = ({ services, setServices }) => {
    const [showAddService, setShowAddService] = useState(false);
    const [newService, setNewService] = useState({ name: '', price: 0, description: '' });

    const addService = () => {
      if (newService.name && newService.price > 0) {
        const service: Service = {
          id: Date.now().toString(),
          ...newService
        };
        setServices(prev => [...prev, service]);
        setNewService({ name: '', price: 0, description: '' });
        setShowAddService(false);
        toast({ title: "Servicio agregado", description: "Tu nuevo servicio ha sido publicado" });
      }
    };

    const removeService = (id: string) => {
      setServices(prev => prev.filter(s => s.id !== id));
      toast({ title: "Servicio eliminado", description: "El servicio ha sido removido de tu catálogo" });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mis Servicios</h1>
            <p className="text-muted-foreground">Gestiona tu catálogo de servicios</p>
          </div>
          <Button onClick={() => setShowAddService(true)}>
            Agregar Servicio
          </Button>
        </div>

        {services.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent>
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No tienes servicios registrados</h3>
                <p className="text-muted-foreground">
                  Agrega tu primer servicio para que los clientes puedan encontrarte
                </p>
                <Button onClick={() => setShowAddService(true)}>
                  Agregar mi primer servicio
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeService(service.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="text-2xl font-bold text-primary">
                    ${service.price} MXN
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Service Modal */}
        <Dialog open={showAddService} onOpenChange={setShowAddService}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
              <DialogDescription>
                Completa la información de tu servicio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre del servicio</label>
                <Input
                  placeholder="Ej. Catering Premium"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Precio (MXN)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newService.price || ''}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: Number(e.target.value) }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Descripción</label>
                <Textarea
                  placeholder="Describe tu servicio..."
                  value={newService.description}
                  onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={addService} className="flex-1">
                  Agregar Servicio
                </Button>
                <Button variant="outline" onClick={() => setShowAddService(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const ProfileView: React.FC<{ profile: ProviderProfile }> = ({ profile }) => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Así es como los clientes ven tu negocio</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">{profile.businessName}</CardTitle>
              <CardDescription className="text-base">{profile.description}</CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{profile.rating}</span>
                <Badge variant="secondary">{profile.category}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Servicios Ofrecidos</h4>
              {profile.services.length === 0 ? (
                <p className="text-muted-foreground">No has agregado servicios aún</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.services.map((service) => (
                    <div key={service.id} className="p-4 border rounded-lg">
                      <h5 className="font-medium">{service.name}</h5>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                      <p className="font-semibold text-primary">${service.price} MXN</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t">
              <Button>Editar Perfil</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render based on current view
  return currentView === 'public' ? <PublicView /> : <ProviderView />;
};

export default FestEasyApp;