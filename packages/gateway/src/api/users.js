const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const {auth, access} = require('../middleware/auth')

const app = express();

const urlUsers = process.env.ZUUL_URL + '/users'

app.use(bodyParser.json());

console.log ('url1', urlUsers)

app.post("/users",  async (req, res) => {
    const urlUsers2 = urlUsers + '/users'
    console.log ('url', urlUsers)
    request.post({
        headers: {'content-type': 'application/json'},
        url: urlUsers2,
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            return error
        } 
        const responseObject = JSON.parse(body)
        console.log(body)
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
        url: urlUsers + '/users/login',
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            res.status(400).send(error)
        } else {
            res.status(response.statusCode).send(body)
        }
    })   
})

app.post("/users/logout", auth, async (req, res) => {
    const reqToken = req.header('Authorization').replace('Bearer ', '')

    request.post({
        headers: {'reqToken': reqToken},
        url: urlUsers + '/users/logout'
    }, (error, response, body) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.status(response.statusCode).send()
        }
    })  
})


app.post("/users/logoutAll", auth, async (req, res) => {
    const reqToken = req.header('Authorization').replace('Bearer ', '')

    request.post({
        headers: {'reqToken': reqToken},
        url: urlUsers + '/users/logoutAll'
    }, (error, response, body) => {
        if (error) {
            res.status(500).send(error)
        } else {
            res.status(response.statusCode).send()
        }
    })   
})


app.get("/users/profile", auth, async  (req, res) => {
    const reqToken = req.header('Authorization').replace('Bearer ', '')
    request.get({
        headers: {'reqToken': reqToken},
        url: urlUsers + '/users/profile'
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.status(response.statusCode).send(response.body)
        }
    })   
})

app.get("/users/profile/:id", auth, access('admin'), async  (req, res) => {
    const reqToken = req.header('Authorization').replace('Bearer ', '')
    request.get({
        headers: {'reqToken': reqToken},
        url: urlUsers + '/users/profile/' + req.params.id
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.status(response.statusCode).send(response.body)
        }
    })   
})

app.delete("/users/profile", auth, async  (req, res) => {
    const reqToken = req.header('Authorization').replace('Bearer ', '')
    request.delete({
        headers: {'reqToken': reqToken},
        url: urlUsers + '/users/profile'
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.status(response.statusCode).send(response.body)
        }
    })   
})

app.put("/users/profile", auth, async  (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'alias', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    const reqToken = req.header('Authorization').replace('Bearer ', '')
    const url = urlUsers + '/users/profile'

    request.put({
        headers: {'content-type': 'application/json', 'reqToken': reqToken},
        url,
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.status(response.statusCode).send(response.body)
        }
    })   
})

app.put("/users/profile/:id", auth, access('admin'), async  (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'alias', 'email', 'password', 'role']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    const reqToken = req.header('Authorization').replace('Bearer ', '')

    const url = urlUsers + '/users/profile/' + req.params.id
     console.log('url', url)
     console.log('body', JSON.stringify(req.body))

    request.put({
        headers: {'content-type': 'application/json', 'reqToken': reqToken},
        url,
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {

            res.status(response.statusCode).send(response.body)
        }
    })   
})

app.delete("/users/profile/:id", auth, access('admin'), async  (req, res) => {
    const reqToken = req.header('Authorization').replace('Bearer ', '')

    request.delete({
        headers: {'reqToken': reqToken},
        url: urlUsers + '/users/profile/' + req.params.id
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.status(response.statusCode).send(response.body)
        }
    })   
})

module.exports = app;

