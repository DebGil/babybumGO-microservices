const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const {auth, access} = require('../middleware/auth')

const app = express();

app.use(bodyParser.json());


app.post("/locations", auth, async (req, res) => {
    request.post({
        headers: {'content-type': 'application/json', 'user': JSON.stringify(req.user._id)},
        url: 'http://localhost:3002/proposals',
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

app.patch("/locations/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 
                            'address', 
                            'additionalInfo', 
                            'location']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    request.get({
        headers: {'Authorization': req.header('Authorization')},
        url: 'http://localhost:3001/locations/'+ req.params.id
    }, (error, response, body) => {
        if (error) {
            res.status(404).send(error)
        } else {
            let  body = req.body
            body = { ...body, locationId: req.params.id};
            request.post({
                headers: {'content-type': 'application/json', 'user': JSON.stringify(req.user._id)},
                url: 'http://localhost:3002/proposals/',
                body: JSON.stringify(body)
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
        }
    }) 
      
})

app.get("/locations", auth, async  (req, res) => {
    const url = 'http://localhost:3001/locations?latitude='+ req.query.latitude+'&longitude='+req.query.longitude+'&distance='+req.query.distance
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

app.get("/locations/:id", auth, async  (req, res) => {
    const url = 'http://localhost:3001/locations/'+ req.params.id
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

app.delete("/locations/:id", auth, access('admin'), async  (req, res) => {
    const url = 'http://localhost:3001/locations/'+ req.params.id
    console.log( req.user)
    request.delete({
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

module.exports = app;

