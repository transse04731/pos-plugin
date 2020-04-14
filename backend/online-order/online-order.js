const orderUtil = require('../../components/logic/orderUtil')
const {getBookingNumber, getVDate} = require('../../components/logic/productUtils')
const _ = require('lodash')
const io = require('socket.io-client');
const ProxyClient = require('@gigasource/nodejs-proxy-server/libs/client.js');
const url = require('url');
const axios = require('axios');

const {webshopUrl, backendUrl, webshopProxyServerPort} = global.APP_CONFIG;
let onlineOrderSocket = null;
let proxyClient = null;
let activeProxies = 0;

module.exports = cms => {
  cms.socket.on('connect', socket => {
    socket.on('registerOnlineOrderDevice', async (pairingCode, callback) => {
      try {
        let deviceId;
        const posSettings = await cms.getModel('PosSetting').findOne({});
        const {onlineDevice} = posSettings;

        if (onlineDevice.id && onlineDevice.paired) {
          deviceId = onlineDevice.id
        } else {
          const pairingApiUrl = `${webshopUrl}/online-order-device/register`
          const requestBody = {pairingCode}
          const requestResponse = await axios.post(pairingApiUrl, requestBody)
          deviceId = requestResponse.data.deviceId
        }

        if (!onlineOrderSocket) {
          onlineOrderSocket = io(`${webshopUrl}?clientId=${deviceId}`);
          onlineOrderSocket.on('createOrder', async (orderData, ackFn) => {
            await createOrder(orderData);
            ackFn();
          });

          onlineOrderSocket.on('startRemoteControl', callback => {
            activeProxies++;

            if (!proxyClient) {
              proxyClient = new ProxyClient({
                clientId: `${deviceId}-proxy-client`,
                proxyServerHost: url.parse(webshopUrl).hostname,
                socketIOPort: webshopProxyServerPort,
                remoteHost: url.parse(backendUrl).hostname,
                remotePort: url.parse(backendUrl).port,
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
        }

        if (typeof callback === 'function') callback(deviceId);
      } catch (e) {
        console.error('Device pairing error');
        callback(null);
      }
    });

    socket.on('unregisterOnlineOrderDevice', callback => {
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

    async function createOrder(orderData) {
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
      socket.emit('updateOnlineOrders')
    }
  })
}
