const _ = require('lodash')
const express = require('express')
const router = express.Router()

router.post('/subscribe', async (req, res) => {
    const subscriptionModel = cms.getModel('Subscription')
    const { email, storeId } = req.body
    const subscription = await subscriptionModel.findOne({ email })
    if (!subscription)
        await subscriptionModel.create({ email, store: storeId })
    res.status(200).json({ message: 'Subscribe succeeded' })
})

router.post('/unsubscribe', async(req, res) => {
    const subscriptionModel = cms.getModel('Subscription')
    const { email, storeId } = req.body
    await subscription.remove({email, store: storeId})
    res.status(200).send('Your email address has been removed from subscriber list. You\'re no longer to receive any email from this store.')
})

module.exports = router
