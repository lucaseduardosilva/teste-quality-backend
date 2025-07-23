# 🛠️ Cadastro de Clientes – Backend (Node.js + Express + SQLite)

Este projeto é a API REST para um sistema de cadastro de clientes, desenvolvida em **Node.js** com **Express** e **SQLite**. Fornece suporte completo a operações CRUD, além de filtros e integração com o frontend.

---

## 🚀 Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express 5](https://expressjs.com/)
- [SQLite3](https://www.sqlite.org/)

---

## 📦 Funcionalidades da API

- ✅ Criar cliente
- 🔄 Atualizar cliente
- ❌ Deletar cliente
- 📄 Listar clientes
- 🔍 Buscar por `Código`, `Nome`, `Cidade`, `CEP`

---

## 🧾 Estrutura da tabela `clientes`

| Campo             | Tipo         |
|------------------|--------------|
| id               | bigint (PK)  |
| idUsuario        | bigint       |
| dataHoraCadastro | datetime     |
| codigo           | varchar(15)  |
| nome             | varchar(150) |
| cpf_cnpj         | varchar(20)  |
| cep              | integer      |
| logradouro       | varchar(100) |
| endereco         | varchar(120) |
| numero           | varchar(20)  |
| bairro           | varchar(50)  |
| cidade           | varchar(60)  |
| uf               | varchar(2)   |
| complemento      | varchar(150) |
| fone             | varchar(15)  |
| limiteCredito    | float        |
| validade         | date         |

---
