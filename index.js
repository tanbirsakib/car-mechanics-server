const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mgweq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{

        await client.connect()
        const database = client.db('carMechanics');
        const servicesCollection = database.collection('services');

        //POST API
        app.post('/services', async(req, res) =>{
            const service = req.body;
            console.log('hitting the api')
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.send(result);
        })
        //GET API
        app.get('/services', async(req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query)
            const services =await cursor.toArray();
            res.send(services)
            
        })
    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("running the server");
})

app.listen(port, ()=>{
    console.log("listenign the port", port);
})