const redisPubSibService = require('../services/redisPubSib.service')

class InventoryServiceTest {
  constructor () {
    redisPubSibService.subscribe('purchase_events', (chanel, message) => {
      InventoryServiceTest.updateInventory(message)
    })
  }

  static updateInventory (productId, quantity) {
    console.log(`Update inventory ${productId} with quantity ${quantity}`)
  }
}

module.exports = new InventoryServiceTest()
