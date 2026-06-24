-- Optional showroom demo inventory.
-- Run after schema.sql. Replace or remove these records before launch.

insert into public.cars (
  id, title, make, model, year, price, mileage, location, description,
  condition, type, images, contact_phone, created_at
)
values
(
  '11111111-1111-4111-8111-111111111111',
  '1967 Chevrolet Corvette Stingray',
  'Chevrolet',
  'Corvette Stingray',
  1967,
  129000,
  45000,
  'Vancouver, BC',
  'Numbers-matching 1967 Stingray with documented restoration history.',
  'new_arrival',
  'classic',
  array[
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1600',
    'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=80&w=1600',
    'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&q=80&w=1600'
  ],
  '+1 604-555-0199',
  now()
),
(
  '22222222-2222-4222-8222-222222222222',
  '1973 Porsche 911 Carrera RS',
  'Porsche',
  '911 Carrera RS',
  1973,
  345000,
  82000,
  'Vancouver, BC',
  'Grand Prix White example with historical documentation.',
  'available',
  'classic',
  array[
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1600'
  ],
  '+1 604-555-0199',
  now() - interval '1 day'
),
(
  '33333333-3333-4333-8333-333333333333',
  '1965 Shelby Cobra 427 S/C',
  'Shelby',
  'Cobra 427 S/C',
  1965,
  185000,
  12000,
  'Vancouver, BC',
  'Guardsman Blue example powered by a 427ci V8.',
  'available',
  'classic',
  array[
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1600'
  ],
  '+1 604-555-0199',
  now() - interval '2 days'
)
on conflict (id) do update
set title = excluded.title,
    make = excluded.make,
    model = excluded.model,
    year = excluded.year,
    price = excluded.price,
    mileage = excluded.mileage,
    location = excluded.location,
    description = excluded.description,
    condition = excluded.condition,
    type = excluded.type,
    images = excluded.images,
    contact_phone = excluded.contact_phone;

insert into public.messages (
  car_id, buyer_name, buyer_email, buyer_phone, message, is_read
)
select
  '11111111-1111-4111-8111-111111111111',
  'John Doe',
  'john.doe@example.com',
  '604-555-9011',
  'Is the 1967 Corvette still available? I would like to schedule a private viewing.',
  false
where not exists (
  select 1 from public.messages where buyer_email = 'john.doe@example.com'
);

