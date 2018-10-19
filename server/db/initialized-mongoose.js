var myMongoose = require('mongoose');

myMongoose.Promise = global.Promise;

// Replacing localhost wit 127.0.0.1
// reduce time usage and might fixe problems with timeout...
myMongoose.connect('mongodb://127.0.0.1:27017/TodoApp', {useNewUrlParser: true});

module.exports = {
  initializedMongoose: myMongoose
};
