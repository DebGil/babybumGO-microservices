const express = require('express')
const Location = require('../../../locations/src/models/location')
const Proposal = require('../models/proposal')
const {auth, access} = require('../../../common/src/middleware/auth')
const router = new express.Router()

router.patch('/proposals/:id', auth, access('admin'), async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const proposal = await Proposal.findOne({ _id: req.params.id})
        if (!proposal) {
            return res.status(404).send()
        }

        const location = await Location.findOne({ _id: proposal.locationId}) 

        if (req.body['status'] === 'Approved' && !location) {
            const location = new Location({
                _id: proposal.locationId,
                name: proposal.name,
                address: proposal.address,
                additionalInfo: proposal.additionalInfo, 
                location: proposal.location,
                createdBy: proposal.createdBy,
                updatedBy: proposal.updatedBy,
                approvedAt: new Date(),
                approvedBy: req.user._id
            }) 

            await location.save()
        } else if ( req.body['status'] === 'Approved' && location) {

            const proposalUpdates = Object.keys(proposal.toJSON())
            const allowedLocationUpdates = ['name', 'address', 'additionalInfo', 'location']
            const filteredLocationUpdates = allowedLocationUpdates.filter((function(item) {
                return proposalUpdates.includes(item); 
              }));
              console.log(filteredLocationUpdates)
              filteredLocationUpdates.forEach((filteredLocationUpdate) => location[filteredLocationUpdate] = proposal[filteredLocationUpdate])
            console.log(location)
            await location.save()
        }

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

router.get('/proposals', auth, access('admin'), async (req, res) => {
    const match = {}
    const sort = {}

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

router.get('/proposals/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const proposal = await Proposal.findOne({ _id})

        if (!proposal) {
            return res.status(404).send()
        }
        if (proposal.status === 'Approved') {
            res.status(303).set('Location', `/locations/${proposal.locationId}`).send({status : proposal.status})
        } else {
            res.send(proposal)
        }
    } catch (e) {
        res.status(500).send()
    }
})

router.delete('/proposals/:id', auth, access('admin'), async (req, res) => {
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