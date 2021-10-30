
const express =require('express');
const { MongoClient } = require('mongodb');
const ObjectId =require('mongodb').ObjectId;

const cors= require('cors');
require('dotenv').config();


const app=express();
const port= process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4scxf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){

    try{
        await client.connect();
        const database= client.db('vistBangladesh');
        const servicesCollection = database.collection('services');
        const userBookings = database.collection('booking');


          //Get all data from db
          app.get('/services', async (req, res)=> {
            const cursor =servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })


        //POST API  // send data from clientside
        app.post('/services', async (req,res) => {
            
            const service =req.body;
            const result= await servicesCollection.insertOne(service);
            // console.log(result)
            res.json(result)
        });

        app.post('/myBookings', async (req,res) => {
            const booking =req.body;
            const result= await userBookings.insertOne(booking);
            // console.log(result)
            res.json(result)
        });

      
        app.get('/myBookings', async (req,res) => {
            const cursor = userBookings.find({});
            const booking= await cursor.toArray();
            // console.log(result)
            res.send(booking)
        });

      

       

        //delete booking
        app.delete('/myBookings/:id', async (req,res) => {
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const result= await userBookings.deleteOne(query);
            res.json(result)
        });

        //updating
        app.put('/myBookings/:id', async (req,res)=> {
            const id =req.params.id;
            const updatedItem = req.body;
            const filter= {_id: ObjectId(id)};
            console.log(filter);
            
            const options = {upsert: true};
            const updateDoc = {
              $set: {
                status: updatedItem.status
              }
            };
            const result= await userBookings.updateOne(filter, updateDoc, options);
            console.log('updating', id);
            res.json(result)
        });


    }
    finally{
        // await client.close();
    };

}

run().catch(console.dir);

 

app.get('/', (req,res)=> {
    res.send('visitBd server')
})

app.listen(port,() => {
    console.log('Running on server', port)
})