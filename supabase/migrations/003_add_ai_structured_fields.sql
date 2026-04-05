-- Migration 003: Campos estruturados da IA (Fase 3)
-- Adiciona os campos do novo schema de análise detalhada de ideias

ALTER TABLE ideias
  ADD COLUMN IF NOT EXISTS visao_ideia TEXT,
  ADD COLUMN IF NOT EXISTS como_funciona TEXT,
  ADD COLUMN IF NOT EXISTS aplicacoes TEXT[],
  ADD COLUMN IF NOT EXISTS pontos_fortes TEXT[],
  ADD COLUMN IF NOT EXISTS desafios TEXT[],
  ADD COLUMN IF NOT EXISTS requisitos TEXT[],
  ADD COLUMN IF NOT EXISTS o_que_fazer TEXT,
  ADD COLUMN IF NOT EXISTS proximos_passos TEXT[];
