import React from "react";
import { useAuth } from "@/hooks/useAuth";
import FestEasyApp from "@/components/FestEasyApp";
import ProviderDashboard from "@/components/ProviderDashboard";

const Index = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Show provider dashboard for providers, public app for users
  if (profile?.role === 'provider') {
    return <ProviderDashboard />;
  }

  return <FestEasyApp />;
};

export default Index;
