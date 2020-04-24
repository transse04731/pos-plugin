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
const uploadZone = {};
const mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};
router.get('/upload-zone/prepare', async (req, res) => {
    const {url} = req.query;
    const file = await tmp.file();
    const tempPath = file.path;
    await new Promise((resolve ,reject) => download(url, tempPath, resolve, reject));
    uploadZone[url] = tempPath;
    const s = fs.createReadStream(tempPath);
    const type = mime[path.extname(url).slice(1)] || 'text/plain';
    s.on('open', () => {
        res.setHeader('Content-Type', type);
        s.pipe(res)
    });
    s.on('error', function () {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
});

router.post('/upload-zone/clean', async (req, res) => {
    const {url} = req.body
    if (uploadZone[url]) {
        fs.unlink(uploadZone[url])
        res.json({ message: 'Cleaned' })
    } else {
        res.status(400).end()
    }
})

router.get('/generate-id', async (req, res) => {
  // TODO: Sync
  const ids = _.map(await cms.getModel('Store').find({}, { id: 1 }), store => store.id)
  let id = 0
  do {
    id++
  } while(_.includes(ids, id.toString()))
  res.status(200).json({ id })
})

function download(url, dest, cb, errCb) {
  const file = fs.createWriteStream(dest);
  https.get(url, res => {
    res.pipe(file);
    file.on('finish', () => file.close(cb));
  }).on('error', err => {
      fs.unlink(dest);
      errCb && errCb(err.message);
  });
}

module.exports = router
