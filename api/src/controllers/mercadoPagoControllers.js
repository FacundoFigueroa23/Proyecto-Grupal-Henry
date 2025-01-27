const Order = require('../models/Order.js')
const mercadopago = require ('mercadopago')
require('dotenv').config()
const { ACCESS_TOKEN } = process.env
const {getOrder} = require('./utils.js')

mercadopago.configure({access_token: `${ACCESS_TOKEN}`})

async function getId(req, res, next){
    const {user_id, order_id} = req.params
    try{
        const order = await getOrder(user_id, order_id)
        const items_mp = order.items.map(item => ({
            title: item.name,
            unit_price: item.price,
            quantity: item.quantity
        }))
        let preference = {
            items: items_mp,
            external_reference : `${order_id}`,
            payment_methods: {
                excluded_payment_types: [
                  {
                    id: "atm"
                  }
                ],
                installments: 3  //Cantidad máximo de cuotas
            },
            back_urls: {
                success: 'http://localhost:3001/mercadopago/pagos',
                failure: 'http://localhost:3001/mercadopago/pagos',
                pending: 'http://localhost:3001/mercadopago/pagos',
            }
        }
        const response = await mercadopago.preferences.create(preference)
        global.id = response.body.id
        return res.status(200).send({id: global.id})
    }catch(error){
        next(error)
    }
}

async function getPayments(req, res, next){
    const {payment_id, external_reference, merchant_order_id} = req.query
    const payment_status = req.query.status
    try{
        const order = await Order.findById(external_reference)
        order.payment_id= payment_id
        order.payment_status= payment_status
        order.merchant_order_id = merchant_order_id
        order.status = "completed"
        await order.save()
        return res.status(200).send("¡Compra completada!")
    }catch(error){
        next(error)
    }
}

async function getPaymentOrder(req, res, next){
    const {id} = req.params
    try{
        const mp = new mercadopago(ACCESS_TOKEN)
        const payment = mp.get(`/v1/payments/search`, {'external_reference': id})
        return res.status(200).send(payment)
    }catch(error){
        next(error)
    }
}

module.exports = {
    getId,
    getPayments,
    getPaymentOrder
}