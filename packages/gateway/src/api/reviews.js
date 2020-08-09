const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const {auth, access} = require('../middleware/auth')

const app = express();

app.use(bodyParser.json());

app.get("/reviews", auth, async  (req, res) => {
    var url = 'http://localhost:3005/reviews'
    if (req.query.locationId || req.query.rating || req.query.sortBy || req.query.limit) url = url + '?'
    if (req.query.locationId ) url = url + 'locationId=' + req.query.locationId + '&'
    if (req.query.rating ) url = url + 'rating=' + req.query.rating + '&'
    if (req.query.sortBy ) url = url + 'sortBy=' + req.query.sortBy + '&'
    if (req.query.limit ) url = url + 'limit=' + req.query.limit 
    //const url = 'http://localhost:3005/reviews?locationId='+ req.query.locationId+'&rating='+req.query.rating +'&sortBy='+req.query.sortBy+'&limit='+req.query.limit
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

app.get("/reviews/:id", auth, async  (req, res) => {
    request.get({
        headers: {'Authorization': req.header('Authorization')},
        url: 'http://localhost:3005/reviews/'+ req.params.id
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.status(response.statusCode).send(response.body)
            
        }
    })   
})

app.delete("/reviews/:id", auth, async  (req, res) => {
    request.delete({
        headers: {'Authorization': req.header('Authorization'),  'user': JSON.stringify(req.user)},
        url: 'http://localhost:3005/reviews/'+ req.params.id
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.send(response.body)
        }
    })   
})

app.post("/reviews", auth, async (req, res) => {
    console.log('bopdy', JSON.stringify(req.body))
    console.log('user', JSON.stringify(req.user._id))
    request.post({
        headers: {'content-type': 'application/json', 'user': JSON.stringify(req.user)},
        url: 'http://localhost:3005/reviews',
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            return error
        } 
        const responseObject = JSON.parse(body)
        try {
            res.status(202).send(body)
        } catch (e) {
            res.status(400).send(e)
        }
        
    })   
})

app.patch("/reviews/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['text', 'rating']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    request.patch({
        headers: {'content-type': 'application/json', 'user': JSON.stringify(req.user)},
        url: 'http://localhost:3005/reviews/' +req.params.id ,
        body: JSON.stringify(req.body)
    }, (error, response, body) => {
        if (error) {
            res.status(404).send(error)
        } else {

            if (error) {
                return error
            } 
            try {
                res.status(200).send(body)
            } catch (e) {
                res.status(400).send(e)
            }
        }        
        
    }) 
      
})
       

module.exports = app;

