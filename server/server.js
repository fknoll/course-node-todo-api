const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const os = require("os");
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');

const {initializedMongoose} = require('./db/initialized-mongoose.js');

// can I access multiple different MongoDB at the same time?

const {Todo} = require('./models/todo.js');
const {User} = require('./models/user.js');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.originalUrl}`;
  console.log(log);

  fs.appendFile('server.log', log + os.EOL, (err) => {
    if (err) {
      console.log('Unable to append to server.log.')
    }
  });

  next();
});

// GET /
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: ':LUMOZ API: | HOME'
  });
});

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
        res.status(200).send(doc);
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
    .then(
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
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      };
      res.status(200).send({todo});
    })
    .catch((e) => res.status(400).send())
  ;

});

// DELETE /todos/:id
app.delete('/todos/:id', (req, res) => {

  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send(); // 404 Not Found
  };

  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).send(); // 404 Not Found
      };
      res.status(200).send({todo}); // 200 OK
    })
    .catch((e) => res.status(400).send()) // 400 Bad Request
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
