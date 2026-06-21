-- criando franquia e unidade
INSERT INTO unidades (id, nome) VALUES ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Brigadeiro Galvão - Barra Funda');

-- criando itens de estoque
-- itens para feijoada
INSERT INTO estoque (id, unidade_id, nome, unidade_de_medida, estoque_atual, estoque_minimo)
VALUES 
  ('eeeeeeee-0000-0000-0000-000000000020', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Feijão Preto', 'kg', 15.00, 3.00),
  ('eeeeeeee-0000-0000-0000-000000000021', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Linguiça Calabresa', 'kg', 8.00, 2.00),
  ('eeeeeeee-0000-0000-0000-000000000022', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Bacon Defumado', 'kg', 5.00, 1.00),
  ('eeeeeeee-0000-0000-0000-000000000023', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Costelinha de Porco Salgada', 'kg', 6.50, 1.50),
  ('eeeeeeee-0000-0000-0000-000000000024', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Carne Seca', 'kg', 7.00, 2.00),
  ('eeeeeeee-0000-0000-0000-000000000025', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Lombo de Porco Salgado', 'kg', 4.00, 1.00),
  ('eeeeeeee-0000-0000-0000-000000000026', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Paio', 'kg', 5.00, 1.00),
  ('eeeeeeee-0000-0000-0000-000000000027', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Cebola', 'kg', 10.00, 2.00),
  ('eeeeeeee-0000-0000-0000-000000000028', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Alho', 'kg', 3.00, 0.50),
  ('eeeeeeee-0000-0000-0000-000000000029', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Louro em Folhas', 'g', 100.00, 20.00),
  ('eeeeeeee-0000-0000-0000-000000000030', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Couve Manteiga', 'kg', 4.00, 1.00),
  ('eeeeeeee-0000-0000-0000-000000000031', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Farinha de Mandioca', 'kg', 12.00, 3.00),
  ('eeeeeeee-0000-0000-0000-000000000032', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Laranja Pera', 'kg', 15.00, 4.00)
ON CONFLICT (id) DO UPDATE SET 
  estoque_atual = EXCLUDED.estoque_atual,
  estoque_minimo = EXCLUDED.estoque_minimo;

-- cuscuz nordestino
INSERT INTO estoque (id, unidade_id, nome, unidade_de_medida, estoque_atual, estoque_minimo)
VALUES 
  ('eeeeeeee-0000-0000-0000-000000000040', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Farinha de Milho Flocada (Flocão)', 'kg', 20.00, 5.00),
  ('eeeeeeee-0000-0000-0000-000000000041', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Manteiga com Sal', 'kg', 4.00, 1.00),
  ('eeeeeeee-0000-0000-0000-000000000042', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Queijo Coalho', 'kg', 6.00, 1.50),
  ('eeeeeeee-0000-0000-0000-000000000043', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Carne de Sol', 'kg', 8.00, 2.00),
  ('eeeeeeee-0000-0000-0000-000000000044', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Ovos', 'unidade', 500.00, 100.00), -- medido em gramas para manter compatibilidade numérica
  ('eeeeeeee-0000-0000-0000-000000000045', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Leite Integral', 'litro', 12.00, 3.00),
  ('eeeeeeee-0000-0000-0000-000000000046', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'Café em Pó', 'kg', 5.00, 1.00)
ON CONFLICT (id) DO UPDATE SET 
  estoque_atual = EXCLUDED.estoque_atual,
  estoque_minimo = EXCLUDED.estoque_minimo;

-- itens da feijoada e cuscuz no cardápio
INSERT INTO cardapio_produtos (id, unidade_id, nome, descricao, preco, ativo)
VALUES 
  (
    'cccccccc-0000-0000-0000-000000000001', 
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 
    'Feijoada Completa Premium', 
    'Feijoada tradicional com feijão preto, calabresa, paio, bacon, costelinha e lombo. Acompanha arroz, couve, farofa e fatias de laranja.', 
    69.90, 
    TRUE
  ),
  (
    'cccccccc-0000-0000-0000-000000000002', 
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 
    'Cuscuz Nordestino Tradicional', 
    'Cuscuz de flocos de milho na manteiga, acompanhado de queijo coalho grelhado, ovos e carne de sol desfiada.', 
    24.50, 
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET 
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  preco = EXCLUDED.preco,
  ativo = EXCLUDED.ativo;

-- criando receitas para os novos produtos do cardápio
INSERT INTO receita_produtos (id, produto_cardapio_id, estoque_item_id, quantidade)
VALUES 
  -- Vinculando ao 'Feijoada Completa Premium' (id: cccccccc-0000-0000-0000-000000000001)
  
  -- 180g de Feijão Preto (unidade: kg -> 0.18)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000020', 0.18),
  
  -- 80g de Linguiça Calabresa (unidade: kg -> 0.08)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000021', 0.08),
  
  -- 50g de Bacon Defumado (unidade: kg -> 0.05)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000022', 0.05),
  
  -- 100g de Costelinha de Porco Salgada (unidade: kg -> 0.10)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000023', 0.10),
  
  -- 80g de Carne Seca (unidade: kg -> 0.08)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000024', 0.08),
  
  -- 60g de Lombo de Porco Salgado (unidade: kg -> 0.06)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000025', 0.06),
  
  -- 60g de Paio (unidade: kg -> 0.06)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000026', 0.06),
  
  -- 40g de Cebola (unidade: kg -> 0.04)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000027', 0.04),
  
  -- 15g de Alho (unidade: kg -> 0.015)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000028', 0.015),
  
  -- 2g de Louro em Folhas (unidade: g -> 2.00)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000029', 2.00),
  
  -- 120g de Couve Manteiga (unidade: kg -> 0.12)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000030', 0.12),
  
  -- 80g de Farinha de Mandioca (unidade: kg -> 0.08)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000031', 0.08),
  
  -- 150g de Laranja Pera (unidade: kg -> 0.15)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000032', 0.15),


  -- Vinculando ao 'Cuscuz Nordestino Tradicional' (id: cccccccc-0000-0000-0000-000000000002)
  
  -- 150g de Farinha de Milho Flocada (unidade: kg -> 0.15)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000040', 0.15),
  
  -- 30g de Manteiga com Sal (unidade: kg -> 0.03)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000041', 0.03),
  
  -- 80g de Queijo Coalho (unidade: kg -> 0.08)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000042', 0.08),
  
  -- 100g de Carne de Sol (unidade: kg -> 0.10)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000043', 0.10),
  
  -- 2 unidades de Ovos
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000044', 2.00);


-- pedidos
-- 1. Criar o cabeçalho do pedido (Prefixo 'f' de Fatura/Pedido)
INSERT INTO pedidos (id, unidade_id, total, canal_pedido, forma_pagamento, status)
VALUES (
    'ffffffff-0000-0000-0000-000000000001', 
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 
    69.90, 
    'balcão', 
    'dinheiro', 
    'cozinha'
) ON CONFLICT (id) DO NOTHING;

-- 2. Adicionar os itens ao pedido (Prefixo 'b' de 'Base Itens')
INSERT INTO pedido_itens (id, pedido_id, produto_cardapio_id, quantidade, preco_unidade, subtotal)
VALUES 
  (
    'bbbbbbbb-0000-0000-0000-000000000001', 
    'ffffffff-0000-0000-0000-000000000001', 
    'cccccccc-0000-0000-0000-000000000001', -- ID da feijoada
    1, 
    69.90, 
    69.90
  ) ON CONFLICT (id) DO NOTHING;

-- pagamento pedido
INSERT INTO pagamentos (id, unidade_id, pedido_id, metodo_pagamento, valor, status)
VALUES (
    'dddddddd-0000-0000-0000-000000000001', 
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 
    'ffffffff-0000-0000-0000-000000000001', -- ID do Pedido que criamos
    'mock', 
    64.40, 
    'pendente'
) ON CONFLICT (id) DO NOTHING;

-- criando usuários
-- Popula a tabela de usuários
INSERT INTO usuarios (id, unidade_id, nome, email, senha, role, ativo_pontos, pontos)
VALUES 
  (
    'aaaaaaaa-0000-0000-0000-000000000001', 
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 
    'Nelson Arantes', 
    'admin@raizesnordeste.com', 
    '$2a$10$gF.yPOa7aMuPfySj0jgbxu8wOqxH3IEfkMSrMmPVhcwaxYPKESJvS', 
    'admin', 
    FALSE, 
    0
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000002', 
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 
    'José Alencar', 
    'cozinha@raizesnordeste.com', 
    '$2a$10$oFuFOxEM5Pkh9fQmqu2zSuosVaKAiG7SJdExcdxefbHcJUACpspba', 
    'cozinha', 
    FALSE, 
    0
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000003', 
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 
    'Paula Dias', 
    'atendimento@raizesnordeste.com', 
    '$2a$10$qcCaZzE.JxyjORD637tlKuPtmPk1pp69nWwOGkaH2kt0uUnUUQKJ6', 
    'atendente', 
    FALSE, 
    0
  ),
  (
    'aaaaaaaa-0000-0000-0000-000000000004', 
    'ffffffff-ffff-ffff-ffff-ffffffffffff', 
    'Carolina Santos', 
    'cliente@raizesnordeste.com', 
    '$2a$10$PuHVuv1X58uT7yjBE1lBnu/f75m3v7iDFuR0yi4SfizPkgxYTZZYi', 
    'cliente', 
    TRUE, 
    150.5
  )
ON CONFLICT (email) DO UPDATE SET 
  nome = EXCLUDED.nome,
  senha = EXCLUDED.senha,
  role = EXCLUDED.role,
  pontos = EXCLUDED.pontos;