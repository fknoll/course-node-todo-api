var myMongoose = require('mongoose');

myMongoose.Promise = global.Promise;

myMongoose.connect('mongodb://127.0.0.1:27017/TodoApp', {useNewUrlParser: true});

module.exports = {
  initializedMongoose: myMongoose
};
