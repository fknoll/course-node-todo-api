const request = require('supertest');
const suspect = require('expect');
var {app} = require('./../server.js');
var {Todo} = require('./../models/todo.js');

const testTodos = [
  {
    text: 'First test todo'
  },
  {
    text: 'Second test todo'
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

    var text = 'Freddys powerfull TEST todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200) // assertion about status
      .expect((res) => { // assertion about the result that comes back
        suspect(res.body.text).toBe(text);
      })
      .end((err, res) => { // check what got stored in the mongoDB collection

        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          suspect(todos.length).toBe(1);
          suspect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));

      })
      ;

  } /* end of callback in it('A:..) */ );

  it('B: should not create a todo with invalid body data', (done) => {

    var text = '';

    request(app)
      .post('/todos')
      .send({text})
      .expect(400) // assertion about status
      .end((err, res) => { // check what got stored in the mongoDB collection

        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          suspect(todos.length).toBe(2);
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
      .expect(200) // assertion about status
      .expect((res) => { // assertion about the result that comes back
        // console.log(res.body);
        suspect(res.body.todos.length).toBe(2);
      })
      .end(done)
      ;

  } /* end of callback in it('A:..) */ );

} /* end of callback in describe() */ );
