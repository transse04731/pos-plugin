const uuidv1 = require('uuid')
const _ = require('lodash')
const express = require('express')
const router = express.Router()
const https = require('https');

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

// generate unique id for store
router.get('/generate-id', async (req, res) => {
  // TODO: Sync
  const ids = _.map(await cms.getModel('Store').find({}, { id: 1 }), store => store.id)
  let id = 0
  do {
    id++
  } while(_.includes(ids, id.toString()))
  res.status(200).json({ id })
})

// check if provided alias is unique or not
router.post('/validate-alias', async (req, res) => {
  const { store, alias } = req.body
  const storeWithAlias = await cms.getModel('Store').findOne({ alias: _.toLower(alias) })
  const urlTaken = (storeWithAlias && storeWithAlias._id.toString() !== store)
  res.json(urlTaken ? {message: 'WebShop URL has been taken!'} : {ok: true})
})

router.post('/validate-client-domain', async (req, res) => {
  const { store, clientDomain } = req.body
  const storeWithClientDomain = await cms.getModel('Store').findOne({ clientDomain })
  const urlTaken = (storeWithClientDomain && storeWithClientDomain._id.toString() !== store)
  res.json(urlTaken ? {message: 'Client domain has been taken!'} : {ok: true})
})

router.get('/order-token', async (req, res) => {
  res.json({ token: uuidv1.v1() })
})

module.exports = router
