-- Create tables for the Hour48 HVAC Cleaning Service Platform

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technicians table
CREATE TABLE IF NOT EXISTS technicians (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  location TEXT,
  experience TEXT,
  rating NUMERIC(3,2),
  review_count INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  next_available TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create specialties table
CREATE TABLE IF NOT EXISTS specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technician_specialties junction table
CREATE TABLE IF NOT EXISTS technician_specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  UNIQUE(technician_id, specialty_id)
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Clients policies
DROP POLICY IF EXISTS "Clients can view their own profile" ON clients;
CREATE POLICY "Clients can view their own profile"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can update their own profile" ON clients;
CREATE POLICY "Clients can update their own profile"
  ON clients FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Technicians can view client profiles" ON clients;
CREATE POLICY "Technicians can view client profiles"
  ON clients FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM technicians WHERE user_id = auth.uid()
  ));

-- Technicians policies
DROP POLICY IF EXISTS "Technicians can view their own profile" ON technicians;
CREATE POLICY "Technicians can view their own profile"
  ON technicians FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Technicians can update their own profile" ON technicians;
CREATE POLICY "Technicians can update their own profile"
  ON technicians FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can view technician profiles" ON technicians;
CREATE POLICY "Clients can view technician profiles"
  ON technicians FOR SELECT
  USING (true);

-- Services policies
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  USING (true);

-- Bookings policies
DROP POLICY IF EXISTS "Clients can view their own bookings" ON bookings;
CREATE POLICY "Clients can view their own bookings"
  ON bookings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM clients WHERE user_id = auth.uid() AND clients.id = client_id
  ));

DROP POLICY IF EXISTS "Clients can create bookings" ON bookings;
CREATE POLICY "Clients can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients WHERE user_id = auth.uid() AND clients.id = client_id
  ));

DROP POLICY IF EXISTS "Technicians can view their assigned bookings" ON bookings;
CREATE POLICY "Technicians can view their assigned bookings"
  ON bookings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM technicians WHERE user_id = auth.uid() AND technicians.id = technician_id
  ));

DROP POLICY IF EXISTS "Technicians can update their assigned bookings" ON bookings;
CREATE POLICY "Technicians can update their assigned bookings"
  ON bookings FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM technicians WHERE user_id = auth.uid() AND technicians.id = technician_id
  ));

-- Reviews policies
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Clients can create reviews" ON reviews;
CREATE POLICY "Clients can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM clients WHERE user_id = auth.uid() AND clients.id = client_id
  ));

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE clients;
ALTER PUBLICATION supabase_realtime ADD TABLE technicians;
ALTER PUBLICATION supabase_realtime ADD TABLE specialties;
ALTER PUBLICATION supabase_realtime ADD TABLE technician_specialties;
ALTER PUBLICATION supabase_realtime ADD TABLE services;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;

-- Insert initial data for services
INSERT INTO services (name, description, price, duration)
VALUES
  ('Air Duct Cleaning', 'Complete cleaning of your home''s air duct system to remove dust, allergens, and contaminants.', 299.00, '3-4 hours'),
  ('Dryer Vent Cleaning', 'Thorough cleaning of your dryer vent to improve efficiency and reduce fire hazards.', 149.00, '1-2 hours'),
  ('HVAC System Maintenance', 'Comprehensive maintenance service to ensure your HVAC system runs efficiently year-round.', 199.00, '2-3 hours'),
  ('Furnace Cleaning', 'Thorough cleaning of your furnace components to improve heating efficiency and safety.', 179.00, '2-3 hours'),
  ('Sanitization Services', 'Eliminate bacteria, viruses, and mold from your HVAC system with our sanitization services.', 249.00, '2-3 hours')
ON CONFLICT DO NOTHING;

-- Insert initial data for specialties
INSERT INTO specialties (name)
VALUES
  ('Air Ducts'),
  ('Furnace'),
  ('HVAC Maintenance'),
  ('Dryer Vents'),
  ('Sanitization'),
  ('Residential'),
  ('Commercial'),
  ('Emergency Services')
ON CONFLICT DO NOTHING;
