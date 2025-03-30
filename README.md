# Sistema de Autenticação com Supabase

Sistema modular de autenticação usando Supabase Auth, React e Vite.

## 🚀 Funcionalidades

- ✅ Login com e-mail/senha
- ✅ Registro com e-mail/senha
- ✅ Login via OAuth (Google)
- ✅ Login via Magic Link
- ✅ Logout
- ✅ Recuperação de senha
- ✅ Persistência de sessão
- ✅ Contexto global com hooks
- ✅ Tabela profiles customizada
- ✅ Proteção de rotas privadas
- ✅ Validação de formulários
- ✅ Feedback de erros e carregamento

## 🛠️ Tecnologias

- [Supabase](https://supabase.com/) - Backend e Autenticação
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) - Frontend
- [TanStack Router](https://tanstack.com/router) - Roteamento
- [Zustand](https://zustand-demo.pmnd.rs/) - Gerenciamento de Estado
- [React Hook Form](https://react-hook-form.com/) - Formulários
- [Zod](https://zod.dev/) - Validação
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [shadcn/ui](https://ui.shadcn.com/) - Componentes
- [Sonner](https://sonner.emilkowal.ski/) - Toasts

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Adicione suas credenciais do Supabase no arquivo .env:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

5. Execute o projeto:
```bash
npm run dev
```

## 🗄️ Estrutura do Projeto

```
src/
├── auth/                    # Módulo de autenticação
│   ├── components/          # UI reutilizável
│   ├── context/            # Contexto e Provider global
│   ├── hooks/              # Hooks customizados
│   ├── pages/              # Páginas de autenticação
│   └── utils/              # Helpers e schemas
│
├── lib/                    # Configurações (Supabase)
└── types/                  # Tipos globais
```

## 🔒 Configuração do Supabase

1. Crie um novo projeto no Supabase
2. Crie a tabela de perfis com o seguinte SQL:
```sql
-- Criar a tabela de perfis
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text unique,
  full_name text,
  bio text,
  website text,
  avatar_url text,
  location text,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Trigger para atualizar o campo updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profile_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

-- Trigger para criar perfil automaticamente
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

-- Habilitar RLS e criar políticas
alter table public.profiles enable row level security;

create policy "Can view own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Can update own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);
```

3. Configure as seguintes opções no Supabase:
   - Habilite "Confirm email" nas configurações de Auth
   - Configure os provedores OAuth (Google)
   - Configure os domínios permitidos para redirecionamento

## 📝 Uso do Sistema de Autenticação

### Contexto de Autenticação

O sistema fornece um contexto global com os seguintes valores e métodos:

```tsx
interface AuthContextType {
  // Estado
  user: AuthUser | null      // Usuário atual
  session: Session | null    // Sessão atual
  loading: boolean          // Estado de carregamento
  error: Error | null       // Erro atual

  // Métodos
  signIn: (params: SignInParams) => Promise<void>
  signUp: (params: SignUpParams) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<void>
}
```

### Protegendo Rotas

Use o componente `PrivateRoute` para proteger páginas que requerem autenticação:

```tsx
import { PrivateRoute } from '@/auth/components/private-route'

function DashboardPage() {
  return (
    <PrivateRoute>
      <div>Conteúdo protegido</div>
    </PrivateRoute>
  )
}
```

### Usando o Hook useAuth

O hook `useAuth` dá acesso ao contexto de autenticação em qualquer componente:

```tsx
import { useAuth } from '@/auth/context/auth-context'

function ProfileButton() {
  const { user, signOut, loading } = useAuth()

  if (loading) return <Spinner />
  if (!user) return null

  return (
    <button onClick={signOut}>
      {user.profile?.full_name ?? 'Usuário'}
    </button>
  )
}
```

### Exemplos de Uso

1. Login com e-mail/senha:
```tsx
const { signIn } = useAuth()

await signIn({
  email: 'user@example.com',
  password: '123456'
})
```

2. Registro de novo usuário:
```tsx
const { signUp } = useAuth()

await signUp({
  email: 'user@example.com',
  password: '123456',
  full_name: 'John Doe'
})
```

3. Atualização de perfil:
```tsx
const { updateProfile } = useAuth()

await updateProfile({
  full_name: 'Novo Nome',
  bio: 'Nova bio'
})
```

4. Recuperação de senha:
```tsx
const { resetPassword } = useAuth()

await resetPassword('user@example.com')
```

## 🔐 Segurança

O sistema implementa as seguintes práticas de segurança:

- Autenticação via Supabase (JWT)
- Row Level Security (RLS) para proteção de dados
- Validação de formulários com Zod
- Proteção contra CSRF
- Sessões persistentes e seguras
- Sanitização de inputs

## 📄 Licença

MIT
