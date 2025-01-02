const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/users');
const Task = require('../../src/models/tasks');

const newUserId = new mongoose.Types.ObjectId;
const newUser = {
    _id: newUserId,
    name: "Mike",
    email: "mike@example.com",
    password: "Mike@456!",
    age: 24,
    tokens: [{
        token: jwt.sign({_id: newUserId}, process.env.JWT_SECRET)
    }]
}

const secondUserId = new mongoose.Types.ObjectId;
const secondUser = {
    _id: secondUserId,
    name: "Jack",
    email: "jack@example.com",
    password: "Mike@456!",
    age: 24,
    tokens: [{
        token: jwt.sign({_id: secondUserId}, process.env.JWT_SECRET)
    }]
}

const taskOne ={
    _id: new mongoose.Types.ObjectId,
    description: "first task",
    completed_fields: false,
    owner: newUser._id
}

const taskTwo ={
    _id: new mongoose.Types.ObjectId,
    description: "second task",
    completed_fields: true,
    owner: newUser._id
}

const taskThree ={
    _id: new mongoose.Types.ObjectId,
    description: "third task",
    completed_fields: true,
    owner: secondUser._id
}


const setUpDatabase = async () =>{
    await User.deleteMany();
    await Task.deleteMany();
    await new User(newUser).save();
    await new User(secondUser).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    newUserId,
    newUser,
    setUpDatabase,
    secondUserId,
    secondUser,
    taskOne,
    taskTwo,
    taskThree
}