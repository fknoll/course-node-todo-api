var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());

// POST /todos
app.post('/todos', (req, res) => {
  console.log(req.body);

  var todo = new Todo({
    text: req.body.text
    // completed: false,
    // completedAt: null
  });

  todo.save()
  .then
    (
      (doc) => {
        res.send(doc);
        console.log('Saved todo', doc);
      },
      (e) => {
        res.send(doc);
        console.log('Unable to save todo:', e);
      }
    )
  ;
});

// Heroku is going to set the environment variable "process.env.PORT".
// If running local, then default port to 3000.
// OBS: The OR operator returns the first value if it’s truthy
//      and the second value if the first value is falsy
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
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
