const express = require('express');
const expensesItems = require('./src/expenses.json');

const path = require("path");

let cache = expensesItems;

const ExpensesService = require('./src/expensesService');
 
const PORT = process.env.PORT || 3010;
const app = express();
app.use(express.json());
 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', ['GET', 'POST', 'PUT', 'DELETE']);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/expenses', (req, res) => {
  cache.length ? res.json({ data: cache }) : res.json({ data: expensesItems });
});

app.get('/api/statistics', async (req, res) => {
  const expensesService = new ExpensesService(path.join(__dirname, './src/expenses.json'));
  const statisticsData = await expensesService.getStatistics(req.query.periodType);
  res.json({ data: statisticsData });
});

app.put('/expenses', async (request, response, next) => {
  const expensesService = new ExpensesService(path.join(__dirname, './src/expenses.json'));
  let { id, date, category, sum, comment } = request.body;
  cache[id] = {id, date, category, sum, comment};
  await expensesService.editItem({id, date, category, sum, comment});
  
  response.send('updated');
}); 

app.delete('/expenses', async (request, response, next) => {
  const expensesService = new ExpensesService(path.join(__dirname, './src/expenses.json'));
  var id = request.body.id;
  cache = cache.filter(elem => elem.id != id);

  for (let i=0; i < cache.length; i++) {
    cache[i].id = i;
  }
  await expensesService.deleteItem(cache);
  
  response.send('deleted');
}); 

app.post('/expenses', async (request, response, next) => {
  const expensesService = new ExpensesService(path.join(__dirname, './src/expenses.json'));
   let { id, date, category, sum, comment } = request.body;
   if (!id) {
    id = cache.length;
   }

   cache.push({id, date, category, sum, comment});
   await expensesService.addItem({id, date, category, sum, comment});
  
  response.send('added');
});  

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});