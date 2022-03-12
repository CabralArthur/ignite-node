const express = require('express');


const app = express();

app.use(express.json());

// =-=-=- Métodos HTTP -=-=-=-

// GET - Buscar informação
// POST - Adicionar informação
// PUT - Atualizar informação
// PATCH - Atualizar informação específica
// DELETE - Deletar informação

// Browser só aceita métodos GET

// =-=-=- Tipos de parâmetros -=-=-=-

// Route Params => Parâmetros inseridos dentro da rota, já esperados
    // Utilizados para identificar um recurso com o objetivo de editar / deletar / buscar o mesmo

// Query Params => Utilizados geralmente para paginação / filtros / pesquisas

// Body Params => Utilizados para inserção / atualização (Changes)


app.get("/courses", (req, res) => {
    return res.json(['Curso 1', 'Curso 2', 'Curso 3']);
});

app.post("/courses", (req, res) => {
    return res.json(['Curso 1', 'Curso 2', 'Curso 3', 'Curso 4']);
});

app.put("/courses/:id", (req, res) => {
    return res.json(['Curso 6', 'Curso 2', 'Curso 3', 'Curso 4']);
});

app.patch("/courses/:id", (req, res) => {
    return res.json(['Curso 6', 'Curso 9', 'Curso 3', 'Curso 4']);
});

app.delete("/courses/:id", (req, res) => {
    return res.json(['Curso 6', 'Curso 9', 'Curso 3']);
});

app.listen(3333, () => console.log('Application running!'));