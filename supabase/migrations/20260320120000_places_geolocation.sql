-- Geolocation for Footprint globe (WGS84). Existing rows keep null coords until updated in admin.

alter table public.places
  add column if not exists latitude double precision,
  add column if not exists longitude double precision,
  add column if not exists location_name text;

alter table public.places
  drop constraint if exists places_latitude_range;

alter table public.places
  add constraint places_latitude_range
  check (latitude is null or (latitude >= -90 and latitude <= 90));

alter table public.places
  drop constraint if exists places_longitude_range;

alter table public.places
  add constraint places_longitude_range
  check (longitude is null or (longitude >= -180 and longitude <= 180));

create index if not exists idx_places_coordinates
  on public.places (latitude, longitude)
  where latitude is not null and longitude is not null;

comment on column public.places.latitude is 'WGS84 latitude; set via admin globe picker';
comment on column public.places.longitude is 'WGS84 longitude; set via admin globe picker';
comment on column public.places.location_name is 'Resolved geographic label from search (optional)';