const express = require('express');
const expensesItems = require('./src/expenses.json');

const path = require("path");

const cache = [];

const ExpensesService = require('./src/expensesService');
 
const PORT = process.env.PORT || 3010;
const app = express();
app.use(express.json());
 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST']);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/expenses', (req, res) => {
  cache.length ? res.json({ data: cache }) : res.json({ data: expensesItems });
});

app.post('/expenses', async (request, response, next) => {
  const expensesService = new ExpensesService(path.join(__dirname, './src/expenses.json'));
   let { id, date, category, sum, comment } = request.body;
   if (!id) {
    const expenses = await expensesService.getList();
    id = expenses.length;
   }

   cache.push({id, date, category, sum, comment});
   await expensesService.addEntry({id, date, category, sum, comment});
  
  response.send('added');
});  

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});