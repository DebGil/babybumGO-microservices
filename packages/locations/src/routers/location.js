const express = require('express')
const mongoose = require('mongoose')
const Location = require('../models/location')
const Proposal = require('../../../proposals/src/models/proposal')
//const {auth, access} = require('../../../common/src/middleware/auth')
const router = new express.Router()


router.post('/locations', async (req, res) => {
    const user = req.header('user')
    req.body._id = req.body.locationId
    delete req.body.locationId
    delete req.body.status
    const location = new Location({
         ...req.body,
         approvedBy: mongoose.Types.ObjectId(user._id)
         //ojo locationid
    })


    try {
        //location.save()
        res.status(201).send(location)
        //res.status(202).set('Location', `/proposals/${proposal._id}`).send({status : proposal.status})
    } catch (e) {
        res.status(400).send(e)
    }
    
})

// @route     GET /locations?latitude=latitude&longitude=longitude&distance=distance
router.get('/locations', async (req, res) => {
    console.log('getlocations')
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
    console.log('getlocation', _id)
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
    console.log('patchlocation')


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
    console.log('de;etelocations')

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