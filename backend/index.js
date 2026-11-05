import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ac-zgr00ce-shard-00-00.hffrouf.mongodb.net:27017,ac-zgr00ce-shard-00-01.hffrouf.mongodb.net:27017,ac-zgr00ce-shard-00-02.hffrouf.mongodb.net:27017/?ssl=true&replicaSet=atlas-97vqqn-shard-0&authSource=admin`;
const client = new MongoClient(uri);

const db = client.db("Paharika");
const destinationCollection = db.collection("destinations");

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.dir(err);
  }
}
connectToMongoDB();

app.get('/', (req, res) => {
  res.send('Paharika Server is running');
});

// GET all destinations from MongoDB
app.get('/destinations', async (req, res) => {
  try {
    const cursor = destinationCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  } catch (err) {
    console.error("Error fetching destinations:", err);
    res.status(500).json({ message: 'Error fetching destinations' });
  }
});


// POST add a new destination into MongoDB
app.post('/add-destination', async (req, res) => {
  try {
    const newDestination = req.body;
    console.log("Adding destination to MongoDB:", newDestination?.name);
    const result = await destinationCollection.insertOne(newDestination);
    res.send(result);
  } catch (err) {
    console.error("Error adding destination:", err);
    res.status(500).send({ error: 'Failed to add destination' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
