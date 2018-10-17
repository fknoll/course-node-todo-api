const request = require('supertest');
const suspect = require('expect');
var {app} = require('./../server.js');
var {Todo} = require('./../models/todo.js');

beforeEach((done) => {
  Todo.remove({}).then(() => done());
});

describe('POST /todos', () => { /* start callback in describe */

  it('A: should create a new todo', (done) => {

    var text = 'Freddys TEST todo text';

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

        Todo.find().then((todos) => {
          suspect(todos.length).toBe(1);
          suspect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));

      })
      ;

  } /* end callback in it "A" */ );

  it('B: should not create a todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400) // assertion about status
      .end((err, res) => { // check what got stored in the mongoDB collection

        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          suspect(todos.length).toBe(0);
          done();
        }).catch((e) => done(e));

      })
      ;

  } /* end callback in it "B" */ );

} /* end callback in describe */ );
