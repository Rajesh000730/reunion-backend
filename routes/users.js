var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
var users = require('../models/users.model');
const posts = require('../models/posts.model');
const bcrypt = require('bcrypt');
/* GET users listing. */

var {schema, model} = require('mongoose');

//get user profile
router.get('/user', async (req, res)=>{
    console.log(req.auth)
    try{
        const user = await users.findById(req.auth.id)
        res.json({
            name: user.name,
            followers: user.followers,
            following: user.following
        })
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
}   )

// follow a user
router.post('/follow/:id', async (req, res)=>{
    try{
        const user = await users.findById(req.params.id)
        const current_user = await users.findById(req.auth.id)
        user.followers = user.followers += 1
        current_user.following = current_user.following += 1
        
        await user.save()
        res.json({
            message: "user followed"
        })
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
}   )

// unfollow a user
router.post('/unfollow/:id', async (req, res)=>{
    try{
        const user = await users.findById(req.params.id)
        const current_user = await users.findById(req.auth.id)
        user.followers = user.followers -= 1
        current_user.following = current_user.following -= 1
        
        await user.save()
        res.json({
            message: "user unfollowed"
        })
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
}   )

//get all posts
router.get('/all_posts', async (req, res)=>{
    try{
        const all_posts = await posts.find({
            owner: req.auth.id
        })
        res.json(all_posts)
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
    
}   )

//get single post
router.get('/posts/:id', async (req, res)=>{
    try{
        const post = await posts.findById(req.params.id)
        res.json({
            id:post._id,
            description: post.description,
            date: post.date,
            likes: post.likes,
            comments: post.comments.length
        })
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
}   )


//create posts
router.post('/posts', async (req, res, done)=>{
      try{
            const post  = new posts({
                owner: req.auth.id,
                title: req.body.title,
                description: req.body.description,
                comments: [],
                date: new Date()
            })
            await post.save()
            console.log(post)
            res.json({
                id:post._id,
                description: post.description,
                date: post.date,
                likes: post.likes,

            })
          
        }
        catch(err){
            console.log(err)
            res.status(400).json(err)
        }
           
})

//delete post
router.delete('/posts/:id', async (req, res)=>{
    try{
        const post = await posts.findById(req.params.id)
        await post.remove()
        res.json({
            message: "post deleted"
        })
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
}   )

// like post
router.post('/like/:id/', async (req, res)=>{
    try{
        const post = await posts.findById(req.params.id)
        post.likes = post.likes+=1
        await post.save()
        res.json({
            message: "post liked"
        })
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
}   )
// unlike post
router.post('/unlike/:id/', async (req, res)=>{
    try{
        const post = await posts.findById(req.params.id)
        post.likes = post.likes -= 1
        await post.save()
        res.json({
            message: "post unliked"
        })
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
}   )

//comment on post
router.post('/comment/:id', async (req, res)=>{
    try{
        const post = await posts.findById(req.params.id)
        post.comments.push(req.body.comment)
        await post.save()
        res.json(post.comments.slice(-1)[0])
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
}   )
 
// autheticate user
router.post('/authenticate', async (req, res)=>{
    const {email, password} = req.body
    // check if user exists
    const user = await users.findOne({email})
    if(!user){
        res.json({
            message: "user not found"
        })
    }
    else{
        // check password
        const match = password == user.password
        if(!match){
            res.json({
                message: "password incorrect"
            })
        }
        else{
            // create token
            const token = jwt.sign({id: user._id}, process.env.secret, {expiresIn: '1h', algorithm: 'HS256'})
            console.log(user)
            res.json({
                token
            })
        }
    }  })



module.exports = router;
