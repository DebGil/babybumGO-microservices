const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const {auth, access} = require('../middleware/auth')

const urlLocations = process.env.ZUUL_URL + '/locations'
const urlProposals = process.env.ZUUL_URL + '/proposals'

const app = express();

app.use(bodyParser.json());

app.get("/proposals", auth, access('admin'), async  (req, res) => {
    const url = urlProposals + '/proposals?status='+ req.query.status+'&sortBy='+req.query.sortBy+'&limit='+req.query.limit
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
        url: urlProposals + '/proposals/'+ req.params.id
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.status(response.statusCode).set('location',response.headers.path).send(response.body)
            
        }
    })   
})

app.delete("/proposals/:id", auth, access('admin'), async  (req, res) => {
    request.delete({
        headers: {'Authorization': req.header('Authorization')},
        url: urlProposals + '/proposals/'+ req.params.id
    }, (error, response, body) => {
        if (error) {
            res.send(error)
        } else {
            res.send(response.body)
        }
    })   
})

//approve or reject
app.patch("/proposals/:id", auth, access('admin'), async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    const proposalId = req.params.id
    const proposalBody = req.body

    request.get({
        headers: {'Authorization': req.header('Authorization')},
        url: urlProposals + '/proposals/'+ proposalId
    }, (error, response, bodyGetProposal) => {
        if (error) {
            return res.send(error)
        } if ((response.statusCode !== 200) && (response.statusCode !== 303) ){
            return res.status(response.statusCode).send({"error":"proposal does not exist"})
        } else {
            const locationId = JSON.parse(bodyGetProposal).locationId
            //res.send(response.body)
            if (JSON.parse(bodyGetProposal).status !== 'Under Review') {
                return res.status(400).send({"error":"proposal status cannot be updated"})
            }
            console.log('response', bodyGetProposal)
            if (req.body['status'] === 'Approved') {

                console.log('approving', locationId)
                request.get({
                    headers: {'Authorization': req.header('Authorization')},
                    url: urlLocations + '/locations/'+ locationId
                }, (error, response, bodyLocation) => {
                       console.log('body of location', bodyLocation)
                    if (error) {
                        res.send(error)
                    } else {
                        if (response.statusCode === 200) {
                            console.log('there is a location', bodyLocation)
                            console.log('body propsal', bodyGetProposal)
                            request.patch({
                                headers: {'content-type': 'application/json', 'user': JSON.stringify(req.user)},
                                url: urlLocations + '/locations/'+ locationId,
                                body: bodyGetProposal
                            }, (error, response, bodyPostLocation) => {
                                console.log('patch to location returned')
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
                        } else if (response.statusCode === 404) {
                            console.log('there is no location')
                            console.log('bodyGetProposal', bodyGetProposal)
                            request.post({
                                headers: {'content-type': 'application/json', 'user': JSON.stringify(req.user)},
                                url: urlLocations + '/locations',
                                body: bodyGetProposal
                            }, (error, response, bodyPostLocation) => {
                                console.log('post to location returned')
                                if (error) {
                                    return error
                                } 
                                const responseObject = JSON.parse(bodyPostLocation)
         
                                
                            })
                        } else {
                            res.status(response.statusCode).send({"error": "error retrieving location"})
                        }

                    }
                })  
            }
            request.patch({
                headers: {'content-type': 'application/json', 'user': JSON.stringify(req.user._id)},
                url: urlProposals + '/proposals/'+ proposalId,
                body: JSON.stringify(proposalBody)
            }, (error, response, body) => {
                if (error) {
                    return error
                } 
                const responseObject = JSON.parse(body)
                try {
                    res.status(200).send(body)
                } catch (e) {
                    res.status(400).send(e)
                }
                
            })   
        }
    })

       
})
module.exports = app;

