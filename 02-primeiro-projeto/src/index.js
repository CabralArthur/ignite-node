const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

app.post('/account', (req, res) => {
    const { cpf, name } = req.body;
    const id = uuidv4();

    const customersAlreadyExist = customers.some(customer => customer.cpf === cpf);

    if (customersAlreadyExist) {
        return res.send({
            code: 400,
            status: 'error',
            message: 'Internal Error - Invalid User!'
        })
    }

    customers.push({
        cpf,
        name,
        id,
        statement: []
    });

    res.send({
        code: 201,
        status: 'success'
    });
});

//Middleware
const validateAccountPresence = (req, res, next) => {
    const { cpf } = req.headers;

    const customer = customers.find(customer => customer.cpf === cpf);

    if (!customer) {
        return res.send({
            code: 200
        });
    }

    req.customer = customer;

    next();
};

app.put('/account', validateAccountPresence, (req, res) => {
    const customer = req;
    const name = req.body;

    customer.name = name;

    return res.send({
        code: 201,
        status: 'success'
    })
});

app.get('/account', validateAccountPresence, (req, res) => {
    const customer = req;

    return res.json(customer);
});

app.delete('/account', validateAccountPresence, (req, res) => {
    const { customer } = req;

    customers.splice(customer, 1);

    return res.send({
        code: 200,
        status: 'success'
    });
});

const getBalance = statement => {
    return statement.reduce((acc, operation) => {
        if (operation.type === 'credit') {
            return acc + operation.amount;
        } else {
            return acc + operation.amount;
        }
    }, 0)
}

// Todas rotas irão usar o middleware
// app.use(validateAccountPresence);

app.get('/statement', validateAccountPresence, (req, res) => {
    const { customer } = req;

    return res.json(customer.statement);
});

app.get('/balance', validateAccountPresence, (req, res) => {
    const { customer } = req;

    const balance = getBalance(customer.statement);

    return res.json(balance);
});

app.get('/statement/date', validateAccountPresence, (req, res) => {
    const { customer } = req;
    const { date } = req.query;

    const dateFormatted = new Date(date + " 00:00");

    const statements = customer.statement.filter(statement => {
        statement.created_at.toDateString() === new Date(dateFormatted).toDateString()
    });

    return res.json(statements);
});

app.post('/deposit', validateAccountPresence, (req, res) => {
    const { customer } = req;
    const { description, amount } = req.body;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit'
    };

    customer.statement.push(statementOperation);

    res.send({
        code: 201,
        status: 'success'
    });
});

app.post('/withdraw', validateAccountPresence, (req, res) => {
    const { customer } = req;
    const { description, amount } = req.body;

    const balance = getBalance(customer.statement);

    if (balance < amount) {
        res.send({
            code: 200,
            status: 'success',
            message: 'Insufficiente funds!'
        });
    }

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'debit'
    };

    customer.statement.push(statementOperation);

    res.send({
        code: 201,
        status: 'success'
    });
});

app.listen(3333, () => {
    console.log('API financeira iniciada');
})