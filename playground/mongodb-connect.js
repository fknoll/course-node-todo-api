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

  // db.collection('Todos').insertOne
  // (
  //   {
  //     text: 'Do grocery shopping',
  //     completed: false
  //   },
  //   (err, result) => {
  //     if (err) {
  //       return console.log('>>> Unable to insert todo document:', err);
  //     };
  //     console.log('New todo document inserted:', JSON.stringify(result.ops, undefined, 2));
  //   }
  // );

  db.collection('Users').insertOne
  (
    {
      name: 'Andrew',
      age: 25,
      location: 'Philadelphia'
    },
    (err, result) => {
      if (err) {
        return console.log('>>> Unable to insert user document:', err);
      };
      console.log('New user document inserted:', JSON.stringify(result.ops, undefined, 2));
    }
  );

  client.close();

});
