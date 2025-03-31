-- Criar a tabela de perfis
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  bio text,
  website text,
  avatar_url text,
  location text,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Comentários para documentação
comment on table public.profiles is 'Tabela de perfis personalizados sincronizados com auth.users';
comment on column public.profiles.id is 'UUID do usuário (igual ao auth.users.id)';
comment on column public.profiles.username is 'Nome de usuário público e único';
comment on column public.profiles.full_name is 'Nome completo do usuário';
comment on column public.profiles.bio is 'Biografia curta';
comment on column public.profiles.website is 'Website pessoal ou rede social';
comment on column public.profiles.avatar_url is 'URL do avatar';
comment on column public.profiles.location is 'Localização';

-- Trigger para updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function handle_updated_at();

-- Trigger para criação automática de perfil
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();

-- Habilitar RLS
alter table public.profiles enable row level security;

-- Políticas de acesso
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Configuração do storage
insert into storage.buckets (id, name)
values ('avatars', 'avatars');

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'avatars' );