const request = require('supertest');
const suspect = require('chai').expect;

// https://www.chaijs.com/guide/installation/
// https://devhints.io/chai
// const { expect } = require('chai')

const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

const testTodos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  }
];

beforeEach((done) => {

  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(testTodos);
    })
    .then(() => done())
  ;

});

describe('POST /todos', () => { /* start callback in describe */

  it('A: should create a new todo', (done) => {

    var myTxt = 'My todo TEST text';

    request(app)
      .post('/todos')
      .send({text: myTxt})
      .expect(200) // expectation about status
      .expect((res) => { // expectation about the result that comes back
        suspect(res.body.text).to.equal(myTxt);
      })
      .end((err, res) => { // check what got stored in the mongoDB collection

        if (err) {
          return done(err);
        }

        Todo.find({text: myTxt}).then((todos) => {
          suspect(todos.length).to.equal(1);
          suspect(todos[0].text).to.equal(myTxt);
          done();
        }).catch((e) => done(e));

      })
      ;

  } /* end of callback in it('A:..) */ );

  it('B: should not create a todo with invalid body data', (done) => {

    var myTxt = '';

    request(app)
      .post('/todos')
      .send({text: myTxt })
      .expect(400) // expectation about status
      .end((err, res) => { // check what got stored in the mongoDB collection

        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          suspect(todos.length).to.equal(2);
          done();
        }).catch((e) => done(e));

      })
      ;

  } /* end of callback in it('B:..) */ );

} /* end of callback in describe() */ );

describe('GET /todos', () => { /* start callback in describe */

  it('A: should get all todos', (done) => {

    request(app)
      .get('/todos')
      .expect(200) // expectation about status
      .expect((res) => { // expectation about the result that comes back
        // console.log(res.body);
        suspect(res.body.todos.length).to.equal(2);
      })
      .end(done)
      ;

  } /* end of callback in it('A:..) */ );

} /* end of callback in describe() */ );

describe('GET /todos/:id', () => { /* start callback in describe */

  it('A: should return todo document', (done) => {

    request(app)
      .get(`/todos/${testTodos[1]._id.toHexString()}`)
      .expect(200) // expectation about status
      .expect((res) => { // expectation about the result that comes back
        // console.log(res.body);
        suspect(res.body.todo.text).to.equal(testTodos[1].text);
      })
      .end(done)
      ;

  } /* end of callback in it('A:..) */ );

  it('B: should return 404 if todo not found', (done) => {

    var newId = new ObjectID();

    request(app)
      .get(`/todos/${newId.toHexString()}`)
      .expect(404) // expectation about status
      .end(done)
      ;

  } /* end of callback in it('B:..) */ );

  it('C: should return 404 for in-valid id', (done) => {

    request(app)
      .get('/todos/1234abcd')
      .expect(404) // expectation about status
      .end(done)
      ;

  } /* end of callback in it('C:..) */ );

} /* end of callback in describe() */ );

describe('DELETE /todos/:id', () => { /* start callback in describe */

  it('A: should remove a todo document', (done) => {

    var idOfTodoToBeDeleted = testTodos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${idOfTodoToBeDeleted}`)
      .expect(200) // expectation about status
      .expect((res) => { // expectation about the result that comes back
        // console.log(res.body);
        suspect(res.body.todo._id).to.equal(idOfTodoToBeDeleted);
      })
      .end((err, res) => {

        if (err) {
          return done(err);
        };

        Todo.findById(idOfTodoToBeDeleted)
          .then((todo) => {
            suspect(todo).to.be.null;
            done();
          })
          .catch((e) => done(e))
        ;

      })
      ;

  } /* end of callback in it('A:..) */ );

  it('B: should return 404 if todo not found', (done) => {

    var newId = new ObjectID();

    request(app)
      .delete(`/todos/${newId.toHexString()}`)
      .expect(404) // expectation about status
      .end(done)
      ;

  } /* end of callback in it('B:..) */ );

  it('C: should return 404 for in-valid id', (done) => {

    request(app)
      .delete('/todos/1234abcd')
      .expect(404) // expectation about status
      .end(done)
      ;

  } /* end of callback in it('C:..) */ );

} /* end of callback in describe() */ );

describe('PATCH /todos/:id', () => { /* start callback in describe */

  it('A: should update a todo document', (done) => {

    // grab id of first item
    var idOfTodoToBeUpdated = testTodos[0]._id.toHexString();
    var text = 'This should be the new text';

    request(app)
      .patch(`/todos/${idOfTodoToBeUpdated}`)
      .send({
        completed: true,
        text
      })
      .expect(200) // expectation about status
      .expect((res) => { // expectation about the result that comes back
        suspect(res.body.todo.text).to.equal(text);
        suspect(res.body.todo.completed).to.be.true;
        suspect(res.body.todo.completedAt).to.be.a('number');
      })
      .end(done)
      ;

  } /* end of callback in it('A:..) */ );

  it('B: should clear completedAt when todo is not completed', (done) => {

        // grab id of second item
        var idOfTodoToBeUpdated = testTodos[1]._id.toHexString();
        var text = 'This should be the new text!!';

        request(app)
          .patch(`/todos/${idOfTodoToBeUpdated}`)
          .send({
            completed: false,
            text
          })
          .expect(200) // expectation about status
          .expect((res) => { // expectation about the result that comes back
            suspect(res.body.todo.text).to.equal(text);
            suspect(res.body.todo.completed).to.be.false;
            suspect(res.body.todo.completedAt).to.be.null;
          })
          .end(done)
          ;

      } /* end of callback in it('B:..) */ );

  it('C: should return 404 if todo not found', (done) => {

    var newId = new ObjectID();

    request(app)
      .patch(`/todos/${newId.toHexString()}`)
      .expect(404) // expectation about status
      .end(done)
      ;

  } /* end of callback in it('C:..) */ );

  it('D: should return 404 for in-valid id', (done) => {

    request(app)
      .patch('/todos/1234abcd')
      .expect(404) // expectation about status
      .end(done)
      ;

  } /* end of callback in it('D:..) */ );

} /* end of callback in describe() */ );
