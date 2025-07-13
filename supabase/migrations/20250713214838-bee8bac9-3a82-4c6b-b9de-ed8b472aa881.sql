-- Create a table for storing provider data
CREATE TABLE public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  rating DECIMAL DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  location TEXT,
  image_url TEXT,
  services TEXT[],
  gallery TEXT[],
  distance DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for booking requests
CREATE TABLE public.booking_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL,
  service TEXT NOT NULL,
  location TEXT NOT NULL,
  guests INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  provider_id UUID REFERENCES public.providers(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for providers (public read access)
CREATE POLICY "Providers are viewable by everyone" 
ON public.providers 
FOR SELECT 
USING (true);

-- Create policies for booking requests (providers can view their own requests)
CREATE POLICY "Providers can view their own requests" 
ON public.booking_requests 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_providers_updated_at
BEFORE UPDATE ON public.providers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_requests_updated_at
BEFORE UPDATE ON public.booking_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample providers
INSERT INTO public.providers (name, category, description, price, rating, reviews, location, image_url, services, gallery, distance) VALUES
('Delicious Catering', 'Comida', 'Catering premium para todo tipo de eventos con ingredientes frescos y presentación impecable.', 25, 4.8, 156, 'Ciudad de México', 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&h=200&fit=crop', ARRAY['Buffet', 'Servicio a la mesa', 'Barras temáticas'], ARRAY['https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop'], 2.5),
('Sound & Lights Pro', 'Música', 'DJ profesional y sistema de sonido de alta calidad para crear la atmósfera perfecta.', 150, 4.9, 203, 'Ciudad de México', 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=300&h=200&fit=crop', ARRAY['DJ', 'Sonido profesional', 'Iluminación LED'], ARRAY['https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop'], 1.8),
('Decoraciones Elegantes', 'Decoración', 'Transformamos espacios con decoraciones únicas y personalizadas para tu evento especial.', 200, 4.7, 89, 'Ciudad de México', 'https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=300&h=200&fit=crop', ARRAY['Centros de mesa', 'Arcos florales', 'Iluminación ambiental'], ARRAY['https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop'], 3.2);