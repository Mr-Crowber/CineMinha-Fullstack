# CineMinha API unificada

Este é o backend compartilhado pelo **dashboard React, site e aplicativo Expo**. A API concentra o catálogo de filmes, as salas, as sessões e as compras de ingressos em um único banco MySQL.

## Requisitos

- .NET SDK 10
- MySQL 8.0+ (o script verifica as colunas ausentes antes de adicioná-las)
- Banco de dados `cinema`

## Preparar o banco

1. Inicie o MySQL.
2. Execute o arquivo `../../cinema.sql` no MySQL Command Line Client ou no Workbench.
3. Opcionalmente, execute `../../cinema-seed.sql` para inserir os filmes que já existiam no protótipo e copiar as imagens que acompanham este projeto.
4. Não apague as tabelas existentes: `cinema.sql` usa `CREATE TABLE IF NOT EXISTS` e adiciona as colunas que faltarem.

O script inicializa também quatro salas. O arquivo de seed evita duplicar filmes pelo título.

## Configurar a conexão

Edite `appsettings.json` ou configure a variável de ambiente `ConnectionStrings__DefaultConnection` com os dados do seu MySQL. Exemplo:

```text
server=localhost;port=3306;database=cinema;user=root;password=SUA_SENHA;CharSet=utf8mb4;
```

Não publique credenciais do banco no Git ou no frontend.

## Executar

Abra um terminal nesta pasta (`cineMinha_backend/cineMinha`) e execute:

```bash
dotnet restore
dotnet run
```

A API ficará em `http://localhost:5266`. O Swagger está em `http://localhost:5266/swagger` e o teste de saúde em `http://localhost:5266/health`.

Inicie somente este projeto. A antiga API separada de ingressos foi incorporada aqui.

## Rotas principais

| Método | Rota | Função |
|---|---|---|
| GET | `/api/Filme` | Lista filmes publicados |
| GET | `/api/Filme?incluirNaoPublicados=true` | Lista todos os filmes para a dashboard |
| GET | `/api/Filme/{id}` | Consulta um filme |
| POST / PUT / DELETE | `/api/Filme` | Cadastro, edição e exclusão |
| GET / POST | `/api/Sala` | Consulta e cadastro de salas |
| GET | `/api/Sessao?filmeId={id}` | Sessões futuras e disponíveis de um filme |
| GET | `/api/Sessao?todas=true` | Todas as sessões, para a dashboard |
| POST | `/api/Sessao` | Agenda uma sessão |
| GET | `/api/Ingresso` | Lista os ingressos registrados |
| GET | `/api/Ingresso/ocupados?sessaoId={id}` | Consulta assentos ocupados |
| POST | `/api/Ingresso` | Registra uma compra com um ou mais assentos |
| POST | `/api/Uploads` | Faz upload de pôsteres e banners |

## Como os pedidos são guardados

Cada assento comprado gera uma linha em `ingressos`. As linhas de uma mesma compra compartilham `pedido_id`, permitindo agrupar todos os ingressos em um pedido. O backend calcula o valor unitário com base nos preços da sessão, aceita até 12 ingressos por pedido e o índice único `(sessao_id, assento)` impede vender duas vezes a mesma cadeira na mesma sessão.

## Endereços dos clientes

- Dashboard: crie `CineMinha-Dashboard/.env` a partir do `.env.example` e configure `VITE_API_URL`.
- App: crie `CineMinha/.env` a partir do `.env.example` e configure `EXPO_PUBLIC_API_URL`. No emulador Android, use `http://10.0.2.2:5266`; em um celular físico, use o IP local do computador que executa a API.
- Site: edite `window.CINEMINHA_API_URL` no início de `CineMinha-site/api.js`. No celular ou em outro computador, use o IP local da máquina do backend.

A API escuta em `0.0.0.0:5266` para aceitar clientes na rede local. Libere TCP `5266` no firewall do computador. No mesmo computador, continue acessando por `http://localhost:5266`.

## Limitações desta versão

A compra grava o pedido, os assentos e a forma de pagamento escolhida, mas **não há integração com gateway de pagamento**: Pix e cartões ainda não são efetivamente cobrados. Também não foi implementada autenticação/autorização de administrador ou cliente. O CORS atual é amplo para desenvolvimento; restrinja origens, proteja a dashboard e configure HTTPS antes de colocar o sistema na internet.
