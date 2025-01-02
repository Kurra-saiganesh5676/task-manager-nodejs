const express = require('express');
const Task = require('../models/tasks');
const router = new express.Router();
const auth = require('../middleware/auth')

router.get('/tasks/:id',auth, async(req,res)=>{
    try{
        const _id = req.params.id;
        // let task = await Task.findById(id);
        const task = await Task.findOne({ _id, owner : req.user._id})
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send(e);
    }
})

// GET /tasks?completed_fields=true
// GET /tasks?limit=10&skip=0

router.get('/tasks',auth, async(req,res)=>{

    const match ={};
    const sort = {};
    if(req.query.completed_fields){
        match.completed_fields = req.query.completed_fields === 'true';
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] == 'desc'? -1 : 1
    }

    try{
        // let tasks = await Task.find({owner: req.user._id});
        await req.user.populate({
            path : 'tasks',
            match,
            options :{
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    }catch(e){
        console.error(e)
        res.status(500).send(e)
    }
})

router.post('/tasks', auth, async(req,res)=>{

    try{
        // req.body.owner = req.user._id;
        const task1 = new Task({
            ...req.body,
            owner: req.user._id
        });
        let result = await task1.save();
        res.status(201).send(result);
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id',auth, async (req,res)=>{

    const id = req.params.id;

    const updates = Object.keys(req.body);
    const allowed = ['description','completed_fields'];

    const isValid = updates.every((update)=> allowed.includes(update));

    if(!isValid){
        return res.status(400).send({error : 'Invalid Input!!'})
    }

    try{
        // let task = await Task.findById(id);
        //let task = await Task.findByIdAndUpdate(id,req.body,{new:true, runValidators: true});

        let task = await Task.findOne({_id: id, owner: req.user._id})

        if(!task){
            return res.status(404).send();
        }

        updates.forEach((update)=>{
            task[update]=req.body[update];
        })

        await task.save();
        
        res.send(task)

    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id',auth, async(req,res)=>{
    try{
        // const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send('Task not found');
        }
        res.send(task);
    }
    catch(e){
        res.status(500).send(e);
    }
})

module.exports = router;