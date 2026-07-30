# Trackr Delivery

Sistema simplificado de rastreamento de pedidos de delivery, desenvolvido como desafio técnico. Permite cadastro/login de usuários e o gerenciamento de pedidos, com atualização de status em tempo real.

## Stack

**Backend**
- Java 17 + Spring Boot 3.3.2
- Spring Security + JWT (autenticação stateless)
- Spring Data JPA
- H2 Database (modo arquivo)
- Maven

**Frontend**
- React 18 + Vite
- Fetch API (sem bibliotecas externas de HTTP)
- Context API para gerenciamento de sessão

## Estrutura do projeto

```
.
├── src/main/java/com/foody/deliverytracker/
│   ├── config/          # Configuração de segurança e CORS
│   ├── controller/      # Endpoints REST
│   ├── dto/             # Objetos de entrada e saída da API
│   ├── exception/        # Tratamento centralizado de erros
│   ├── model/           # Entidades JPA
│   ├── repository/      # Acesso a dados
│   └── security/        # JWT e filtro de autenticação
├── src/main/resources/
│   └── application.properties
└── frontend/
    └── src/
        ├── components/  # Componentes de UI reutilizáveis
        ├── context/     # Contexto de autenticação
        ├── pages/       # Telas (login/cadastro e pedidos)
        ├── services/    # Cliente HTTP para a API
        └── constants/   # Status de pedido
```

## Como rodar

### Pré-requisitos
- Java 17+
- Maven
- Node.js 18+

### Backend

```bash
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`. O banco H2 é criado automaticamente em `data/delivery.mv.db` na raiz do projeto na primeira execução.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`. Por padrão, ela aponta para a API em `http://localhost:8080` (configurável via `VITE_API_URL`, veja `.env.example`).

## Autenticação

O fluxo usa JWT:

1. `POST /auth/registrar` ou `POST /auth/login` retornam um token
2. O frontend guarda esse token em memória (Context API) — não usa `localStorage`, para reduzir exposição a ataques XSS
3. Toda requisição a `/pedidos/**` envia o token no header `Authorization: Bearer <token>`
4. Se a API responder 401/403, o frontend desloga o usuário automaticamente

## Endpoints da API

| Método | Rota | Autenticado | Descrição |
|---|---|---|---|
| POST | `/auth/registrar` | Não | Cadastra usuário (nome, e-mail, senha) |
| POST | `/auth/login` | Não | Autentica e retorna token |
| POST | `/pedidos` | Sim | Cria um pedido |
| GET | `/pedidos` | Sim | Lista todos os pedidos |
| GET | `/pedidos/{id}` | Sim | Busca um pedido por ID |
| PATCH | `/pedidos/{id}/status` | Sim | Atualiza o status do pedido |

Status possíveis: `RECEBIDO`, `EM_PREPARO`, `SAIU_PARA_ENTREGA`, `ENTREGUE`, `CANCELADO`.

## Decisões técnicas

**H2 em vez de SQLite.** O driver de SQLite para Hibernate (`sqlite-dialect`) é uma dependência pouco mantida no Maven Central e gerou instabilidade durante o setup. Optei por H2 em modo arquivo: mesmo princípio (banco embarcado, arquivo único, zero configuração de servidor), porém com suporte nativo e estável no ecossistema Spring.

**JWT em vez de sessão.** API stateless é mais consistente com o padrão REST e evita depender de estado em memória no servidor, o que facilita escalar horizontalmente.

**Token em memória no frontend, não em `localStorage`.** Prioriza segurança (proteção contra XSS) mesmo custando persistência entre reloads de página — trade-off aceitável.

**Itens do pedido como lista de strings simples.** O enunciado pede apenas "itens" na criação do pedido, sem preço ou quantidade estruturados. Modelar como entidade separada (`ItemPedido`) adicionaria complexidade sem necessidade real para este escopo.

**Sem vínculo entre usuário e pedido.** O enunciado exige apenas que o acesso ao sistema seja autenticado, não que cada usuário veja apenas os próprios pedidos. Mantive o modelo simples por esse motivo.

## O que não foi feito (fora do escopo do desafio)

- Testes automatizados (unitários/integração)
- Paginação na listagem de pedidos
- Vínculo usuário → pedidos (multi-tenancy)