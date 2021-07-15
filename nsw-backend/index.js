const cors = require('cors')
const express = require('express')
const stripe = require('stripe')('sk_test_51JBklrANCwk8x2WbXCP8pa6SF2gwu4aDc5aClOAakukVtvqBgT1ZQchrm7DrsdyQXbk7NGkDDPd6YbtKyj8f93jg00X6DYNUKR')
const uuid = require('uuid')

const app = express()

//middleware
app.use(express.json())
app.use(cors())

//routes 

app.get('/', (req, res) => {
    res.send("it works!!!");
});

app.post('/payment', (req, res) => {

    const {product, token} = req.body;
    console.log('PRODUCT ', product);
    console.log('PRICE', product.price);
    const idempotencyKey = uuid()

    return stripe.customers.create({
        email: token.email, 
        source: token.id,
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            recipient_email: token.email,
            description: product.name,
            phone: token.phone,
        }, {idempotencyKey})
    })
    .then (result => res.status(200).json(result))
    .catch(err => console.log(err)) 
})

//listen

app.listen(8282, () => console.log('Listening at Port8282'));

