const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const User = require('./users')

/*tasks model */

const taskSchema = new mongoose.Schema({
    description : {
        type : String,
        trim: true,
        required: true
    },
    completed_fields :{
        type : Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Task = mongoose.model("Task",taskSchema)

module.exports = Task;