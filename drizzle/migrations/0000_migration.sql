create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Usuário vê seus papéis" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create table public.solicitacoes (
  id uuid primary key default gen_random_uuid(),
  produto text not null check (produto in ('entrevista','materia','combo')),
  valor numeric(10,2) not null,
  nome text not null check (char_length(nome) between 2 and 150),
  email text not null check (char_length(email) <= 255),
  whatsapp text not null check (char_length(whatsapp) <= 30),
  profissao text not null check (char_length(profissao) <= 200),
  cidade text not null check (char_length(cidade) <= 120),
  respostas jsonb not null default '{}'::jsonb,
  contatos jsonb not null default '{}'::jsonb,
  fotos jsonb not null default '[]'::jsonb,
  autorizacao boolean not null default false check (autorizacao = true),
  status text not null default 'aguardando pagamento',
  created_at timestamptz not null default now()
);
grant insert on public.solicitacoes to anon, authenticated;
grant select, update, delete on public.solicitacoes to authenticated;
grant all on public.solicitacoes to service_role;
alter table public.solicitacoes enable row level security;
create policy "Qualquer pessoa envia solicitação" on public.solicitacoes for insert to anon, authenticated
  with check (status = 'aguardando pagamento');
create policy "Admin lê solicitações" on public.solicitacoes for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin atualiza solicitações" on public.solicitacoes for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin remove solicitações" on public.solicitacoes for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Envio anônimo de arquivos" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'solicitacoes');
create policy "Admin lê arquivos" on storage.objects for select to authenticated
  using (bucket_id = 'solicitacoes' and public.has_role(auth.uid(), 'admin'));