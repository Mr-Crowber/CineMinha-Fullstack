# ------- CineMinha -------

Projeto de uma API para cadastro e gerenciamento de filmes e compra de ingressos de cinema, desenvolvido em C#.

## > Tecnologias

* C#
* ASP.NET Core
* MySQL
* MySqlConnector
* WAMP
* Swagger

---

## > Banco de dados

O projeto usa MySQL através do WAMP.

Primeiro, deixe o MySQL do WAMP iniciado e crie o banco `cinema` no phpMyAdmin:

```sql
CREATE DATABASE cinema;

USE cinema;

CREATE TABLE ingressos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filme_id INT NOT NULL,
    nome_cliente VARCHAR(100) NOT NULL,
    data_sessao DATE NOT NULL,
    horario TIME NOT NULL,
    sala INT NOT NULL,
    quantidade INT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (filme_id) REFERENCES filmes(id)
);
```

A tabela `ingressos` armazena as compras realizadas. O campo `filme_id` indica qual filme foi escolhido.

Depois, confira a conexão no `appsettings.json`:

```json
"DefaultConnection": "server=localhost;port=3306;database=cinema;user=root;password=;"
```

## > Como rodar

Abra o terminal na pasta do projeto e execute:

```
dotnet restore

dotnet build

dotnet run
```

A API ficará disponível em:

`http://localhost:5266`

Para testar pelo Swagger:

`http://localhost:5266/swagger`

---

# > Estrutura do projeto

### Controllers

Recebem as requisições da API e realizam as operações do CRUD.

`IngressoController` trabalha com os ingressos.

### DTOs

Organizam os dados que entram e saem da API.

temos:

* `IngressoCreateDTO`
* `IngressoUpdateDTO`
* `IngressoResponseDTO`


# > Compra de ingresso

Para realizar uma compra, o usuário informa:

* Filme
* Nome do cliente
* Data da sessão
* Horário
* Sala
* Quantidade de ingressos

O sistema calcula automaticamente:

```text
valor_total = valor_unitario × quantidade
```

O valor unitário utilizado atualmente é de R$ 30,00.

---

# > Exemplo de compra

```json
{
    "filmeId": 1,
    "nomeCliente": "Julia",
    "dataSessao": "2026-09-25",
    "horario": "19:30:00",
    "sala": 3,
    "quantidade": 2
}
```

Nesse exemplo, foram comprados 2 ingressos.

R$ 30,00 × 2 = R$ 60,00


O valor total é calculado pela própria API.
