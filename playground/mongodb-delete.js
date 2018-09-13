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

  // count
  db.collection('Todos').find().count().then((count) => {
    console.log(`Todos count: ${count}`);
  }, (err) => {
    console.log('Unable to fetch todos', err);
  });

  // deleteMany
  // db.collection('Todos').deleteMany({text: "Eat lunch"}).then((result) => {
  //   console.log(`Result of delete of todos: ${result.result.n} documents deleted`);
  // }, (err) => {
  //   console.log('Unable to delete todos:', err);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: "Eat lunch"}).then((result) => {
  //   console.log(`Result of delete of todos: ${result.result.n} documents deleted`);
  // }, (err) => {
  //   console.log('Unable to delete todos:', err);
  // });

  // findOneAndDelete
  db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    console.log(`Result of delete of todos: ${result.lastErrorObject.n} documents deleted`);
    console.log(`Document deleted: ${JSON.stringify(result.value, undefined, 2)}`);
  }, (err) => {
    console.log('Unable to delete todos:', err);
  });

  // client.close();

  // client.close();

});
