const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const {newUserId, newUser, setUpDatabase, secondUserId, secondUser, taskOne, taskTwo, taskThree} = require('./fixtures/db')
const Task = require('../src/models/tasks')

beforeEach(setUpDatabase)

test('Should create a task', async()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization',`Bearer ${newUser.tokens[0].token}`)
    .send({
        description:"first",
        completed_fields: false
    })
    .expect(201)

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task).toMatchObject({
        description:"first",
        completed_fields: false
    })
})

test('Should get all the tasks created by authorized user', async ()=>{
    const response = await request(app)
    .get('/tasks')
    .set('Authorization',`Bearer ${newUser.tokens[0].token}`)
    .send()
    .expect(200);

    expect(response.body.length).toEqual(2);
})

test('Should not be able to delete a task by unauthorized user', async()=>{
    const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization',`Bearer ${secondUser.tokens[0].token}`)
    .send()
    .expect(404)

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
})