var myMongoose = require('mongoose');

myMongoose.Promise = global.Promise;

myMongoose.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true});

module.exports = {
  mongoose: myMongoose
};
