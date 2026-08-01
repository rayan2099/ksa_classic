alter table public.cars
  add column if not exists mileage_unit text not null default 'km';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'cars_mileage_unit_check'
  ) then
    alter table public.cars
      add constraint cars_mileage_unit_check
      check (mileage_unit in ('km', 'mi'));
  end if;
end
$$;

update public.cars
set mileage_unit = 'km'
where mileage_unit is null
   or mileage_unit not in ('km', 'mi');
