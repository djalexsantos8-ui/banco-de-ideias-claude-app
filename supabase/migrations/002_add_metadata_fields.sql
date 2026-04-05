-- Migration 002: Campos de metadados (titulo, detalhamento, score)

ALTER TABLE ideias
  ADD COLUMN IF NOT EXISTS titulo TEXT,
  ADD COLUMN IF NOT EXISTS detalhamento TEXT,
  ADD COLUMN IF NOT EXISTS potencial_score INTEGER,
  ADD COLUMN IF NOT EXISTS dificuldade TEXT,
  ADD COLUMN IF NOT EXISTS custo_estimado TEXT;
