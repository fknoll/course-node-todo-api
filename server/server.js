const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

const {initializedMongoose} = require('./db/initialized-mongoose.js');

// can I access multiple different MongoDB at the same time?

const {Todo} = require('./models/todo.js');
const {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());

// POST /todos
app.post('/todos', (req, res) => {
  // console.log(req.body);

  var todo = new Todo({
    text: req.body.text
    // completed: false,
    // completedAt: null
  });

  todo.save()
    .then(
      (doc) => {
        res.send(doc);
      },
      (e) => {
        res.status(400).send(e);
      }
    )
  ;

});

// GET /users
app.get('/users', (req, res) => {

  User.find()
    .then(
      (users) => {
        res.send({users});
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
    .then(
      (todos) => {
        res.send({todos});
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
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      };
      res.send({todo});
    })
    .catch((e) => res.status(400).send())
  ;

});

// Heroku is going to set the environment variable "process.env.PORT".
// If running local, then default port to 3000.
// OBS: The OR operator returns the first value if it’s truthy
//      and the second value if the first value is falsy
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Todo API Server is up on port ${port}`);
});

// var newUser = new User({
//   name: 'Frodo Baggin',
//   age: 34,
//   location: 'Hobbiton, Shire',
//   email: 'frodo.baggin@hobbiton.sh'
// });
//
// newUser.save()
// .then
//   (
//     (doc) => {
//       console.log('Saved user', doc);
//     },
//     (e) => {
//       console.log('Unable to save user:', e);
//     }
//   )
// ;

module.exports = {app};
