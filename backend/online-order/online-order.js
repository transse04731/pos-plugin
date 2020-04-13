const orderUtil = require('../../components/logic/orderUtil')
const {getBookingNumber, getVDate} = require('../../components/logic/productUtils')
const _ = require('lodash')
const io = require('socket.io-client');
const ProxyClient = require('@gigasource/nodejs-proxy-server/libs/client.js');
const url = require('url');

const {webshopUrl, backendUrl, webshopProxyServerPort} = global.APP_CONFIG;
let onlineOrderSocket = null;
let proxyClient = null;

module.exports = cms => {
  cms.socket.on('connect', socket => {
    socket.on('registerOnlineOrderDevice', deviceId => {
      if (!onlineOrderSocket) {
        onlineOrderSocket = io(`${webshopUrl}?clientId=${deviceId}`);
        onlineOrderSocket.on('createOrder', async (orderData, ackFn) => {
          await createOrder(orderData);
          ackFn();
        })
      }

      if (!proxyClient) {
        proxyClient = new ProxyClient({
          clientId: `${deviceId}-proxy-client`,
          proxyServerHost: webshopUrl,
          socketIOPort: webshopProxyServerPort,
          remoteHost: url.parse(backendUrl).hostname,
          remotePort: url.parse(backendUrl).port,
          remoteSocketKeepAlive: true,
        });
        proxyClient.startProxy();
      }
    });

    socket.on('unregisterOnlineOrderDevice', () => {
      if (onlineOrderSocket) {
        onlineOrderSocket.off('createOrder');
        onlineOrderSocket.disconnect();
        onlineOrderSocket = null;
      }

      if (proxyClient) {
        proxyClient.destroy();
        proxyClient = null;
      }
    });

    async function createOrder(orderData) {
      if (!orderData) return
      const {orderType: type, paymentType, customer, products, deliveryTime} = orderData

      const date = new Date();
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
