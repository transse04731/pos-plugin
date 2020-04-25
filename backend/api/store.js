const _ = require('lodash')
const express = require('express')
const router = express.Router()
const https = require('https');
const fs = require('fs');
const path = require('path')
const tmp = require('tmp-promise')

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

// upload-zone
router.get('/upload-zone/prepare', async (req, res) => https.get(req.query.url, getRes => getRes.pipe(res)));

router.get('/generate-id', async (req, res) => {
  // TODO: Sync
  const ids = _.map(await cms.getModel('Store').find({}, { id: 1 }), store => store.id)
  let id = 0
  do {
    id++
  } while(_.includes(ids, id.toString()))
  res.status(200).json({ id })
})

module.exports = router
