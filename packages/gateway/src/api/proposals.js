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
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    request.get({
        headers: {'Authorization': req.header('Authorization')},
        url: 'http://localhost:3002/proposals/'+ req.params.id
    }, (error, response, bodyGetProposal) => {
        if (error) {
            res.send(error)
        } else {
            //res.send(response.body)

            console.log('response', bodyGetProposal)
             if (bodyGetProposal && req.body['status'] === 'Approved') {

                console.log('approving', JSON.parse(bodyGetProposal).locationId)
                request.get({
                    headers: {'Authorization': req.header('Authorization')},
                    url: 'http://localhost:3001/locations/'+ JSON.parse(bodyGetProposal).locationId
                }, (error, response, bodyLocation) => {
                       console.log('body of location', bodyLocation)
                    if (error) {
                        res.send(error)
                    } else {
                        if (bodyLocation) {
                            console.log('there is a location', bodyLocation)
                            //patch
                        } else {
                            console.log('there is no location')
                            console.log('req.user', req.user)
                            request.post({
                                headers: {'content-type': 'application/json', 'user': JSON.stringify(req.user)},
                                url: 'http://localhost:3001/locations',
                                body: bodyGetProposal
                            }, (error, response, bodyPostLocation) => {
                                console.log('post to location returned')
                                if (error) {
                                    return error
                                } 
                                const responseObject = JSON.parse(bodyPostLocation)
                                try {
                                //    res.status(202).set('Location', response.headers.location).send(bodyPostLocation)
                                } catch (e) {
                                    res.status(400).send(e)
                                }
                                
                            })
                        }

                    }
                })  
             }
            // request.patch({
            //     headers: {'content-type': 'application/json', 'user': JSON.stringify(req.user._id)},
            //     url: 'http://localhost:3002/proposals/' + req.params.id,
            //     body: JSON.stringify(req.body)
            // }, (error, response, body) => {
            //     if (error) {
            //         return error
            //     } 
            //     const responseObject = JSON.parse(body)
            //     try {
            //         res.status(202).set('Location', response.headers.location).send(body)
            //     } catch (e) {
            //         res.status(400).send(e)
            //     }
                
            // })
        }
    })

       
})
module.exports = app;

