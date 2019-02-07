require('./config/config');

const _ = require('lodash');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const os = require('os');
const bodyParser = require('body-parser');

// About Object destructuring...
  // const obj = { first: 'Jane', last: 'Doe' };
  // const {first: f, last: l} = obj;
      // f = 'Jane'; l = 'Doe'
      // {prop} is short for {prop: prop}
  // const {first, last} = obj;
      // first = 'Jane'; last = 'Doe'

const {ObjectID} = require('mongodb');

const {initializedMongoose} = require('./db/initialized-mongoose.js');

// can I access multiple different MongoDB at the same time?

const {Todo} = require('./models/todo.js');
const {User} = require('./models/user.js');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');

// GET /
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: ':LUMOZ API: | HOME'
  });
});

// POST /todos
app.post('/todos', (req, res) => {

  var todoBody = _.pick(req.body, ['text']);
  var todo = new Todo(todoBody);

  todo.save()
    .then
      (
        (todoDoc) => {
          res.status(200).send(todoDoc);
        }
      )
    .catch
      (
        (error) => {
          res.status(400).send(error);
        }
      )
  ;

});

// POST /users
app.post('/users', (req, res) => {

  var userBody = _.pick(req.body, ['name', 'email', 'password']);
  var user = new User(userBody);

  user.save()
    .then
      (
        () => {
          return user.generateAuthToken();
        }
      )
    .then
      (
        (token) => {
          res.status(200).header('x-auth', token).send(user);
        }
      )
    .catch
      (
        (error) => {
          res.status(400).send(error);
        }
      )
  ;

});

// GET /users
app.get('/users', (req, res) => {

  User.find()
    .then
      (
        (users) => {
          res.status(200).send({users});
        },
        (e) => {
          res.status(400).send(e);
        }
      )
  ;

});

// GET /todos
app.get('/todos', (req, res) => {

  Todo.find()
    .then
      (
        (todos) => {
          res.status(200).send({todos});
        },
        (e) => {
          res.status(400).send(e);
        }
      )
  ;

});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {

  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  };

  Todo.findById(id)
    .then
      (
        (todo) => {
          if (!todo) {
            return res.status(404).send();
          };
          res.status(200).send({todo});
      })
    .catch
      (
        (e) => res.status(400).send(e)
      )
  ;

});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {

  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send(); // 404 Not Found
  };

  Todo.findByIdAndRemove(id)
    .then
      (
        (todo) => {
          if (!todo) {
            return res.status(404).send(); // 404 Not Found
          };
          res.status(200).send({todo}); // 200 OK
        }
      )
    .catch
      (
        (error) => res.status(400).send(error) // 400 Bad Request
      )
  ;

});

// PATCH /todos/:id
app.patch('/todos/:id', (req, res) => {

  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send(); // 404 Not Found
  };

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.compledted = false;
    body.completedAt = null;
  }
  ;

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true})
    .then
      (
        (todo) => {
          if (!todo) {
            return res.status(404).send(); // 404 Not Found
          };
          res.status(200).send({todo}); // 200 OK
        }
      )
    .catch
      (
        (error) => res.status(400).send(error) // 400 Bad Request
      )
  ;

});

// Heroku is going to set the environment variable "process.env.PORT".
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Todo API Server is up on port ${port}`);
});

module.exports = {app};
