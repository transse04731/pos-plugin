const uuidv1 = require('uuid')
const _ = require('lodash')
const express = require('express')
const router = express.Router()
const https = require('https');
const tmp = require('tmp-promise');

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

router.post('/upload-zone/clean', async (req, res) => {
  const {url} = req.body
  if (uploadZone[url]) {
    fs.unlink(uploadZone[url])
    res.json({ message: 'Cleaned' })
  } else {
    res.status(400).end()
  }
})

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
