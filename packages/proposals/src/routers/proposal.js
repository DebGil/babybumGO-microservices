const express = require('express')
const Location = require('../../../locations/src/models/location')
const Proposal = require('../models/proposal')
const mongoose = require('mongoose')

const router = new express.Router()
const geocode = require('../../../common/src/utils/geocode')

router.post('/proposals', async (req, res) => {
    const user = req.header('user') 
    if (req.body.address) {
        geocode(req.body.address, (error, {latitude, longitude, locationName} = {}) => {
            console.log('req.body.address', req.body.address)
            if (error) {
                return res.send({error})
            }
            const proposal = new Proposal({
                ...req.body,
                locationId: new mongoose.Types.ObjectId(req.body.locationId),
                createdBy: JSON.parse(user),
                updatedBy: JSON.parse(user),
                location: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                }
            })

            try {
                proposal.save()
                res.status(202).set('Location', `/proposals/${proposal._id}`).send({status : proposal.status})
            } catch (e) {
                res.status(400).send(e)
            }
        })
    } else {
        const proposal = new Proposal({
            ...req.body,
            locationId: new mongoose.Types.ObjectId(req.body.locationId),
            createdBy: JSON.parse(user),
            updatedBy: JSON.parse(user),
        })

        try {
            proposal.save()
            res.status(202).set('Location', `/proposals/${proposal._id}`).send({status : proposal.status})
        } catch (e) {
            res.status(400).send(e)
        }
    }
        
})

router.put('/proposals/:id',  async (req, res) => {
    
    try {
        const updates = Object.keys(req.body)

        const proposal = await Proposal.findOne({ _id: req.params.id})
        console.log('prop', proposal)
        
        updates.forEach((update) => proposal[update] = req.body[update])
        
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1);
        proposal['expireAt'] = tomorrow
       
        await proposal.save()
        res.send(proposal)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/proposals', async (req, res) => {
    const match = {}
    const sort = {}
    console.log('quer', req.query)
    if (req.query.status) {
        match.status = req.query.status 
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        const proposals = await Proposal.find(match).sort(sort).limit(parseInt(req.query.limit))
        res.send(proposals)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/proposals/:id',  async (req, res) => {
    console.log('getting proposal ' , req.params.id)
    const _id = req.params.id

    try {
        const proposal = await Proposal.findOne({ _id})
        if (!proposal) {
            return res.status(404).send()
        }
        if (proposal.status === 'Approved') {
            
            res.status(303).set('path',`/locations/${proposal.locationId}`).send(proposal)
        } else {
            res.send(proposal)
        }
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/proposals/:id',  async (req, res) => {
    try {
        const proposal = await Proposal.findOneAndDelete({ _id: req.params.id })

        if (!proposal) {
            res.status(404).send()
        }

        res.send(proposal)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router