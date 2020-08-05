const express = require('express')
const User = require('../models/user')
//const {auth, access} = require('../../../common/src/middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', async (req, res) => {
    try {
        const reqToken = req.header('Authorization').replace('Bearer ', '')

        await User.findOne({'tokens.token': reqToken}, async function(e, data){
            if(e){
               return (res.status(400).send('Failed'))
            } else {
               if (data) {
                    console.log('user', data)
                    data.tokens = data.tokens.filter((token) => {
                        return token.token !== reqToken
                    })
                   await data.save()        
                   res.send(data)
               } else {
                    console.log('user not found')
                    return (res.status(404).send())
               }
            }
         })
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', async (req, res) => {
    try {
        const reqToken = req.header('Authorization').replace('Bearer ', '')
        
        await User.findOne({'tokens.token': reqToken}, async function(e, data){
            if(e){
               return (res.status(400).send('Failed'))
            } else {
               if (data) {
                    data.tokens = []
                    await data.save()
                    res.send()
               } else {
                    console.log('user not found')
                    return (res.status(404).send())
               }
            }
         })

        
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/profile', async (req, res) => {
    const reqToken = req.header('Authorization').replace('Bearer ', '')
    await User.findOne({'tokens.token': reqToken},function(e, data){
        if(e){
           return (res.status(400).send('Failed'))
        }else{
           if (data) {
               console.log('user', data)
               return (res.send(data))
           } else {
               console.log('user not found')
               return (res.status(404).send())
           }
        }
     })
   

})

router.patch('/users/profile', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'alias', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    const reqToken = req.header('Authorization').replace('Bearer ', '')
    await User.findOne({'tokens.token': reqToken}, async function(e, data){
        if(e){
           return (res.status(400).send('Failed'))
        }else{
           if (data) {
                try {
                    updates.forEach((update) => data[update] = req.body[update])
                    await data.save()
                    res.send(data)
                } catch (e) {
                    res.status(400).send(e)
                }
           } else {
               console.log('user not found')
               return (res.status(404).send())
           }
        }
     })
   
   
    
})

router.patch('/users/profile/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'alias', 'email', 'password', 'role']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    await User.findOne({_id: req.params.id}, async function(e, data){
        if(e){
           return (res.status(400).send('Failed'))
        }else{
           if (data) {
                try {
                    //as the role is signed using JWT the tokens are no longer valid
                    data.tokens = []
                    updates.forEach((update) => data[update] = req.body[update])
                    await data.save()
                    res.send(data)
                } catch (e) {
                    res.status(400).send(e)
                }
           } else {
               console.log('user not found')
               return (res.status(404).send())
           }
        }
     })


})

router.delete('/users/profile', async (req, res) => {
    const reqToken = req.header('Authorization').replace('Bearer ', '')
    await User.findOne({'tokens.token': reqToken}, async function(e, data){
        if(e){
           return (res.status(400).send('Failed'))
        }else{
           if (data) {
                try {
                    await data.remove()
                    res.send(data)
                } catch (e) {
                    res.status(500).send()
                }
           } else {
               console.log('user not found')
               return (res.status(404).send())
           }
        }
     })
    try {
        
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router