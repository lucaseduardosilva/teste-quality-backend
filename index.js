const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("./clientes.db");

app.use(cors());
app.use(bodyParser.json());

// Criar tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idUsuario INTEGER,
    DataHoraCadastro TEXT,
    Codigo TEXT,
    Nome TEXT,
    CPF_CNPJ TEXT,
    CEP TEXT,
    Logradouro TEXT,
    Endereco TEXT,
    Numero TEXT,
    Bairro TEXT,
    Cidade TEXT,
    UF TEXT,
    Complemento TEXT,
    Fone TEXT,
    LimiteCredito REAL,
    Validade TEXT
  )
`);

// Função para criar cláusulas WHERE dinamicamente
function buildWhereClause(query) {
  const conditions = [];
  const params = [];

  for (const key in query) {
    if (query[key] && key !== "page" && key !== "limit") {
      conditions.push(`${key} LIKE ?`);
      params.push(`%${query[key]}%`);
    }
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  return { whereClause, params };
}

// Listar com filtro e paginação
app.get("/clientes", (req, res) => {
  const { page = 1, limit = 10, ...filters } = req.query;
  const offset = (page - 1) * limit;

  const { whereClause, params } = buildWhereClause(filters);

  const sql = `SELECT * FROM clientes ${whereClause} LIMIT ? OFFSET ?`;
  const countSql = `SELECT COUNT(*) AS total FROM clientes ${whereClause}`;

  db.get(countSql, params, (err, countResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const total = countResult.total;

    db.all(sql, [...params, limit, offset], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        items: rows,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      });
    });
  });
});

// Criar
app.post("/clientes", (req, res) => {
  const cliente = req.body;
  const now = new Date().toISOString();
  db.run(
    `
    INSERT INTO clientes (
      idUsuario, DataHoraCadastro, Codigo, Nome, CPF_CNPJ, CEP,
      Logradouro, Endereco, Numero, Bairro, Cidade, UF,
      Complemento, Fone, LimiteCredito, Validade
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      cliente.idUsuario || 1,
      now,
      cliente.Codigo,
      cliente.Nome,
      cliente.CPF_CNPJ,
      cliente.CEP,
      cliente.Logradouro,
      cliente.Endereco,
      cliente.Numero,
      cliente.Bairro,
      cliente.Cidade,
      cliente.UF,
      cliente.Complemento,
      cliente.Fone,
      cliente.LimiteCredito,
      cliente.Validade,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Atualizar
app.put("/clientes/:id", (req, res) => {
  const id = req.params.id;
  const c = req.body;
  db.run(
    `
    UPDATE clientes SET
      Codigo = ?, Nome = ?, CPF_CNPJ = ?, CEP = ?,
      Logradouro = ?, Endereco = ?, Numero = ?, Bairro = ?, Cidade = ?, UF = ?,
      Complemento = ?, Fone = ?, LimiteCredito = ?, Validade = ?
    WHERE id = ?
  `,
    [
      c.Codigo,
      c.Nome,
      c.CPF_CNPJ,
      c.CEP,
      c.Logradouro,
      c.Endereco,
      c.Numero,
      c.Bairro,
      c.Cidade,
      c.UF,
      c.Complemento,
      c.Fone,
      c.LimiteCredito,
      c.Validade,
      id,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// Deletar
app.delete("/clientes/:id", (req, res) => {
  db.run(`DELETE FROM clientes WHERE id = ?`, req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(3001, () => console.log("API rodando em http://localhost:3001"));
