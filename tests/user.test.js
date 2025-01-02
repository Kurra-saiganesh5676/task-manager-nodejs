const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/users');
const {newUserId, newUser, setUpDatabase} = require('./fixtures/db')

beforeEach(setUpDatabase);

test('Should sign up an user', async () => {
  const response = await request(app).post('/users').send({
    name: "myName",
    email: "kurrasai@com.in",
    password: "edajrifjflt@8",
    age: 24
  }).expect(201);

  //assert about change in database
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //assert created data
  expect(response.body).toMatchObject({
    user: {
        name: "myName",
        email: "kurrasai@com.in"
    },
    token: user.tokens[0].token
  })

  //assert hashing of password
  expect(user.password).not.toBe('edajrifjflt@8');

});

test('Should login existing user', async ()=>{
    const response = await request(app).post('/users/login').send({
        email: newUser.email,
        password: newUser.password
    }).expect(200);

    //assert the token value
    const user = await User.findById(newUserId);
    expect(response.body.token).toBe(user.tokens[1].token)
});

test('Should not login non-existing user', async ()=>{
    await request(app).post('/users/login').send({
        email: newUser.email,
        password: "jkdjlfs"
    }).expect(400);
})

test('Should get profile for user', async ()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization',`Bearer ${newUser.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete user', async ()=>{
    await request(app)
    .delete('/users/me')
    .set('Authorization',`Bearer ${newUser.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(newUserId);
    expect(user).toBeNull();

});

test('Sholud not delete for unauthenticated user', async ()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should upload avatar', async ()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${newUser.tokens[0].token}`)
    .attach('avatar','tests/fixtures/daytimesky.jpg')
    .expect(200)

    const user = await User.findById(newUserId);
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${newUser.tokens[0].token}`)
    .send({
        name: 'Mike2'
    })
    .expect(200);
    const user = await User.findById(newUserId);
    expect(user.name).toEqual('Mike2');
})

test('Should not update Invalid user fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${newUser.tokens[0].token}`)
    .send({
        location: 'Guntur'
    })
    .expect(400)
})