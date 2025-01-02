const express = require('express');
const userRouter = require('./routers/userRouter');
const taskRouter = require('./routers/taskRouter');

require('./db/mongoose')

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;