const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const { query } = require('express')
const port = process.env.PORT || 5000

//middlwere
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crs5f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db('worldTravel')
        const serviceCollection = database.collection('services')
        const usersCollection = database.collection('users')
        const orderCollection = database.collection('myOrders')

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })
        //get single service
        app.get('/singleService/:id', async (req, res) => {
            const result = await serviceCollection.find({ _id: ObjectId(req.params.id) }).toArray()
            res.send(result[0])
        })
        //Ordercollection
        app.get('/order', async (req, res) => {
            const person = { name: 'rayhan' }
            const result = await orderCollection.insertOne(person)
            res.send(result)
        })
        app.post('/order', async (req, res) => {
            const result = await orderCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/myOrders/:email', async (req, res) => {
            const result = await orderCollection.find({ email: req.params.email }).toArray()
            res.send(result)

        })

        app.delete('/deleteMyOrder/:id', async (req, res) => {
            const result = await orderCollection.deleteOne({ _id: ObjectId(req.params.id), })
            res.send(result)
        })

        //user id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const user = await usersCollection.findOne(query)
            console.log('load user', id)
            res.send(user)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id
            const updateUser = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                },
            }
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log('updating user', req)
            res.json(result)
        })

        //delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await usersCollection.deleteOne(query)
            console.log('delere', id)
            res.json(result)
        })


    }
    finally {
        // await client.close()
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('world travel server is run')
})
app.listen(port, () => {
    console.log('server running at port', port)
})
