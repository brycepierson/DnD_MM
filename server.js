const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static('public'))

let items = [];
let id = 0;

app.get('/api/cart', (req, res) => {
  res.send(items);
});

app.post('/api/cart', (req, res) => {
  id = id + 1;
  console.log("response");
  console.log(req.body.monster);
  let item = JSON.parse(req.body.monster);
  items.push(item);
  res.send(item);
});

app.put('/api/cart/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = items.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = items[index];
  item.completed = req.body.completed;
  item.priority = req.body.priority;
  item.text = req.body.text;
  // handle drag and drop re-ordering
  if (req.body.orderChange) {
    let indexTarget = itemsMap.indexOf(req.body.orderTarget);
    items.splice(index,1);
    items.splice(indexTarget,0,item);
  }
  res.send(item);
});

app.delete('/api/cart/:name', (req, res) => {
  let name = req.params.name;
  console.log(name);
  let removeIndex = items.map(item => { return item.name.replace(/\s+/g, '-'); }).indexOf(name);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(4000, () => console.log('Server listening on port 4000!'));
