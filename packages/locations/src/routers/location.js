const express = require('express')
const Location = require('../models/location')
const Proposal = require('../../../proposals/src/models/proposal')
//const {auth, access} = require('../../../common/src/middleware/auth')
const router = new express.Router()



// @route     GET /locations?latitude=latitude&longitude=longitude&distance=distance
router.get('/locations', async (req, res) => {

    const lat = req.query.latitude
    const lng = req.query.longitude

    const distance = req.query.distance || 1
    const radius = distance / 3963
    
    console.log(lat, lng, distance, radius)

    try {
        const locations = await Location.find({
            location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
        })
        res.status(200).send(locations)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/locations/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const location = await Location.findOne({ _id})

        if (!location) {
            return res.status(404).send()
        }
        location.viewCount++
        await location.save()
        res.send(location)
    } catch (e) {
        res.status(500).send()
    }
})



router.patch('/locations/:id',  async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 
                            'address', 
                            'additionalInfo', 
                            'location']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const location = await Location.findOne({ _id: req.params.id})
        if (!location) {
            return res.status(404).send()
        }

        const proposal = new Proposal({
            locationId: req.params.id,
            ...req.body,
            createdBy: req.user._id,
            updatedBy: req.user._id
        })

        await proposal.save()
        res.status(202).send(proposal)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/locations/:id',  async (req, res) => {
    try {
        const location = await Location.findOneAndDelete({ _id: req.params.id })

        if (!location) {
            res.status(404).send()
        }

        res.send(location)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router