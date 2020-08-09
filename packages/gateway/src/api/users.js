const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const {auth, access} = require('../middleware/auth')

const app = express();

app.use(bodyParser.json());


app.post("/users",  async (req, res) => {
    request.post({
        headers: {'content-type': 'application/json'},
        url: 'http://localhost:3004/users',
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            return next(error)
        } 
        const responseObject = JSON.parse(body)
        try {
            res.status(201).send({"_id": responseObject.user._id, "token": responseObject.token})
        } catch (e) {
            res.status(400).send(e)
        }
        
    })   
})

app.post("/users/login", async (req, res) => {
    request.post({
        headers: {'content-type': 'application/json'},
        url: 'http://localhost:3004/users/login',
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            res.status(400).send(error)
        } else {
            res.send(body)
        }
    })   
})

app.post("/users/logout", auth, async (req, res) => {
    request.post({
        headers: {'Authorization': req.header('Authorization')},
        url: 'http://localhost:3004/users/logout'
    }, (error, response, body) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.send()
        }
    })  
})


app.post("/users/logoutAll", auth, async (req, res) => {
    request.post({
        headers: {'Authorization': req.header('Authorization')},
        url: 'http://localhost:3004/users/logoutAll'
    }, (error, response, body) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.send()
        }
    })   
})


app.get("/users/profile", auth, async  (req, res) => {
    request.get({
        headers: {'Authorization': req.header('Authorization')},
        url: 'http://localhost:3004/users/profile'
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.status(response.statusCode).send(response.body)
        }
    })   
})

app.delete("/users/profile", auth, async  (req, res) => {
    request.delete({
        headers: {'Authorization': req.header('Authorization')},
        url: 'http://localhost:3004/users/profile'
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.send(response.body)
        }
    })   
})

app.patch("/users/profile", auth, async  (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'alias', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    request.patch({
        headers: {'content-type': 'application/json', 'Authorization': req.header('Authorization')},
        url: 'http://localhost:3004/users/profile',
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.send(response.body)
        }
    })   
})

app.patch("/users/profile/:id", auth, access('admin'), async  (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'alias', 'email', 'password', 'role']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    request.patch({
        headers: {'content-type': 'application/json', 'Authorization': req.header('Authorization')},
        url: 'http://localhost:3004/users/profile/'+req.params.id,
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.send(response.body)
        }
    })   
})

module.exports = app;

