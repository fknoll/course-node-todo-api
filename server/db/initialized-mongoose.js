var myMongoose = require('mongoose');

myMongoose.Promise = global.Promise;

//https://stackoverflow.com/questions/51916630/mongodb-mongoose-collection-find-options-deprecation-warning
myMongoose.set('useCreateIndex', true);

//https://github.com/Automattic/mongoose/issues/6880
myMongoose.set('useFindAndModify', false);

myMongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true});

module.exports = {
  initializedMongoose: myMongoose
};
