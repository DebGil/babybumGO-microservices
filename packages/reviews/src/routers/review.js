const express = require('express')
const Review = require('../models/review')
const {auth, access} = require('../middleware/auth')
const mongoose = require('mongoose')
const router = new express.Router()

router.post('/reviews', auth, async (req, res) => {
    const review = new Review({
        ...req.body,
        createdBy: req.user._id
    })

    try {
        await review.save()
        res.status(201).send(review)
    } catch (e) {
        res.status(400).send(e)
    }
})

//      GET /reviews?locationId=id&rating=rating
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/reviews', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.rating) {
        match.rating = req.query.rating 
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

router.get('/reviews/:id', auth, async (req, res) => {
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

router.patch('/reviews/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['text', 'rating']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const review = await Review.findOne({ _id: req.params.id, createdBy: req.user._id})

        if (!review) {
            return res.status(404).send()
        }

        updates.forEach((update) => review[update] = req.body[update])
        await review.save()
        res.send(review)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/reviews/:id', auth, async (req, res) => {
   // const review = new Review()
    try {
        
        const review = (req.user.role === 'admin') ? await Review.findOneAndDelete({ _id: req.params.id }) : await Review.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

        if (!review) {
            res.status(404).send()
        }

        res.send(review)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router