const orderUtil = require('../../components/logic/orderUtil')
const  { getBookingNumber, getVDate } = require('../../components/logic/productUtils')

module.exports = cms => {
  cms.socket.on('connect', socket => {
    socket.on('createOrder', async orderData => {
      if (!orderData) return
      const { orderType: type, paymentType, customer, products, deliveryTime } = orderData
      
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
        status: 'pending',
        items,
        customer,
        deliveryDate: deliveryTime,
        payment: [{type: paymentType, value: vSum}],
        type,
        date,
        vDate: getVDate(date),
        bookingNumber: getBookingNumber(date),
        vSum,
        vTax,
        vTaxGroups,
        vDiscount,
        received: vSum
      }

      await cms.getModel('Order').create(order)
      socket.emit('updateOnlineOrders')

/* Sample data:
      {
        "orderType": "delivery",
          "paymentType": "cash",
          "customer": {
            "name": "",
            "phone": "",
            "address": "",
            "zipCode": ""
          },
        "products": [
        {
          "_id": "5e9004a74e9c0a1a20d07719",
          "image": "http://localhost:8888/cms-files/files/view//download (2).jpeg",
          "name": "Cocacola",
          "desc": "Delicious",
          "price": 1,
          "category": [
            "Object"
          ],
          "attributes": [],
          "layouts": [],
          "tax": 7,
          "id": "5",
          "groupPrinter": [
            "Object"
          ],
          "quantity": 1
        }
      ],
          "deliveryTime": "2020-04-11T12:00:01.819Z",
          "note": ""
      }
*/
    })
  })
}
