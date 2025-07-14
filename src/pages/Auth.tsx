import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, Building2 } from "lucide-react";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [userType, setUserType] = useState<"user" | "provider">("user");
  const [category, setCategory] = useState<string>("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (formData: FormData) => {
    setIsLoading(true);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const businessName = formData.get("businessName") as string;
    const selectedCategory = formData.get("category") as string || category;

    try {
      if (authMode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Fetch user profile to determine redirect
        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("user_id", data.user.id)
            .single();
          
          toast({
            title: "¡Bienvenido!",
            description: "Has iniciado sesión correctamente.",
          });
          
          // Redirect based on role
          if (profile?.role === 'provider') {
            navigate("/");
          } else {
            navigate("/");
          }
        }
      } else {
        const metadata: any = {
          role: userType,
          full_name: fullName,
        };

        if (userType === "provider") {
          metadata.business_name = businessName;
          metadata.category = selectedCategory;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: metadata,
          },
        });

        if (error) throw error;

        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "¡Cuenta creada!",
            description: "Por favor verifica tu email para completar el registro.",
          });
        } else if (data.user) {
          toast({
            title: "¡Cuenta creada!",
            description: "Has sido registrado exitosamente.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error durante la autenticación",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">FestEasy</CardTitle>
          <CardDescription>
            {authMode === "login" ? "Inicia sesión en tu cuenta" : "Crea tu cuenta"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={(e) => { e.preventDefault(); handleAuth(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => { e.preventDefault(); handleAuth(new FormData(e.currentTarget)); }} className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de cuenta</Label>
                  <Select value={userType} onValueChange={(value) => setUserType(value as "user" | "provider")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Cliente
                        </div>
                      </SelectItem>
                      <SelectItem value="provider">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Proveedor
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    {userType === "provider" ? "Nombre del contacto" : "Nombre completo"}
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                {userType === "provider" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Nombre del negocio</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        type="text"
                        placeholder="Nombre de tu empresa"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <input type="hidden" name="category" value={category} />
                      <Select value={category} onValueChange={setCategory} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="catering">Catering</SelectItem>
                          <SelectItem value="decoracion">Decoración</SelectItem>
                          <SelectItem value="musica">Música</SelectItem>
                          <SelectItem value="fotografia">Fotografía</SelectItem>
                          <SelectItem value="flores">Flores</SelectItem>
                          <SelectItem value="venues">Venues</SelectItem>
                          <SelectItem value="transporte">Transporte</SelectItem>
                          <SelectItem value="otros">Otros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;