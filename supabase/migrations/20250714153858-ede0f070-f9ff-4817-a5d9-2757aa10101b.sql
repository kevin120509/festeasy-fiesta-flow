-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('user', 'provider');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'user',
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create provider_profiles table for provider-specific information
CREATE TABLE public.provider_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  location TEXT,
  price_range TEXT,
  services TEXT[],
  image_url TEXT,
  gallery TEXT[],
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for provider_profiles
CREATE POLICY "Provider profiles are viewable by everyone" 
ON public.provider_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Providers can update their own profile" 
ON public.provider_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Providers can insert their own profile" 
ON public.provider_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND public.get_user_role(auth.uid()) = 'provider');

-- Update booking_requests to reference user_id properly
ALTER TABLE public.booking_requests ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Update booking_requests RLS policies
DROP POLICY IF EXISTS "Providers can view their own requests" ON public.booking_requests;

CREATE POLICY "Users can view their own requests" 
ON public.booking_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests" 
ON public.booking_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can view requests for their services" 
ON public.booking_requests 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.provider_profiles pp 
    WHERE pp.user_id = auth.uid() 
    AND booking_requests.provider_id = pp.id
  )
);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role_val user_role;
BEGIN
  -- Get role from metadata, default to 'user'
  user_role_val := COALESCE(NEW.raw_user_meta_data->>'role', 'user')::user_role;
  
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, role, full_name)
  VALUES (
    NEW.id, 
    user_role_val,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  -- If provider, also create provider profile
  IF user_role_val = 'provider' THEN
    INSERT INTO public.provider_profiles (
      user_id, 
      business_name, 
      category,
      description
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'business_name', 'Mi Negocio'),
      COALESCE(NEW.raw_user_meta_data->>'category', 'general'),
      'Proveedor de servicios para eventos'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at
  BEFORE UPDATE ON public.provider_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();