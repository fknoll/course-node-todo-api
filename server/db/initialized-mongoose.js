var myMongoose = require('mongoose');

myMongoose.Promise = global.Promise;

//https://stackoverflow.com/questions/51916630/mongodb-mongoose-collection-find-options-deprecation-warning
myMongoose.set('useCreateIndex', true);

//https://github.com/Automattic/mongoose/issues/6880
myMongoose.set('useFindAndModify', false);    

// Replacing localhost wit 127.0.0.1
// reduce time usage and might fixe problems with timeout...
myMongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/TodoApp', {useNewUrlParser: true});

module.exports = {
  initializedMongoose: myMongoose
};
