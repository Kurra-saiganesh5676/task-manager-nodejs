const User = require('../models/users');
const auth = require('../middleware/auth');
const express = require('express');
const router = new express.Router();
const Task = require('../models/tasks');
const multer = require('multer');
const sharp = require('sharp');

router.get('/users/me', auth, async (req,res)=>{
    res.send(req.user);
})

router.post('/users/login',async (req,res)=>{
    try{
        let user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        console.log(token);
        res.send({user, token});
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users',async(req,res)=>{
    console.log(req.body);
    try{
        let user1= new User(req.body);
        const token = await user1.generateAuthToken();
        let user = await user1.save();
        res.status(201).send({user,token});
    }catch(e){
        res.status(400).send(e);
    }
})

router.post('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!==req.token;
        })
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req,res)=>{
    try{
        req.user.tokens=[];
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send()
    }
})



router.patch('/users/me', auth, async(req,res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age'];
    const isValid = updates.every((update)=>allowedUpdates.includes(update));
    if(!isValid){
        return res.status(400).send({error : 'Invalid input'});
    }
    try{
        updates.forEach((update)=> req.user[update]=req.body[update]);
        await req.user.save();
        //let user =await User.findByIdAndUpdate(id,req.body,{ new:true, runValidators: true })
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async(req,res)=>{
    try{
        await Task.deleteMany({owner: req.user._id})
        await User.findByIdAndDelete(req.user._id);
        res.send(req.user);

    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

const avatar = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Please upload an image'));
        }
        callback(undefined, true)
    }
})

router.get('/users/me/avatar', auth, async(req,res)=>{
    try{
        if(!req.user.avatar){
            throw new Error('Avatar not found');
        }
        res.set('Content-Type', 'image/png');
        res.send(req.user.avatar);
    }catch(e){
        console.error('Error fetching avatar:', e);
        res.status(404).send();
    }
})

router.post('/users/me/avatar', auth, avatar.single('avatar'), async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer,
    await req.user.save();
    res.send();
},(error,req,res, next)=>{
    res.status(400).send({error: error.message});
    next();
});

router.delete('/users/me/avatar',auth, async(req,res)=>{
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.send()
    }catch(e){
        req.status(500).send()
    }
})


module.exports = router;

