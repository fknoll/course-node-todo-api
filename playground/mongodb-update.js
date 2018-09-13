// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser: true}, (error, client) => {

  if (error) {
    return console.log('>>> Unable to connect to MongoDB server:', error);
  };

  console.log('>>> Connected to MongoDB server');

  const db = client.db('TodoApp');

  // findOneAndDelete
  db.collection('Todos').findOneAndUpdate
  (
    {
      _id: new ObjectID("5b9a703e82681046df104f72")
    },
    {
      $set: {completed: true}
    },
    {
      returnOriginal: false
    }
  ).then((result) => {
    console.log(`Result of update of todos: ${result.lastErrorObject.n} document updated`);
    console.log(`Document updated: ${JSON.stringify(result.value, undefined, 2)}`);
  }, (err) => {
    console.log('Unable to update todos:', err);
  });

  // client.close();

  // client.close();

});
