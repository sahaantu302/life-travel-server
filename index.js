const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;


// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://lifeTravel:FQHTvdq56qDUSejH@cluster0.a3ldb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("lifeTravel");
        const usersCollection = database.collection("users");
        const ordersCollection = database.collection("orders");
        //GET API
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollection.findOne(query);
            console.log('load user with id', id);
            res.send(user);
        })
        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await ordersCollection.findOne(query);
            console.log('load user with id', id);
            res.send(user);
        })

        // POST API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('Got New User', req.body);
            console.log('Added User', result);
            // res.send('hit the post');
            res.json(result);
        })
        app.post('/orders', async (req, res) => {
            const newUser = req.body;
            const result = await ordersCollection.insertOne(newUser);
            res.json(result);
        })

        // UPDATE API
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    des: updateUser.des,
                    email: updateUser.email,
                    price: updateUser.price,
                    img: updateUser.img,
                    address: updateUser.address,
                    status: updateUser.status
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc, options)
            console.log('Updating user', id)
            res.json(result);
        })

        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            console.log('delete user with id', id);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Travel life Server');
})
app.listen(port, () => {
    console.log('Running server on port', port);
})