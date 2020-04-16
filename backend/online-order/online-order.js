const orderUtil = require('../../components/logic/orderUtil')
const {getBookingNumber, getVDate} = require('../../components/logic/productUtils')
const _ = require('lodash')
const io = require('socket.io-client');
const ProxyClient = require('@gigasource/nodejs-proxy-server/libs/client.js');
const url = require('url');
const axios = require('axios');

const {webshopUrl, port: backendPort} = global.APP_CONFIG;
let onlineOrderSocket = null;
let proxyClient = null;
let activeProxies = 0;
let deviceSockets = [];

function createOnlineOrderSocket(deviceId) {
  if (!onlineOrderSocket) {
    onlineOrderSocket = io(`${webshopUrl}?clientId=${deviceId}`);
    onlineOrderSocket.on('createOrder', async (orderData, ackFn) => {
      if (!orderData) return
      const {orderType: type, paymentType, customer, products, deliveryTime, createdDate: dateString} = orderData

      const date = new Date(dateString)
      const items = orderUtil.getComputedOrderItems(products, date)
      const vDiscount = orderUtil.calOrderDiscount(items).toFixed(2)
      const vSum = (orderUtil.calOrderTotal(items) + orderUtil.calOrderModifier(items)).toFixed(2)
      const vTax = orderUtil.calOrderTax(items).toFixed(2)
      const taxGroups = _.groupBy(items, 'tax')
      const vTaxGroups = _.map(taxGroups, (val, key) => ({
        taxType: key,
        tax: orderUtil.calOrderTax(val),
        sum: orderUtil.calOrderTotal(val)
      }))

      const order = {
        id: await orderUtil.getLatestOrderId(),
        status: 'inProgress',
        items,
        customer,
        deliveryDate: deliveryTime,
        payment: [{type: paymentType, value: vSum}],
        type,
        date,
        vDate: await getVDate(date),
        bookingNumber: getBookingNumber(date),
        vSum,
        vTax,
        vTaxGroups,
        vDiscount,
        received: vSum,
        online: true
      }

      await cms.getModel('Order').create(order)
      deviceSockets.forEach(socket => socket.emit('updateOnlineOrders'))
      ackFn();
    });

    onlineOrderSocket.on('startRemoteControl', (proxyServerPort, callback) => {
      activeProxies++;

      if (!proxyClient) {
        proxyClient = new ProxyClient({
          clientId: `${deviceId}-proxy-client`,
          proxyServerHost: url.parse(webshopUrl).hostname,
          socketIOPort: proxyServerPort,
          remoteHost: 'localhost',
          remotePort: backendPort,
          remoteSocketKeepAlive: true,
          onConnect: callback,
        });
      } else {
        callback();
      }
    });

    onlineOrderSocket.on('stopRemoteControl', callback => {
      if (activeProxies > 0) activeProxies--;

      if (activeProxies === 0 && proxyClient) {
        proxyClient.destroy();
        proxyClient = null;
      }

      callback();
    });

    onlineOrderSocket.once('disconnect', () => {
      activeProxies = 0;
      if (proxyClient) {
        proxyClient.destroy();
        proxyClient = null;
      }
    })
  }
}

async function getDeviceId(pairingCode) {
  const posSettings = await cms.getModel('PosSetting').findOne({});
  const {onlineDevice} = posSettings;

  if (onlineDevice.id && onlineDevice.paired) {
    return onlineDevice.id
  } else {
    if (!pairingCode) {
      return null
    } else {
      const pairingApiUrl = `${webshopUrl}/device/register`
      const requestBody = {pairingCode}
      try {
        const requestResponse = await axios.post(pairingApiUrl, requestBody)
        return requestResponse.data.deviceId
      } catch (e) {
        console.error(e)
        return null
      }
    }
  }
}

module.exports = async cms => {
  const deviceId = await getDeviceId()
  if (deviceId) createOnlineOrderSocket(deviceId)

  cms.socket.on('connect', socket => {
    deviceSockets.push(socket)

    socket.on('disconnect', () => deviceSockets = deviceSockets.filter(sk => sk !== socket))

    socket.on('registerOnlineOrderDevice', async (pairingCode, callback) => {
      const deviceId = await getDeviceId(pairingCode)

      if (deviceId) {
        createOnlineOrderSocket(deviceId)
        if (typeof callback === 'function') callback(deviceId)
      } else {
        callback(null)
      }
    });

    socket.on('unregisterOnlineOrderDevice', async callback => {
      const posSettings = await cms.getModel('PosSetting').findOne({});
      const {onlineDevice} = posSettings;

      const unregisterApiUrl = `${webshopUrl}/device/unregister`;
      const requestBody = {_id: onlineDevice.id};

      try {
        await axios.post(unregisterApiUrl, requestBody);
      } catch (e) {
        if (e.response.status === 400) {
          // throw error is not necessary because device does not exist on server
          console.error('Unpair error: device ID doest not exist on server');
        } else {
          throw e;
        }
      }

      if (onlineOrderSocket) {
        onlineOrderSocket.off('createOrder');
        onlineOrderSocket.disconnect();
        onlineOrderSocket = null;
      }

      if (proxyClient) {
        proxyClient.destroy();
        proxyClient = null;
      }

      callback();
    });
  })
}
