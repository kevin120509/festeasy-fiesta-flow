import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Star, MapPin, Users, LogOut, User, Building2, BarChart3, MessageSquare, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingRequest {
  id: string;
  client_name: string;
  event_date: string;
  event_type: string;
  service: string;
  location: string;
  guests: number;
  status: string;
  created_at: string;
}

const ProviderDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const { data, error } = await supabase
          .from("booking_requests")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBookingRequests(data || []);
      } catch (error) {
        console.error("Error fetching booking requests:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las solicitudes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchBookingRequests();
    }
  }, [user]);

  const handleRequestAction = async (requestId: string, action: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from("booking_requests")
        .update({ status: action })
        .eq("id", requestId);

      if (error) throw error;

      setBookingRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: action } : req
        )
      );

      toast({
        title: action === 'accepted' ? "Solicitud aceptada" : "Solicitud rechazada",
        description: "El cliente será notificado de tu decisión",
      });
    } catch (error) {
      console.error("Error updating request:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la solicitud",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gray-900">FestEasy</span>
              <Badge variant="secondary">Panel de Proveedor</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-medium">{profile?.full_name || user?.email}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitudes Pendientes</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookingRequests.filter(req => req.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Solicitudes Aceptadas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookingRequests.filter(req => req.status === 'accepted').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Solicitudes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes de Reserva</CardTitle>
            <CardDescription>
              Gestiona las solicitudes de tus clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <Calendar className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Cargando solicitudes...</p>
              </div>
            ) : bookingRequests.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay solicitudes aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{request.client_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.event_type} • {new Date(request.event_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          request.status === 'pending'
                            ? 'secondary'
                            : request.status === 'accepted'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {request.status === 'pending' && 'Pendiente'}
                        {request.status === 'accepted' && 'Aceptada'}
                        {request.status === 'rejected' && 'Rechazada'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.service}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{request.guests} invitados</span>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleRequestAction(request.id, 'accepted')}
                        >
                          Aceptar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequestAction(request.id, 'rejected')}
                        >
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderDashboard;