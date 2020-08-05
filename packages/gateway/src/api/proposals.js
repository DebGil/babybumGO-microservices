const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const {auth, access} = require('../middleware/auth')

const app = express();

app.use(bodyParser.json());

app.get("/proposals", auth, access('admin'), async  (req, res) => {
    const url = 'http://localhost:3002/proposals?status='+ req.query.status+'&sortBy='+req.query.sortBy+'&limit='+req.query.limit
    console.log(url)
    request.get({
        headers: {'Authorization': req.header('Authorization')},
        url
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.send(response.body)
        }
    })   
})

app.get("/proposals/:id", auth, async  (req, res) => {
    request.get({
        headers: {'Authorization': req.header('Authorization')},
        url: 'http://localhost:3002/proposals/'+ req.params.id
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.send(response.body)
        }
    })   
})

app.delete("/proposals/:id", auth, access('admin'), async  (req, res) => {
    request.delete({
        headers: {'Authorization': req.header('Authorization')},
        url: 'http://localhost:3002/proposals/'+ req.params.id
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.send(response.body)
        }
    })   
})

app.patch("/proposals/:id", auth, access('admin'), async (req, res) => {
    request.patch({
        headers: {'content-type': 'application/json', 'user': JSON.stringify(req.user._id)},
        url: 'http://localhost:3002/proposals/' + req.params.id,
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            return error
        } 
        const responseObject = JSON.parse(body)
        try {
            res.status(202).set('Location', response.headers.location).send(body)
        } catch (e) {
            res.status(400).send(e)
        }
        
    })   
})
module.exports = app;

