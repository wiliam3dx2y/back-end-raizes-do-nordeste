# Raízes do Nordeste
## Descrição
Raízes do Nordeste é uma rede de lanchonetes que surgiu em Recife oferencendo a tradicional comida nordestina. Agora, ela enfrenta desafios operacionais, tecnológicos e organizacionais relacionado com sua crescente expansão.

A solução apresentada é o back-end que suporta o sistema da rede, contendo operações de estoque, pagamento, cardápio, cadastro e login, auditorias e outras funcionalidades.

---

## Requisitos
- Node.js (v24.x.x+)
- PostgreSQl (v19.x+)
- Insomnia

---

## Executando o projeto
### 1. Clone o repositório
```shell
git clone https://github.com/wiliam3dx2y/back-end-raizes-do-nordeste.git
```

---

### 2. Instale as dependências
```shell
npm install
```

---

### 3. Crie o banco de dados
Crie o banco de dados pela interface gráfica com o nome **raizes_nordeste** (ou outro de sua preferência) ou execute o comando via termianal:
```sql
CREATE DATABASE raizes_nordeste;
```

---

### 4. Populando o banco de dados
Conecte-se ao banco de dados.
```shell
\c raizes_nordeste
```
- crie as tabelas do banco de dados: [Tabelas](https://github.com/wiliam3dx2y/back-end-raizes-do-nordeste/blob/main/src/docs/database/tables-database.sql).
- insira os dados de teste nas tabelas: [Dados](https://github.com/wiliam3dx2y/back-end-raizes-do-nordeste/blob/main/src/docs/database/data-database.sql).

---

### 5. Configurando as variáveis ambiente (.env)
O script de execução do servidor no package.json está configurado para ler as variáveis ambiente no arquivo **prod.env**. Portanto, renomeie **.env.exemple** para **prod.env** ou crie o arquivo **prod.env** com os dados do exemplo.
```
DATABASE_URL="postgresql://usuario:sua_senha@localhost:5432/nome_do_banco"
JWT_SECRET=senhajwt
PORT=3000
```

---

### 6. Iniciando servidor
```
npm run dev
```

---

## Documentação das rotas com Swagger
Acesse a rota http://localhost:3000/api-docs.


## Plano de testes
### Dados inseridos para teste
- **unidades:**
```json
[
  {
    "id": "ffffffff-ffff-ffff-ffff-ffffffffffff",
    "nome": "Brigadeiro Galvão - Barra Funda"
  }
]
```

- **usuários:**
```json
[
    {
        "email": "admin@raizesnordeste.com",
        "senha": "admin",
        "role": "admin"
    },
    {
        "email": "cozinha@raizesnordeste.com",
        "senha": "cozinha",
        "role": "cozinha"
    },
    {
        "email": "atendimento@raizesnordeste.com",
        "senha": "atendente",
        "role": "atendente"
    },
    {
        "email": "cliente@raizesnordeste.com",
        "senha": "cliente",
        "role": "cliente"
    }
]
```

- **produtos:**
```json
[
  {
    "id": "cccccccc-0000-0000-0000-000000000001",
    "unidade_id": "fffffffff-ffff-ffff-ffff-ffffffffffff",
    "nome": "Feijoada Completa Premium",
    "descricao": "Feijoada tradicional com feijão preto, calabresa, paio, bacon, costelinha e lombo. Acompanha arroz, couve, farofa e fatias de laranja.",
    "ativo": true,
    "preco": "69.90"
  },
  {
    "id": "cccccccc-0000-0000-0000-000000000002",
    "unidade_id": "fffffffff-ffff-ffff-ffff-ffffffffffff",
    "nome": "Cuscuz Nordestino Tradicional",
    "descricao": "Cuscuz de flocos de milho na manteiga, acompanhado de queijo coalho grelhado, ovos e carne de sol desfiada.",
    "ativo": true,
    "preco": "24.50"
  }
]
```

---

### Executando testes com Insomnia
#### Requisitos
É necessário o arquivo da Collection com os requests e do arquivo do Environment com as variáveis ambiente.
- [Collection](https://github.com/wiliam3dx2y/back-end-raizes-do-nordeste/blob/main/src/docs/plano%20de%20testes%20-%20insomnia/API-Ra%C3%ADzes-do-Nordeste-Collection.yaml).
- [Environment](https://github.com/wiliam3dx2y/back-end-raizes-do-nordeste/blob/main/src/docs/plano%20de%20testes%20-%20insomnia/API-Ra%C3%ADzes-do-Nordeste-Environment.yaml).

#### Execução
Os testes são dividos em duas pastas principais: o **Fluxo Principal** e **Outros Cenários**. Os requests do **Fluxo Principal** devem ser executados na ordem de numeração manualmente ou com um plugin de testes. Enquanto, os requests em **Outros Cenários** são executados isoladamente, mas sendo necessário executar antes os requests de login como cliente ou como admin conforme o cenário de teste.
