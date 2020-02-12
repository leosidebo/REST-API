const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')

/** 
 * Get All Subscribers
 */
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
        res.send(subscribers)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

/** 
 * Get a Specific Subscriber
 */
router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber)
})

/** 
 * Create a New Subscriber
 */
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscriberToChannel: req.body.subscriberToChannel
    })

    try {
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

/** 
 * Update a Subscriber
 */
router.patch('/:id', getSubscriber, async (req, res) => {
    if(req.body.name != null) {
        res.subscriber.name = req.body.name
    }
    if (req.body.subscriberToChannel != null) {
        res.subscriber.subscriberToChannel = req.body.subscriberToChannel
    }

    try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/** 
 * Delete a Subscriber
 */
router.delete('/:id', getSubscriber, async (req, res) => {
    try {
        await res.subscriber.remove()
        res.json({ message: 'Deleted Subscriber'})
    } catch {
        res.json(500).json({ message: error.message })
    }
})

async function getSubscriber(req, res, next) {
    let subscriber
    try {
        subscriber = await Subscriber.findById(req.params.id)
        if(subscriber == null) {
            return res.status(404).json({ message: 'Cannot find Subscriber'})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    
    res.subscriber = subscriber
    next()
}

module.exports = router