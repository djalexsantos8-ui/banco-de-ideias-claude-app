-- Migration 001: Schema inicial
-- Criação da tabela ideias com pgvector

create extension if not exists vector;

create table if not exists public.ideias (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  conteudo text not null,
  tipo_midia text default 'texto',
  url_midia text,
  resumo text,
  tags text[],
  categoria text,
  potencial text,
  embedding vector(1536),
  aprovada boolean default false,
  criado_em timestamp with time zone default now()
);

alter table ideias enable row level security;

create policy "Acesso proprio" on public.ideias
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function buscar_similares(
  query_embedding vector(1536),
  user_id_param uuid,
  match_count int default 3
)
returns table (
  id uuid, titulo text, conteudo text,
  resumo text, tags text[], categoria text,
  potencial text, similarity float
)
language sql stable as $$
  select id, titulo, conteudo, resumo, tags, categoria, potencial,
    1 - (embedding <=> query_embedding) as similarity
  from public.ideias
  where user_id = user_id_param and embedding is not null
  order by embedding <=> query_embedding
  limit match_count;
$$;
