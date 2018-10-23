const {ObjectID} = require('mongodb');
const {initializedMongoose} = require('./../server/db/initialized-mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

var todoId = '5bcdcbb2be7cd938c8be3def'; // id is in the todos collection
// var todoId = '6bcdcbb2be7cd938c8be3def'; // valid id, but not in the todos collection
// var todoId = '5bcdcbb2be7cd938c8be3def11'; // invalid id

if (!ObjectID.isValid(todoId)) {
  console.log('Todo ID is not valid');
};

var userId = '5ba8e6729ee12343c4995f97'; // id is in the users collection
// var userId = '6ba8e6729ee12343c4995f97'; // valid id, but not in the users collection
// var userId = '5ba8e6729ee12343c4995f9711'; // invalid id

if (!ObjectID.isValid(userId)) {
  console.log('User ID is not valid');
};

Todo.find({_id: todoId})
  .then((todos) => {
    console.log('Todos:', JSON.stringify(todos, undefined, 2));
  })
;

Todo.findOne({_id: todoId})
  .then((todo) => {
    console.log('Todo:', JSON.stringify(todo, undefined, 2));
  })
;

Todo.findById(todoId)
  .then((todo) => {
    if (!todo) {
      return console.log('Todo by Id:', 'Unable to find todo!');
    };
    console.log('Todo by Id:', JSON.stringify(todo, undefined, 2));
  })
  .catch((e) => console.log(e.message))
;

User.findById(userId)
  .then((user) => {
    if (!user) {
      return console.log('User by Id:', 'Unable to find user!');
    };
    console.log('User by Id:', JSON.stringify(user, undefined, 2));
  })
  .catch((e) => console.log(e.message))
;
