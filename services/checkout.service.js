'use strict'
const stripe = require('stripe')(process.env.STRIPE_SECRET)

const createPaymentIntents = async ({ product }) => {
  const payment = await stripe.paymentIntents.create({
    amount: product.plan_price,
    currency: 'VND',
    description: 'TEST',
    automatic_payment_methods: {
      enabled: true
    }
  })

  return payment.client_secret
}

module.exports = { createPaymentIntents }
