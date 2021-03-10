const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(customer => customer.username === username);

  if (!user)
    return response.status(400).json({ error: "User not found" });

  request.user = user;
  
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body; 

  const usernameAlreadyInUse = users.find(user => user.username === username);

  if(usernameAlreadyInUse)
    return response.status(400).json({error: "username already in use"});

  const id = uuidv4();

  const newUser = {
    id,
    name,
    username,
    todos: []
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const id = uuidv4();

  const newTodo = {
    id, // precisa ser um uuid
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo)
    return response.status(404).json({error: "todo not found"})

  if(title)
    todo.title = title;

  if(deadline)
    todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo)
    return response.status(404).json({error: "todo not found"})

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;