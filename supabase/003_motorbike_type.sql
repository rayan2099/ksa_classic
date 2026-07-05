alter table public.cars
  drop constraint if exists cars_type_check;

alter table public.cars
  add constraint cars_type_check
  check (type in ('classic', 'project', 'motorbike'));
