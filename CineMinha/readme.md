# CineMinha — Documentação das alterações

## 1. Sobre as alterações

Foi iniciada a integração entre o aplicativo CineMinha e a API responsável pelo cadastro e gerenciamento dos filmes.

O objetivo é fazer com que os filmes cadastrados pela dashboard sejam carregados automaticamente no aplicativo, sem precisar adicioná-los manualmente ao arquivo de filmes de demonstração.

## 2. Organização dos arquivos

Alguns arquivos foram retirados de `src/app` e colocados diretamente em `src` para evitar que o Expo Router interprete arquivos auxiliares como páginas.

Estrutura atual:

```text
src/
├── app/
│   └── index.tsx
├── services/
│   └── api.ts
├── movies.ts
└── styles.ts
```

### Para que serve cada arquivo?

- **`app/index.tsx`**: tela inicial do aplicativo. Contém a lógica de exibição, pesquisa, filtros, destaques e grade de filmes.
- **`services/api.ts`**: responsável pela comunicação com a API e pelo carregamento dos filmes cadastrados.
- **`movies.ts`**: contém os filmes de demonstração que já existiam no aplicativo.
- **`styles.ts`**: reúne os estilos utilizados na interface.

## 3. Integração com a API

No arquivo `src/services/api.ts`, foi criada a função:

```ts
getMovies()
```

Ela realiza uma requisição para:

```text
http://localhost:5266/api/Filme
```

Na versão web, o aplicativo utiliza `localhost`. Na versão mobile, utiliza o IP local da máquina que hospeda a API.

A função também adapta os dados recebidos da API para o formato utilizado pelo aplicativo.

Entre os campos tratados estão:

- id
- title
- genre
- duration
- rating
- description
- poster
- heroImage
- heroTitle
- heroAccent
- status
- featured

## 4. Carregamento dos filmes

No `src/app/index.tsx`, foi criada uma variável de estado:

```tsx
const [databaseMovies, setDatabaseMovies] = useState<Movie[]>([]);
```

Ela armazena os filmes recebidos da API.

O carregamento acontece por meio de um `useEffect`, que chama `getMovies()` e filtra os filmes com status `"Publicado"`.

Os filmes de demonstração e os filmes recebidos da API são reunidos na variável `allMovies`.

Dessa forma, os dois tipos de filme podem ser utilizados pela pesquisa e pelos filtros da tela inicial.

## 5. Filmes de demonstração e destaques

Os filmes antigos continuam sendo utilizados como demonstração.

Os filmes cadastrados pela dashboard são adicionados separadamente, identificados pela propriedade `_source`, que diferencia:

- `demo`: filmes de demonstração.
- `database`: filmes recebidos da API.

A propriedade `featured` é utilizada para determinar se um filme cadastrado deve aparecer na área de destaques.

Um filme com `featured: false` não deve aparecer nessa área.

## 6. Correções realizadas

Durante a integração, também foram realizados alguns ajustes:

- Movimentação dos arquivos auxiliares para fora de `src/app`.
- Correção de um erro causado por um caractere solto após a importação dos estilos.
- Ajuste da leitura do gênero para aceitar tanto texto quanto lista de gêneros.
- Ajuste da identificação dos filmes para diferenciar IDs dos filmes de demonstração e dos filmes da API.
- Inclusão dos filmes recebidos da API na lista geral utilizada pela tela inicial.

## 7. Problema pendente

**Atenção: a integração ainda não está completamente finalizada.**

A API está respondendo corretamente e o filme cadastrado aparece nos dados recebidos pelo aplicativo.

Também foi confirmado pelos logs que o filme está presente em `allMovies` e `filteredMovies`.

Entretanto, o filme cadastrado ainda não aparece visualmente na grade principal da versão desktop.

O problema não parece estar no recebimento dos dados da API nem nos filtros de pesquisa.

Foi iniciado um teste para identificar se o problema está no container da grade ou na renderização dos componentes.

### O que precisa ser investigado?

1. Verificar o container `styles.moviesGrid`.
2. Verificar se a grade está recebendo espaço e altura suficientes.
3. Investigar possíveis problemas nos elementos pais da grade.
4. Conferir a renderização do componente `MovieCard`.
5. Garantir que os filmes recebidos da API apareçam normalmente junto aos filmes de demonstração.

**Importante:** evitar reescrever a tela inicial ou alterar os estilos gerais antes de identificar a causa. A interface, as animações e os recursos já existentes devem ser preservados.

## 8. Observação para continuar o desenvolvimento

A integração com a API já foi iniciada e está funcionando na etapa de requisição e recebimento dos dados.

O próximo passo é resolver exclusivamente a exibição dos filmes cadastrados na dashboard na grade principal da versão desktop, sem prejudicar os filmes de demonstração, a pesquisa, os filtros ou a área de destaques.