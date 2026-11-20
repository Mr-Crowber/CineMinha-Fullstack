# Integração CineMinha

O app, o site e a dashboard utilizam a mesma API ASP.NET Core em `cineMinha_backend/cineMinha` e o mesmo banco MySQL `cinema`.

## Endereço local

Crie `CineMinha-Dashboard/.env` com:

```env
VITE_API_URL=http://localhost:5266
```

O upload de pôsteres e banners retorna caminhos relativos servidos pelo backend, para que os arquivos funcionem no computador, no emulador e em celulares na rede local.

## Fluxos conectados

- Filmes: CRUD em `/api/Filme`; `GET /api/Filme` lista publicados e `GET /api/Filme?incluirNaoPublicados=true` é usado pela dashboard.
- Salas: `GET/POST /api/Sala`.
- Sessões: `GET/POST /api/Sessao`.
- Ingressos: `GET /api/Ingresso`, `GET /api/Ingresso/ocupados?sessaoId=...` e `POST /api/Ingresso`.
- Imagens: `POST /api/Uploads`.

A compra cria uma linha por assento, vinculada a um `pedido_id`; isso preserva o tipo e o valor de cada ingresso e permite agrupar uma compra na dashboard. Os preços são lidos da sessão no servidor.

## Importante

O campo de forma de pagamento atualmente registra a opção selecionada para fins de demonstração. Não há integração com adquirente/gateway e nenhuma cobrança financeira real é realizada. A API está configurada para desenvolvimento local e ainda não implementa autenticação/autorização administrativa; não publique a API aberta na internet sem adicionar esses controles e restringir CORS.
