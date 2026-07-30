# Trackr Delivery

Sistema de rastreamento de pedidos de delivery, feito como desafio técnico. Usuário cadastra, loga, cria pedidos e acompanha o status de cada um.

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

**H2 em vez de SQLite.** Tentei SQLite primeiro, mas o driver de Hibernate pra ele (`sqlite-dialect`) é mal mantido no Maven Central e ficou dando problema no setup. Troquei pra H2 em modo arquivo — resolve o mesmo problema (banco embarcado, um arquivo só, sem servidor pra configurar) com suporte nativo no Spring.

**JWT em vez de sessão.** API sem estado é o padrão pra REST e não depende de guardar nada em memória no servidor.

**Token guardado em memória no frontend, não em `localStorage`.** Perde a sessão se der refresh na página, mas evita exposição a XSS. Pra esse escopo, vale a troca.

**Itens do pedido são só uma lista de strings.** O enunciado pede "itens" sem falar de preço ou quantidade, então não criei uma entidade `ItemPedido` separada — seria complexidade que ninguém pediu.

**Pedido não tem dono.** O enunciado pede que o acesso seja autenticado, não que cada usuário veja só os próprios pedidos. Por isso não modelei esse vínculo.

## Testando a API
 
O arquivo `insomnia_collection.json` na raiz do projeto tem os endpoints já prontos pra testar (registro, login, criar pedido, listar, buscar por ID, atualizar status). No Insomnia: `Application > Preferences > Data > Import Data > From File`.
 
Fluxo: roda "Registrar usuário" ou "Login", copia o `token` da resposta, cola na variável `token` do environment, e as requisições de `/pedidos` já saem autenticadas.

## Fora do escopo

- Paginação na listagem de pedidos
- Cada usuário ver só os próprios pedidos (multi-tenancy)
