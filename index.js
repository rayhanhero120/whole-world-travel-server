const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()
const app = express()
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
        const orderCollection = database.collection('users')

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        //  GET API
        app.get('/users', async (req, res) => {
            const cursor = orderCollection.find({})
            const users = await cursor.toArray()
            res.send(users)
        })

        //user id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const user = await orderCollection.findOne(query)
            console.log('load user', id)
            res.send(user)
        })

        //  add orders api
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await orderCollection.insertOne(user)
            res.json(result)
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
            const result = await orderCollection.updateOne(filter, updateDoc, options)
            console.log('updating user', req)
            res.json(result)
        })

        //delete api
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
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
