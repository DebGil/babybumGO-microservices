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
        const user = await User.findOne({'tokens.token': reqToken})
        console.log ('user', user)
        user.tokens = user.tokens.filter((token) => {
            return token.token !== reqToken
        })
        await user.save()        
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', async (req, res) => {
    try {
        const reqToken = req.header('Authorization').replace('Bearer ', '')
        const user = await User.findOne({'tokens.token': reqToken})
        user.tokens = []
        console.log('user', user)
        await user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/profile', async (req, res) => {
    const reqToken = req.header('Authorization').replace('Bearer ', '')
    const user = await User.findOne({'tokens.token': reqToken})
    res.send(user)
})

router.patch('/users/profile', async (req, res) => {
    console.log('req', req.body)
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'alias', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    const reqToken = req.header('Authorization').replace('Bearer ', '')
    const user = await User.findOne({'tokens.token': reqToken})
   
    try {
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/profile', async (req, res) => {
    console.log('delete')
    const reqToken = req.header('Authorization').replace('Bearer ', '')
    const user = await User.findOne({'tokens.token': reqToken})
    try {
        await user.remove()
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router