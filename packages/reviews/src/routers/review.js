const express = require('express')
const Review = require('../models/review')
const mongoose = require('mongoose')
const router = new express.Router()

//auth
router.post('/reviews', async (req, res) => {
    const user = JSON.parse(req.header('user'))._id

    const review = new Review({
        ...req.body,
        createdBy: new mongoose.Types.ObjectId(user)
    })
    console.log ('review', review)

    try {
        await review.save()
        res.status(201).send(review)
    } catch (e) {
        res.status(400).send(e)
    }
})

//      GET /reviews?locationId=id&rating=rating
// GET /reviews?limit=10&skip=20
// GET /reviews?sortBy=createdAt:desc
router.get('/reviews', async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.rating) {
        match.rating = req.query.rating 
    }

    if (req.query.locationId) {
        match.locationId = req.query.locationId
    }
    
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {

        const review = await Review.find( match ).sort(sort).limit(parseInt(req.query.limit))
        console.log(review)

        if (!review) {
            return res.status(404).send()
        }
        res.send(review)
    } catch (e) {
        res.status(500).send()
    }


})

router.get('/reviews/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const review = await Review.findOne({ _id })

        if (!review) {
            return res.status(404).send()
        }

        res.send(review)
    } catch (e) {
        res.status(500).send()
    }
})

//auth
router.patch('/reviews/:id', async (req, res) => {
    const user = JSON.parse(req.header('user'))._id
    try {
        const review = await Review.findOne({ _id: req.params.id, createdBy: user})

        if (!review) {
            return res.status(404).send()
        }

        const updates = Object.keys(req.body)
        console.log('proposal updates', updates)

        updates.forEach((update) => review[update] = req.body[update])

        await review.save()
        res.send(review)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/reviews/:id', async (req, res) => {
    const user = JSON.parse(req.header('user'))._id
    const role = JSON.parse(req.header('user')).role
    
    console.log('user', user, role)
    try {
        
        const review = (role === 'admin') ? await Review.findOneAndDelete({ _id: req.params.id }) : await Review.findOneAndDelete({ _id: req.params.id, createdBy: user });

        if (!review) {
            res.status(404).send()
        }

        res.send(review)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router