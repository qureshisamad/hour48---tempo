-- Insert sample services
INSERT INTO public.services (id, name, description, price, duration, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Air Duct Cleaning', 'Complete cleaning of your home''s air duct system to remove dust, allergens, and contaminants.', 299, '3-4 hours', NOW(), NOW()),
  (gen_random_uuid(), 'Dryer Vent Cleaning', 'Thorough cleaning of your dryer vent to improve efficiency and reduce fire hazards.', 149, '1-2 hours', NOW(), NOW()),
  (gen_random_uuid(), 'HVAC System Maintenance', 'Comprehensive maintenance service to ensure your HVAC system runs efficiently year-round.', 199, '2-3 hours', NOW(), NOW()),
  (gen_random_uuid(), 'Furnace Cleaning', 'Thorough cleaning of your furnace components to improve heating efficiency and safety.', 179, '2-3 hours', NOW(), NOW()),
  (gen_random_uuid(), 'Sanitization Services', 'Eliminate bacteria, viruses, and mold from your HVAC system with our sanitization services.', 249, '2-3 hours', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert sample specialties
INSERT INTO public.specialties (id, name, created_at)
VALUES
  (gen_random_uuid(), 'Air Ducts', NOW()),
  (gen_random_uuid(), 'Furnace', NOW()),
  (gen_random_uuid(), 'Dryer Vents', NOW()),
  (gen_random_uuid(), 'HVAC Maintenance', NOW()),
  (gen_random_uuid(), 'Sanitization', NOW()),
  (gen_random_uuid(), 'Commercial', NOW()),
  (gen_random_uuid(), 'Residential', NOW()),
  (gen_random_uuid(), 'Emergency Services', NOW())
ON CONFLICT DO NOTHING;